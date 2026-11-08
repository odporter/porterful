export default function StoreLoading() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="pf-container">
        <div className="max-w-4xl mx-auto">
          {/* Hero skeleton */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-[var(--pf-surface)] animate-pulse" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="h-10 w-48 bg-[var(--pf-surface)] rounded animate-pulse mx-auto md:mx-0" />
              <div className="h-5 w-64 bg-[var(--pf-surface)] rounded animate-pulse mx-auto md:mx-0" />
              <div className="h-5 w-96 bg-[var(--pf-surface)] rounded animate-pulse mx-auto md:mx-0 max-w-full" />
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="h-10 w-32 bg-[var(--pf-surface)] rounded animate-pulse" />
                <div className="h-10 w-24 bg-[var(--pf-surface)] rounded animate-pulse" />
                <div className="h-10 w-24 bg-[var(--pf-surface)] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Albums skeleton */}
          <div className="mb-12">
            <div className="h-8 w-32 bg-[var(--pf-surface)] rounded animate-pulse mb-6" />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48">
                  <div className="aspect-square bg-[var(--pf-surface)] rounded-xl animate-pulse mb-3" />
                  <div className="h-5 bg-[var(--pf-surface)] rounded animate-pulse mb-2" />
                  <div className="h-4 bg-[var(--pf-surface)] rounded w-24 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Products skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-8 w-24 bg-[var(--pf-surface)] rounded animate-pulse" />
            <div className="flex gap-2 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-[var(--pf-surface)] rounded-lg animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[var(--pf-surface)] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-[var(--pf-border)]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[var(--pf-border)] rounded w-1/4" />
                  <div className="h-5 bg-[var(--pf-border)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--pf-border)] rounded w-1/2" />
                  <div className="h-6 bg-[var(--pf-border)] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
