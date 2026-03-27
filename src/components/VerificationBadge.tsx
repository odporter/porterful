'use client';

import { useState } from 'react';

interface Badge {
  type: 'veteran' | 'black_owned' | 'minority_owned' | 'artist' | 'verified';
  label: string;
  icon: string;
  color: string;
}

const BADGES: Badge[] = [
  { type: 'veteran', label: 'Veteran-Owned', icon: '🎖️', color: 'bg-blue-600' },
  { type: 'black_owned', label: 'Black-Owned', icon: '✊', color: 'bg-green-600' },
  { type: 'minority_owned', label: 'Minority-Owned', icon: '🌍', color: 'bg-purple-600' },
  { type: 'verified', label: 'Verified', icon: '✓', color: 'bg-[var(--pf-orange)]' },
];

interface VerificationBadgeProps {
  profile: {
    is_veteran?: boolean;
    is_black_owned?: boolean;
    is_minority_owned?: boolean;
    verification_status?: string;
  };
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ profile, showLabels = false, size = 'md' }: VerificationBadgeProps) {
  const activeBadges = BADGES.filter(badge => {
    if (badge.type === 'veteran') return profile.is_veteran;
    if (badge.type === 'black_owned') return profile.is_black_owned;
    if (badge.type === 'minority_owned') return profile.is_minority_owned;
    if (badge.type === 'verified') return profile.verification_status === 'verified';
    return false;
  });

  if (activeBadges.length === 0) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {activeBadges.map(badge => (
        <span
          key={badge.type}
          className={`inline-flex items-center gap-1 ${badge.color} text-white rounded-full font-medium ${sizeClasses[size]}`}
        >
          <span>{badge.icon}</span>
          {showLabels && <span>{badge.label}</span>}
        </span>
      ))}
    </div>
  );
}

export function BadgeIcon({ type, verified = false }: { type: 'veteran' | 'black_owned' | 'minority_owned' | 'verified'; verified?: boolean }) {
  const badge = BADGES.find(b => b.type === type);
  if (!badge || !verified) return null;

  return (
    <span className={`${badge.color} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm`}>
      {badge.icon}
    </span>
  );
}

export function VeteranSupportBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 rounded-lg px-3 py-2">
      <span className="text-lg">🎖️</span>
      <span className="text-blue-400 font-medium">Veteran-Owned Business</span>
    </div>
  );
}

export function BlackOwnedBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-600/30 rounded-lg px-3 py-2">
      <span className="text-lg">✊</span>
      <span className="text-green-400 font-medium">Black-Owned Business</span>
    </div>
  );
}

// Verification Form Component
export function VerificationForm({ onComplete }: { onComplete?: () => void }) {
  const [isVeteran, setIsVeteran] = useState(false);
  const [isBlackOwned, setIsBlackOwned] = useState(false);
  const [isMinorityOwned, setIsMinorityOwned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    // Will implement Supabase update
    setTimeout(() => {
      setSubmitting(false);
      onComplete?.();
    }, 1000);
  };

  return (
    <div className="pf-card p-6">
      <h3 className="text-xl font-bold mb-4">Verification & Badges</h3>
      <p className="text-[var(--pf-text-secondary)] mb-6">
        Highlight your identity and connect with customers who want to support your community.
      </p>

      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 bg-[var(--pf-surface)] rounded-lg cursor-pointer hover:bg-[var(--pf-surface-hover)]">
          <input
            type="checkbox"
            checked={isVeteran}
            onChange={(e) => setIsVeteran(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-[var(--pf-border)] text-[var(--pf-orange)] focus:ring-[var(--pf-orange)]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎖️</span>
              <span className="font-medium">Veteran-Owned</span>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
              I am a veteran of the U.S. Armed Forces. Porterful donates 1% of sales from veteran-owned products to veteran support organizations.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 bg-[var(--pf-surface)] rounded-lg cursor-pointer hover:bg-[var(--pf-surface-hover)]">
          <input
            type="checkbox"
            checked={isBlackOwned}
            onChange={(e) => setIsBlackOwned(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-[var(--pf-border)] text-[var(--pf-orange)] focus:ring-[var(--pf-orange)]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">✊</span>
              <span className="font-medium">Black-Owned Business</span>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
              This business is at least 51% Black-owned and operated.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 bg-[var(--pf-surface)] rounded-lg cursor-pointer hover:bg-[var(--pf-surface-hover)]">
          <input
            type="checkbox"
            checked={isMinorityOwned}
            onChange={(e) => setIsMinorityOwned(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-[var(--pf-border)] text-[var(--pf-orange)] focus:ring-[var(--pf-orange)]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span className="font-medium">Minority-Owned Business</span>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
              This business is at least 51% owned by individuals from underrepresented groups.
            </p>
          </div>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || (!isVeteran && !isBlackOwned && !isMinorityOwned)}
        className="mt-6 w-full pf-btn pf-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving...' : 'Save Verification'}
      </button>

      <p className="text-xs text-[var(--pf-text-muted)] mt-4 text-center">
        Self-identification is based on honor system. Porterful may request verification documents for badge eligibility.
      </p>
    </div>
  );
}