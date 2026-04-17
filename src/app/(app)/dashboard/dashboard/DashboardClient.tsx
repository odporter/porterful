'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/app/providers'
import { useWallet } from '@/lib/wallet-context'
import {
  Package, Users, DollarSign, Plus, Settings,
  Store, Music, Upload, ShieldCheck, Copy, Check,
  ExternalLink, ArrowRight,
} from 'lucide-react'

interface DashboardStats {
  total_sales: number
  total_orders: number
  total_products: number
  artist_fund_generated: number
  this_month: { sales: number; orders: number; growth: string }
}

const EMPTY_STATS: DashboardStats = {
  total_sales: 0,
  total_orders: 0,
  total_products: 0,
  artist_fund_generated: 0,
  this_month: { sales: 0, orders: 0, growth: '0%' },
}

interface DashboardClientProps {
  serverProfileId: string
  lkId: string
  initialProfile: any
}

export default function DashboardClient({ serverProfileId, lkId, initialProfile }: DashboardClientProps) {
  const { supabase } = useSupabase()
  const { balance } = useWallet()

  const [mounted, setMounted] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS)
  const [profile, setProfile] = useState<any>(initialProfile)
  const [copied, setCopied] = useState<'page' | 'ref' | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || !serverProfileId) return
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, serverProfileId, supabase])

  async function loadDashboard() {
    if (!supabase || !serverProfileId) return
    try {
      const profileData = initialProfile
      setProfile(profileData)

      if (profileData?.role === 'supporter' || profileData?.role === 'superfan') {
        setStats(EMPTY_STATS)
        setDataLoading(false)
        return
      }

      if (profileData?.role === 'artist') {
        const { data: orderItemsData } = await supabase
          .from('order_items')
          .select('order_id, price, quantity')
          .eq('seller_id', serverProfileId)

        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', serverProfileId)

        const uniqueOrderIds = new Set((orderItemsData || []).map((item: any) => item.order_id).filter(Boolean))
        const totalOrders = uniqueOrderIds.size
        const totalSales = (orderItemsData || []).reduce(
          (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        )

        setStats({
          total_sales: totalSales,
          total_orders: totalOrders,
          total_products: productsCount || 0,
          artist_fund_generated: totalSales * 0.1,
          this_month: { sales: totalSales, orders: totalOrders, growth: '0%' },
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setDataLoading(false)
    }
  }

  function copy(type: 'page' | 'ref', text: string) {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!mounted || dataLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="pf-container">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--pf-surface)] rounded w-1/4" />
            <div className="h-32 bg-[var(--pf-surface)] rounded" />
          </div>
        </div>
      </div>
    )
  }

  const isArtist = profile?.role === 'artist'
  const isSupporter = !isArtist

  // ─── Supporter ───────────────────────────────────────────────────────────
  if (isSupporter) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="pf-container max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">{profile?.full_name || 'My'} Dashboard</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] border border-[var(--pf-orange)]/30 mt-1 inline-block">
                {profile?.role || 'supporter'}
              </span>
            </div>
            <Link href="/settings/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors text-sm">
              <Settings size={14} />
              Settings
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="pf-card p-5 border border-[var(--pf-orange)]/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--pf-text-muted)]">Wallet</span>
                <DollarSign size={16} className="text-[var(--pf-orange)]" />
              </div>
              <p className="text-2xl font-bold">${(balance / 100).toFixed(2)}</p>
              <Link href="/wallet" className="text-xs text-[var(--pf-orange)] hover:underline mt-1 inline-block">Add funds</Link>
            </div>
            <div className="pf-card p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--pf-text-muted)]">Purchases</span>
                <Package size={16} className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-[var(--pf-text-muted)] mt-1">No purchases yet</p>
            </div>
            <div className="pf-card p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--pf-text-muted)]">Referrals</span>
                <Users size={16} className="text-purple-400" />
              </div>
              <p className="text-2xl font-bold">{profile?.total_referrals || 0}</p>
              <p className="text-xs text-[var(--pf-text-muted)] mt-1">Network earnings</p>
            </div>
          </div>

          <div className="pf-card p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Want to sell on Porterful?</p>
              <p className="text-xs text-[var(--pf-text-muted)] mt-0.5">Apply as an artist or creator</p>
            </div>
            <Link href="/apply" className="pf-btn pf-btn-primary text-sm">
              Apply to Sell <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Artist ───────────────────────────────────────────────────────────────
  const profileFields = [
    profile?.full_name,
    profile?.bio,
    profile?.avatar_url,
    profile?.genre,
    profile?.city,
    profile?.instagram_url || profile?.youtube_url || profile?.twitter_url || profile?.tiktok_url,
  ].filter(Boolean)
  const completionPct = profile ? Math.round((profileFields.length / 6) * 100) : 0

  // Single dynamic primary CTA
  const primaryCTA = !profile?.likeness_verified
    ? { label: 'Verify Likeness', sub: 'Required to receive payouts', href: '/dashboard/dashboard/likeness', icon: <ShieldCheck size={20} />, color: 'from-orange-500/20 to-amber-500/10 border-[var(--pf-orange)]/30' }
    : !profile?.full_name || !profile?.bio
    ? { label: 'Finish your profile', sub: 'Add your name and bio to go live', href: '/dashboard/dashboard/artist/edit', icon: <ArrowRight size={20} />, color: 'from-purple-500/15 to-blue-500/10 border-purple-500/30' }
    : !profile?.avatar_url
    ? { label: 'Add a photo', sub: 'A face builds trust with fans', href: '/dashboard/dashboard/artist/edit', icon: <ArrowRight size={20} />, color: 'from-purple-500/15 to-blue-500/10 border-purple-500/30' }
    : stats.total_products === 0
    ? { label: 'Add your first product', sub: 'Start making money while you sleep', href: '/dashboard/dashboard/add-product', icon: <Plus size={20} />, color: 'from-green-500/15 to-emerald-500/10 border-green-500/30' }
    : !profile?.artist_slug
    ? { label: 'Set your page URL', sub: 'Publish your artist page', href: '/dashboard/dashboard/artist/edit', icon: <ExternalLink size={20} />, color: 'from-blue-500/15 to-cyan-500/10 border-blue-500/30' }
    : { label: 'Share your page', sub: `porterful.com/artist/${profile.artist_slug}`, href: null, icon: <Copy size={20} />, color: 'from-[var(--pf-orange)]/15 to-amber-500/10 border-[var(--pf-orange)]/30' }

  const pageUrl = profile?.artist_slug ? `https://porterful.com/artist/${profile.artist_slug}` : null
  const refUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://porterful.com'}/?ref=${profile?.referral_code || ''}`

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || 'Artist'} Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] border border-[var(--pf-orange)]/30">
                {profile?.role || 'artist'}
              </span>
              {completionPct < 100 && (
                <span className="text-xs text-[var(--pf-text-muted)]">{completionPct}% complete</span>
              )}
              <span className={`flex items-center gap-1 text-xs ${profile?.artist_slug ? 'text-green-400' : 'text-[var(--pf-text-muted)]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${profile?.artist_slug ? 'bg-green-400' : 'bg-[var(--pf-text-muted)]'}`} />
                {profile?.artist_slug ? 'Live' : 'Not live'}
              </span>
            </div>
          </div>
          <Link href="/settings/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors text-sm">
            <Settings size={14} />
            Settings
          </Link>
        </div>

        {/* Completion bar */}
        {completionPct < 100 && (
          <div className="w-full h-1.5 bg-[var(--pf-surface)] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-[var(--pf-orange)] to-purple-500 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        )}

        {/* Primary CTA */}
        <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-r ${primaryCTA.color} border flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {primaryCTA.icon}
            </div>
            <div>
              <p className="font-bold">{primaryCTA.label}</p>
              <p className="text-sm text-[var(--pf-text-secondary)]">{primaryCTA.sub}</p>
            </div>
          </div>
          {primaryCTA.href ? (
            <Link href={primaryCTA.href} className="px-4 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shrink-0">
              Go →
            </Link>
          ) : pageUrl ? (
            <button
              onClick={() => copy('page', pageUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shrink-0"
            >
              {copied === 'page' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'page' ? 'Copied!' : 'Copy Link'}
            </button>
          ) : null}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="pf-card p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--pf-text-muted)]">Earned</span>
              <DollarSign size={16} className="text-[var(--pf-orange)]" />
            </div>
            <p className="text-2xl font-bold">${stats.total_sales.toFixed(2)}</p>
            <p className="text-xs text-green-400 mt-1">{stats.this_month.growth} this month</p>
          </div>
          <div className="pf-card p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--pf-text-muted)]">Orders</span>
              <Package size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{stats.total_orders}</p>
            <p className="text-xs text-[var(--pf-text-muted)] mt-1">{stats.this_month.orders} this month</p>
          </div>
          <div className="pf-card p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--pf-text-muted)]">Products</span>
              <Store size={16} className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{stats.total_products}</p>
            <p className="text-xs text-[var(--pf-text-muted)] mt-1">Active listings</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Upload Music', href: '/dashboard/dashboard/upload', icon: <Upload size={18} />, primary: true },
            { label: 'Add Product', href: '/dashboard/dashboard/add-product', icon: <Plus size={18} />, primary: true },
            { label: 'My Catalog', href: '/dashboard/dashboard/artist', icon: <Music size={18} />, primary: false },
            { label: 'Earnings', href: '/dashboard/dashboard/earnings', icon: <DollarSign size={18} />, primary: false },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors text-sm font-semibold ${
                action.primary
                  ? 'bg-[var(--pf-orange)] border-[var(--pf-orange)] text-white hover:bg-[var(--pf-orange-dark)]'
                  : 'bg-[var(--pf-surface)] border-[var(--pf-border)] hover:border-[var(--pf-orange)]'
              }`}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>

        {/* Bottom row: recent orders + sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 pf-card">
            <div className="flex items-center justify-between p-4 border-b border-[var(--pf-border)]">
              <h2 className="font-semibold text-sm">Recent Orders</h2>
              <Link href="/dashboard/dashboard/earnings" className="text-xs text-[var(--pf-orange)] hover:underline">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[var(--pf-border)]">
              {stats.total_orders === 0 ? (
                <div className="p-8 text-center text-[var(--pf-text-muted)]">
                  <Package size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No orders yet</p>
                  {pageUrl && (
                    <button
                      onClick={() => copy('page', pageUrl)}
                      className="mt-3 text-xs text-[var(--pf-orange)] hover:underline flex items-center gap-1 mx-auto"
                    >
                      <Copy size={12} /> Copy your page link to start earning
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 text-sm text-[var(--pf-text-muted)]">Orders will appear here</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Your Page */}
            {pageUrl && (
              <div className="pf-card p-4">
                <p className="text-xs text-[var(--pf-text-muted)] mb-2">Your artist page</p>
                <p className="text-xs font-mono text-[var(--pf-orange)] truncate mb-3">
                  porterful.com/artist/{profile.artist_slug}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy('page', pageUrl)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg hover:border-[var(--pf-orange)] transition-colors"
                  >
                    {copied === 'page' ? <Check size={12} /> : <Copy size={12} />}
                    {copied === 'page' ? 'Copied!' : 'Copy'}
                  </button>
                  <Link
                    href={`/artist/${profile.artist_slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg hover:border-[var(--pf-orange)] transition-colors"
                  >
                    <ExternalLink size={12} /> View
                  </Link>
                </div>
              </div>
            )}

            {/* Referral Link */}
            <div className="pf-card p-4">
              <p className="text-xs text-[var(--pf-text-muted)] mb-2">Referral link</p>
              <p className="text-xs font-mono text-[var(--pf-orange)] truncate mb-3">
                porterful.com/?ref={profile?.referral_code || '...'}
              </p>
              <button
                onClick={() => copy('ref', refUrl)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg hover:border-[var(--pf-orange)] transition-colors"
              >
                {copied === 'ref' ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'ref' ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
