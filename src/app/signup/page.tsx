'use client'

import { useState } from 'react'
import { useSupabase } from '@/app/providers'
import { useRouter, useSearchParams } from 'next/navigation'
import { Music, Store, Building2, Star, ArrowRight } from 'lucide-react'

const ROLES = [
  {
    value: 'supporter',
    icon: Star,
    title: 'Supporter',
    description: 'Shop, listen, support artists',
    color: 'text-[var(--pf-orange)]',
    bgColor: 'bg-[var(--pf-orange)]/10',
  },
  {
    value: 'artist',
    icon: Music,
    title: 'Artist',
    description: 'Upload music, sell merch, earn from everything',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    value: 'business',
    icon: Store,
    title: 'Small Business',
    description: 'Sell products, reach music fans',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    value: 'brand',
    icon: Building2,
    title: 'Brand',
    description: 'Sponsor artists, run campaigns',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
]

export default function SignupPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedRole = searchParams.get('role')
  
  const [step, setStep] = useState(preselectedRole ? 2 : 1)
  const [selectedRole, setSelectedRole] = useState(preselectedRole || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    referral_code: '',
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: selectedRole,
          },
        },
      })

      if (signUpError) throw signUpError

      // Create profile with role
      if (data.user) {
        await supabase.from('profiles').update({
          role: selectedRole,
          name: formData.name,
        }).eq('id', data.user.id)

        // If referred, create referral
        if (formData.referral_code) {
          const { data: referrer } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', formData.referral_code)
            .single()

          if (referrer) {
            await supabase.from('referrals').insert({
              referrer_id: referrer.id,
              referred_id: data.user.id,
              referral_code: formData.referral_code,
            })
          }
        }
      }

      // Redirect based on role
      if (selectedRole === 'artist') {
        router.push('/dashboard/artist')
      } else if (selectedRole === 'business' || selectedRole === 'brand') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join the Economy</h1>
          <p className="text-[var(--pf-text-secondary)]">
            {step === 1 ? 'What describes you?' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4">
            {ROLES.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  setSelectedRole(role.value)
                  setStep(2)
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedRole === role.value
                    ? 'border-[var(--pf-orange)] bg-[var(--pf-orange)]/10'
                    : 'border-[var(--pf-border)] hover:border-[var(--pf-border-hover)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${role.bgColor} flex items-center justify-center`}>
                    <role.icon className={role.color} size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-[var(--pf-text-secondary)]">{role.description}</p>
                  </div>
                </div>
              </button>
            ))}

            {/* Superfan special CTA */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Star className="text-purple-400" size={24} />
                <h3 className="font-semibold text-purple-400">Become a Superfan</h3>
              </div>
              <p className="text-sm text-[var(--pf-text-secondary)] mb-4">
                Promote artists you love and earn from every sale. Get referral commissions while supporting creators.
              </p>
              <button
                onClick={() => {
                  setSelectedRole('supporter')
                  setStep(2)
                }}
                className="pf-btn bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
              >
                Learn More <ArrowRight className="inline ml-1" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Signup Form */}
        {step === 2 && (
          <form onSubmit={handleSignup} className="pf-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-[var(--pf-text-secondary)] hover:text-white"
              >
                ← Choose different role
              </button>
              <span className="text-sm text-[var(--pf-orange)] capitalize">
                {ROLES.find(r => r.value === selectedRole)?.title}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="pf-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className="pf-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
                className="pf-input"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Referral Code (optional)</label>
              <input
                type="text"
                value={formData.referral_code}
                onChange={(e) => setFormData(prev => ({ ...prev, referral_code: e.target.value.toUpperCase() }))}
                placeholder="PF-XXXXXXXX"
                className="pf-input"
              />
              <p className="text-xs text-[var(--pf-text-muted)] mt-1">
                Enter a referral code from a friend to support them
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pf-btn pf-btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-[var(--pf-text-muted)]">
              Already have an account?{' '}
              <a href="/login" className="text-[var(--pf-orange)] hover:underline">
                Sign in
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}