'use client';

import { useEffect } from 'react';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service if needed
    console.error('Store error:', error);
  }, [error]);

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="pf-container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-[var(--pf-text-muted)] mb-6">
            We couldn't load the store. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="pf-btn pf-btn-primary"
            >
              Try again
            </button>
            <a href="/" className="pf-btn pf-btn-secondary">
              Go home
            </a>
          </div>
          {error.digest && (
            <p className="text-xs text-[var(--pf-text-muted)] mt-4 opacity-50">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
