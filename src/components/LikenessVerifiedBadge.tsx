'use client'

interface LikenessVerifiedBadgeProps {
  compact?: boolean
  showLabel?: boolean
}

function LikenessMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="10.25" cy="8.75" r="3.25" fill="currentColor" />
    </svg>
  )
}

export function LikenessVerifiedBadge({
  compact = false,
  showLabel = true,
}: LikenessVerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[#c6a85a]/35 bg-[#c6a85a]/10 text-[#d8bd78] ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
      title="Identity and likeness ownership verified through the Likeness registry"
    >
      <LikenessMark className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      {showLabel && <span className="font-medium">Likeness Verified</span>}
    </span>
  )
}
