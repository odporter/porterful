'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers';
import { VerificationForm } from '@/components/VerificationBadge';

export default function VerifyPage() {
  const { user, supabase } = useSupabase();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification & Identity</h1>
          <p className="text-[var(--pf-text-secondary)]">
            Highlight your identity to connect with supporters who value community
          </p>
        </div>

        {/* Why Verify */}
        <div className="pf-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Why Verify Your Identity?</h2>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[var(--pf-surface)] rounded-lg">
              <span className="text-3xl mb-2 block">🎖️</span>
              <h3 className="font-medium">Veteran Badge</h3>
              <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                Show your service. 1% of your sales go to veteran causes.
              </p>
            </div>
            
            <div className="text-center p-4 bg-[var(--pf-surface)] rounded-lg">
              <span className="text-3xl mb-2 block">✊</span>
              <h3 className="font-medium">Black-Owned Badge</h3>
              <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                Stand out to customers who want to support Black-owned businesses.
              </p>
            </div>
            
            <div className="text-center p-4 bg-[var(--pf-surface)] rounded-lg">
              <span className="text-3xl mb-2 block">🌍</span>
              <h3 className="font-medium">Minority-Owned Badge</h3>
              <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                Connect with customers who prioritize diversity.
              </p>
            </div>
          </div>
        </div>

        {/* Veteran Support Info */}
        <div className="pf-card p-6 mb-8 bg-blue-600/5 border border-blue-600/20">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎖️</span>
            <div>
              <h3 className="font-semibold text-lg">Veteran Support Program</h3>
              <p className="text-[var(--pf-text-secondary)] mt-1 mb-3">
                Porterful donates <strong>1% of all sales</strong> from veteran-owned businesses to veteran support organizations. Plus, verified veterans get:
              </p>
              <ul className="text-sm text-[var(--pf-text-secondary)] space-y-1">
                <li>✓ Priority placement in marketplace</li>
                <li>✓ Special veteran badge on all products</li>
                <li>✓ Featured in "Support Veterans" section</li>
                <li>✓ Reduced platform fee (15% instead of 20%)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <VerificationForm onComplete={handleComplete} />

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[var(--pf-text-secondary)] hover:text-white transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
}