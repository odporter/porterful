export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* P icon - works on dark backgrounds */}
        <rect x="55" y="45" width="15" height="110" rx="4" fill="currentColor" className="text-white" />
        <rect x="78" y="60" width="55" height="12" rx="3" fill="currentColor" className="text-white" />
        <rect x="78" y="82" width="40" height="12" rx="3" fill="currentColor" className="text-white" />
        <rect x="78" y="104" width="55" height="12" rx="3" fill="currentColor" className="text-white" />
        <rect x="78" y="126" width="28" height="12" rx="3" fill="currentColor" className="text-white" />
      </svg>
    </div>
  )
}

export function LogoWithText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] via-[#ec4899] to-[#a855f7] flex items-center justify-center">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <rect x="55" y="45" width="15" height="110" rx="4" fill="white" />
          <rect x="78" y="60" width="55" height="12" rx="3" fill="white" />
          <rect x="78" y="82" width="40" height="12" rx="3" fill="white" />
          <rect x="78" y="104" width="55" height="12" rx="3" fill="white" />
          <rect x="78" y="126" width="28" height="12" rx="3" fill="white" />
        </svg>
      </div>
      {/* Text */}
      <span className="pf-brand-gradient-text font-bold text-xl tracking-tight">PORTERFUL</span>
    </div>
  )
}
