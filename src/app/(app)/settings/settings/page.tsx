'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { User, Code, CreditCard, Bell, Palette } from 'lucide-react';

// Accent Selector Component (self-contained)
const ACCENT_PRESETS = {
  orange: { h: 24, name: 'Default Orange' },
  gold: { h: 43, name: 'Gold' },
  blue: { h: 217, name: 'Blue' },
  forest: { h: 145, name: 'Forest' },
  ember: { h: 350, name: 'Ember' },
  void: { h: 260, name: 'Void' },
} as const;

type AccentPreset = keyof typeof ACCENT_PRESETS;

const ACCENT_STORAGE_KEY = 'pf-accent-hue';
const LOCKED_SATURATION = 95;
const LOCKED_LIGHTNESS = 53;

function clampHue(hue: number): number {
  return Math.max(0, Math.min(360, Math.round(hue)));
}

function applyAccentToDocument(hue: number) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--accent-h', clampHue(hue).toString());
}

function AccentSelector() {
  const [hue, setHueState] = useState(() => {
    if (typeof window === 'undefined') return ACCENT_PRESETS.orange.h;
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return clampHue(parsed);
      }
    } catch (e) {}
    return ACCENT_PRESETS.orange.h;
  });

  const setHue = (newHue: number) => {
    const clamped = clampHue(newHue);
    setHueState(clamped);
    applyAccentToDocument(clamped);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, clamped.toString());
    } catch (e) {}
  };

  const handlePresetClick = (preset: AccentPreset) => {
    setHue(ACCENT_PRESETS[preset].h);
  };

  const hueGradient = 'linear-gradient(to right, hsl(0,95%,53%), hsl(60,95%,53%), hsl(120,95%,53%), hsl(180,95%,53%), hsl(240,95%,53%), hsl(300,95%,53%), hsl(360,95%,53%))';

  return (
    <div className="space-y-6">
      {/* Current Color Display */}
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full border-2 border-[var(--pf-border)]"
          style={{ backgroundColor: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)` }}
        />
        <div>
          <p className="font-mono text-sm">hsl({hue}, {LOCKED_SATURATION}%, {LOCKED_LIGHTNESS}%)</p>
          <p className="text-xs text-[var(--pf-text-muted)]">Personalize your Porterful experience</p>
        </div>
      </div>

      {/* Hue Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--pf-text-secondary)]">Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(parseInt(e.target.value, 10))}
          className="w-full h-3 rounded-full cursor-pointer"
          style={{
            background: hueGradient,
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
        />
        <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
          <span>Red</span>
          <span>Yellow</span>
          <span>Green</span>
          <span>Cyan</span>
          <span>Blue</span>
          <span>Purple</span>
          <span>Red</span>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--pf-text-secondary)]">Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(ACCENT_PRESETS) as [AccentPreset, typeof ACCENT_PRESETS[AccentPreset]][]).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handlePresetClick(key)}
              className="flex items-center gap-2 p-2 rounded-lg border border-[var(--pf-border)] hover:border-[var(--accent)] transition-colors"
            >
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: `hsl(${value.h},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)` }}
              />
              <span className="text-sm">{value.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-lg bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)]">
        <p className="text-xs text-[var(--pf-text-muted)] mb-3">Preview</p>
        <div className="space-y-2">
          <button 
            className="w-full px-4 py-2 rounded-lg font-medium text-sm text-[#111111]"
            style={{ backgroundColor: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)` }}
          >
            Primary Button
          </button>
          <button 
            className="w-full px-4 py-2 rounded-lg font-medium text-sm border"
            style={{ 
              borderColor: `hsla(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%,0.5)`,
              color: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)`
            }}
          >
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'referrals' | 'payouts' | 'notifications' | 'appearance'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
  });

  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
    loadReferrals();
  }, [user]);

  async function loadProfile() {
    if (!user || !supabase) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile({
        name: data.full_name || data.name || '',
        email: data.email || user.email || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        avatar_url: data.avatar_url || '',
      });
      setReferralCode(data.referral_code || '');
    }
    setLoading(false);
  }

  async function loadReferrals() {
    if (!user || !supabase) return;
    
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id);
    
    // For now just count — earnings would come from a join with orders
    setReferralStats({
      totalReferrals: count || 0,
      totalEarnings: 0, // TODO: join with referral_earnings
    });
  }

  async function saveProfile() {
    if (!user || !supabase) return;
    setSaving(true);
    setMessage('');

    // Save to profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
      })
      .eq('id', user.id);

    if (profileError) {
      setMessage('Error saving: ' + profileError.message);
      setSaving(false);
      return;
    }

    // Also update artist record if this user is an artist
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileRow?.role === 'artist') {
      await supabase
        .from('artists')
        .update({
          name: profile.name,
          bio: profile.bio,
          location: profile.location,
          website_url: profile.website,
        })
        .eq('id', user.id);
    }

    setMessage('Profile saved!');
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--pf-bg)] text-white flex items-center justify-center">
        <p className="text-[var(--pf-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-[var(--pf-text-muted)]">Manage your account and preferences</p>
          </div>
          <Link href="/dashboard" className="text-[var(--pf-orange)] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'referrals', label: 'Referrals', icon: Code },
                { id: 'payouts', label: 'Payouts', icon: CreditCard },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'appearance', label: 'Appearance', icon: Palette },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--pf-orange)]/20 text-[var(--pf-orange)]'
                        : 'text-[var(--pf-text-muted)] hover:bg-[var(--pf-surface)]'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center text-4xl overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      profile.name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <button className="bg-[var(--pf-orange)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[var(--pf-orange-light)] transition-colors">
                      Upload Photo
                    </button>
                    <p className="text-gray-500 text-sm mt-2">JPG, PNG. Max 5MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors"
                      placeholder="https://yoursite.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors resize-none"
                      placeholder="Tell your fans about yourself..."
                    />
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="mt-6 bg-[var(--pf-orange)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--pf-orange-light)] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-6">
                {/* Referral Code */}
                <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                  <h2 className="text-xl font-bold mb-4">Your Referral Code</h2>
                  {referralCode ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-[var(--pf-bg)] border border-[#ff6b00] rounded-lg px-6 py-4 text-2xl font-mono font-bold text-[var(--pf-orange)]">
                          {referralCode}
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(referralCode)}
                          className="bg-[var(--pf-orange)] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[var(--pf-orange-light)] transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[var(--pf-text-muted)] mt-4">
                        Share this code. When people shop using it, you earn 3% on all purchases.
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No referral code yet.</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)] text-center">
                    <div className="text-3xl font-bold text-[var(--pf-orange)]">{referralStats.totalReferrals}</div>
                    <div className="text-gray-500">Total Referrals</div>
                  </div>
                  <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)] text-center">
                    <div className="text-3xl font-bold text-green-400">${referralStats.totalEarnings.toFixed(2)}</div>
                    <div className="text-gray-500">Total Earned</div>
                  </div>
                </div>

                {/* Share Link */}
                {referralCode && (
                  <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                    <h2 className="text-xl font-bold mb-4">Share Your Link</h2>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        readOnly
                        value={`https://porterful.com/store?ref=${encodeURIComponent(referralCode)}`}
                        className="flex-1 bg-[var(--pf-bg)] border border-gray-700 rounded-lg px-4 py-3"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://porterful.com/store?ref=${encodeURIComponent(referralCode)}`)}
                        className="bg-[var(--pf-surface)] text-white px-4 py-3 rounded-lg hover:bg-[var(--pf-surface-hover)] transition-colors"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                <h2 className="text-xl font-bold mb-6">Payout Settings</h2>

                <div className="bg-[var(--pf-bg)] rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#635bff] rounded flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Stripe Account</p>
                      <p className="text-gray-500 text-sm">Connect to receive payouts</p>
                    </div>
                    <button className="bg-[var(--pf-orange)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[var(--pf-orange-light)] transition-colors">
                      Connect Stripe
                    </button>
                  </div>
                </div>

                <div className="border-t border-[var(--pf-border)] pt-6">
                  <h3 className="font-semibold mb-4">Payout History</h3>
                  <p className="text-gray-500 text-sm">No payouts yet. Connect Stripe to start receiving earnings.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  {[
                    { id: 'orders', label: 'Order Updates', desc: 'Get notified when you make a sale' },
                    { id: 'referrals', label: 'Referral Earnings', desc: 'When someone uses your code' },
                    { id: 'payouts', label: 'Payout Updates', desc: 'When payouts are processed' },
                    { id: 'marketing', label: 'Marketing Emails', desc: 'News, features, and tips' },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{pref.label}</p>
                        <p className="text-gray-500 text-sm">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-[var(--pf-surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--pf-orange)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="bg-[var(--pf-surface)] rounded-xl p-6 border border-[var(--pf-border)]">
                <h2 className="text-xl font-bold mb-2">Appearance</h2>
                <p className="text-[var(--pf-text-muted)] text-sm mb-6">
                  Personalize your Porterful experience with custom accent colors.
                </p>
                <AccentSelector />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
