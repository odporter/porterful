'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/app/providers'
import { useRouter } from 'next/navigation'

export default function ApplyFormPage() {
  const { user } = useSupabase()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    stage_name: '',
    genre: '',
    city: '',
    bio: '',
    email: '',
    phone: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    soundcloud: '',
    spotify: '',
    apple_music: '',
    has_cover_image: false,
    has_avatar: false,
    cover_image_url: '',
    avatar_url: '',
    agree_terms: false,
    agree_exclusive: false,
  })

  const handleSubmit = async () => {
    if (!user) {
      router.push('/signup?role=artist')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/artist-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: user.id }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch {
      alert('Connection error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--pf-bg)] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Application Submitted</h1>
          <p className="text-[var(--pf-text-secondary)] mb-6">
            We received your application. Our team will review it and get back to you within 24–48 hours.
          </p>
          <p className="text-sm text-[var(--pf-text-muted)] mb-8">
            You will be notified when your artist page goes live.
          </p>
          <Link href="/" className="pf-btn pf-btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-xl text-white placeholder:text-[var(--pf-text-muted)] focus:outline-none focus:border-[var(--pf-orange)] transition-colors'
  const labelClass = 'block text-sm font-medium mb-2'

  return (
    <div className="min-h-screen bg-[var(--pf-bg)]">
      {/* Header */}
      <div className="border-b border-[var(--pf-border)]">
        <div className="pf-container py-4 flex items-center justify-between">
          <Link href="/apply" className="text-xl font-bold">← Back</Link>
          <div className="text-sm text-[var(--pf-text-muted)]">
            Step {step} of 5
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--pf-bg-secondary)]">
        <div
          className="h-full bg-[var(--pf-orange)] transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="pf-container py-8 max-w-xl mx-auto">
        {/* Step 1: About You */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
            <p className="text-[var(--pf-text-secondary)] mb-6">Step 1 of 5 — Basic info</p>

            <div className="bg-gradient-to-r from-[var(--pf-orange)]/5 to-purple-500/5 border border-[var(--pf-orange)]/10 rounded-xl p-4 mb-8">
              <p className="text-sm text-[var(--pf-text-secondary)]">
                <span className="text-[var(--pf-orange)] font-medium">This is a curated space.</span> Every application is reviewed personally.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Stage Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="How fans will know you"
                  value={form.stage_name}
                  onChange={e => setForm({ ...form, stage_name: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Primary Genre *</label>
                <select
                  className={inputClass}
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                >
                  <option value="">Select a genre</option>
                  <option value="Hip-Hop">Hip-Hop / Rap</option>
                  <option value="R&B">R&B / Soul</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Gospel">Gospel / Christian</option>
                  <option value="Latin">Latin</option>
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Where you are based"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Bio *</label>
                <textarea
                  className={inputClass + ' min-h-[120px] resize-none'}
                  placeholder="Tell fans who you are. Where you are from. What makes your music unique."
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  maxLength={500}
                />
                <div className="text-right text-xs text-[var(--pf-text-muted)] mt-1">
                  {form.bio.length}/500
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--pf-border)]">
                <div className="bg-gradient-to-r from-[var(--pf-orange)]/5 to-purple-500/5 border border-[var(--pf-orange)]/10 rounded-xl p-4 mb-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">
                    <span className="text-[var(--pf-orange)] font-medium">This is a partnership.</span> If approved, we will need to reach you directly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={form.email || user?.email || ''}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="(555) 555-5555"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {!user && (
                <div className="bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 rounded-xl p-4">
                  <p className="text-sm">
                    You need an account to continue.{" "}
                    <Link href="/signup?role=artist" className="text-[var(--pf-orange)] font-medium hover:underline">
                      Sign up free →
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Social */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Social media links</h1>
            <p className="text-[var(--pf-text-secondary)] mb-8">Step 2 of 5 — Where fans can find you</p>

            <div className="space-y-5">
              {[
                { field: 'instagram', label: 'Instagram', placeholder: '@yourusername' },
                { field: 'youtube', label: 'YouTube', placeholder: '@yourchannel or channel URL' },
                { field: 'tiktok', label: 'TikTok', placeholder: '@yourusername' },
                { field: 'twitter', label: 'Twitter / X', placeholder: '@yourusername' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form] as string}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Music Links */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Music platforms</h1>
            <p className="text-[var(--pf-text-secondary)] mb-8">Step 3 of 5 — Where your music lives</p>

            <div className="space-y-5">
              {[
                { field: 'spotify', label: 'Spotify', placeholder: 'Artist profile URL or @username' },
                { field: 'apple_music', label: 'Apple Music', placeholder: 'Artist profile URL' },
                { field: 'soundcloud', label: 'SoundCloud', placeholder: 'Profile URL or @username' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form] as string}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}

              <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-4">
                <p className="text-sm text-[var(--pf-text-secondary)]">
                  Once approved, you will be able to upload tracks directly to Porterful and set your own prices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Assets */}
        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Your images</h1>
            <p className="text-[var(--pf-text-secondary)] mb-8">Step 4 of 5 — Help us set up your page</p>

            <div className="space-y-5">
              <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-4">
                <p className="text-sm text-[var(--pf-text-secondary)]">
                  Our team will design your artist page. Upload images below if you have them ready.
                </p>
              </div>

              <div>
                <label className={labelClass}>Profile Photo / Avatar</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="Link to your photo (IMG, JPEG, PNG)"
                  value={form.avatar_url}
                  onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                />
                <p className="text-xs text-[var(--pf-text-muted)] mt-1">Square image works best (1:1 ratio)</p>
              </div>

              <div>
                <label className={labelClass}>Cover / Banner Image</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="Link to your banner image"
                  value={form.cover_image_url}
                  onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                />
                <p className="text-xs text-[var(--pf-text-muted)] mt-1">Wide image works best (3:1 ratio or similar)</p>
              </div>

              <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-4">
                <p className="text-sm text-[var(--pf-text-secondary)]">
                  Do not have images ready? We will create a default page. You can update images once your page is live.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Review your application</h1>
            <p className="text-[var(--pf-text-secondary)] mb-8">Step 5 of 5 — Submit when ready</p>

            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl divide-y divide-[var(--pf-border)] mb-6">
              {[
                { label: 'Stage Name', value: form.stage_name || '—' },
                { label: 'Genre', value: form.genre || '—' },
                { label: 'City', value: form.city || '—' },
                {
                  label: 'Social',
                  value: [
                    form.instagram && `IG: @${form.instagram}`,
                    form.youtube && `YT: ${form.youtube}`,
                    form.tiktok && `TT: @${form.tiktok}`,
                    form.twitter && `X: @${form.twitter}`,
                  ].filter(Boolean).join(' · ') || '—',
                },
                {
                  label: 'Images',
                  value: [
                    form.avatar_url ? 'Avatar provided' : 'No avatar',
                    form.cover_image_url ? 'Banner provided' : 'No banner',
                  ].join(' · '),
                },
              ].map(({ label, value }) => (
                <div key={label} className="p-4">
                  <div className="text-xs text-[var(--pf-text-muted)] uppercase tracking-wider mb-1">{label}</div>
                  <div className="font-medium text-sm">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] accent-[var(--pf-orange)]"
                  checked={form.agree_terms}
                  onChange={e => setForm({ ...form, agree_terms: e.target.checked })}
                />
                <span className="text-sm text-[var(--pf-text-secondary)]">
                  I agree to Porterful's{" "}
                  <Link href="/terms" className="text-[var(--pf-orange)]">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-[var(--pf-orange)]">Privacy Policy</Link>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] accent-[var(--pf-orange)]"
                  checked={form.agree_exclusive}
                  onChange={e => setForm({ ...form, agree_exclusive: e.target.checked })}
                />
                <span className="text-sm text-[var(--pf-text-secondary)]">
                  My music on Porterful will be exclusive to this platform.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3.5 bg-[var(--pf-surface)] border border-[var(--pf-border)] text-white font-medium rounded-xl hover:border-[var(--pf-orange)] transition-colors"
            >
              Back
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.stage_name}
              className="flex-1 py-3.5 bg-[var(--pf-orange)] text-white font-bold rounded-xl hover:bg-[var(--pf-orange-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.agree_terms || !form.agree_exclusive || submitting}
              className="flex-1 py-3.5 bg-[var(--pf-orange)] text-white font-bold rounded-xl hover:bg-[var(--pf-orange-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
