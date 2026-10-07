/**
 * LikenessVerifiedBadge
 * 
 * A subtle, premium trust indicator for verified artists.
 * Only shows when artist.likeness_verified === true.
 * 
 * Style: light grey, understated, looks like "quiet authority"
 * Not flashy, not loud — just a quiet signal of trust.
 */

export function LikenessVerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.5, flexShrink: 0 }}
      aria-label="Likeness Verified"
    >
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#9ca3af"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner solid circle */}
      <circle
        cx="12"
        cy="12"
        r="6"
        fill="#9ca3af"
        fillOpacity="0.2"
      />
      {/* Center dot */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="#9ca3af"
      />
      {/* Small check at bottom */}
      <path
        d="M8.5 12.5L11 15L15.5 10"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}