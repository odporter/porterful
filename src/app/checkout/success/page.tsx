'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Package, Mail, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate order processing
    const sessionId = searchParams.get('session_id');
    const demo = searchParams.get('demo');

    if (sessionId || demo) {
      // In production, verify the session with Stripe
      setOrderId(sessionId || `ORD-${Date.now().toString(36).toUpperCase()}`);
      setLoading(false);
    } else {
      // No session - redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="pf-container max-w-2xl">
          <div className="pf-card p-12 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pf-surface)]" />
              <div className="h-6 bg-[var(--pf-surface)] rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-[var(--pf-surface)] rounded w-1/3 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container max-w-2xl">
        <div className="pf-card p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="text-green-400" size={40} />
          </div>

          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-[var(--pf-text-secondary)] mb-2">
            Thank you for supporting independent artists.
          </p>
          {orderId && (
            <p className="text-sm text-[var(--pf-text-muted)] mb-8">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          {/* Artist Impact */}
          <div className="bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package className="text-[var(--pf-orange)]" size={24} />
              <span className="text-xl font-bold text-[var(--pf-orange)]">$XX.XX</span>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)]">
              Going directly to artists
            </p>
          </div>

          {/* What's Next */}
          <div className="text-left mb-8">
            <h2 className="font-semibold mb-4">What's Next?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--pf-bg)]">
                <Mail className="text-[var(--pf-orange)] shrink-0" size={20} />
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">
                    Check your inbox for order details and tracking info.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--pf-bg)]">
                <Package className="text-[var(--pf-orange)] shrink-0" size={20} />
                <div>
                  <p className="font-medium">Shipping Updates</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">
                    We'll email you when your order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace" className="pf-btn pf-btn-primary flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="pf-btn pf-btn-secondary">
              View Orders
            </Link>
          </div>
        </div>

        {/* Support Artists CTA */}
        <div className="mt-8 pf-card p-6">
          <h3 className="font-semibold mb-2">Want to do more?</h3>
          <p className="text-sm text-[var(--pf-text-secondary)] mb-4">
            Become a Superfan and earn from every referral. Share the artists you love and build wealth in the new music economy.
          </p>
          <Link href="/signup/superfan" className="pf-btn pf-btn-secondary w-full">
            Become a Superfan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12">
        <div className="pf-container max-w-2xl">
          <div className="pf-card p-12 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pf-surface)]" />
              <div className="h-6 bg-[var(--pf-surface)] rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-[var(--pf-surface)] rounded w-1/3 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}