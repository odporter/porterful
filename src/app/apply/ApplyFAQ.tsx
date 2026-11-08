'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type FAQ = { q: string; a: string }

const faqItems: FAQ[] = [
  {
    q: 'How much does it cost?',
    a: 'Free to join as a founding beta artist. No upfront fees, no monthly subscriptions. You only pay a small platform fee when you make a sale.',
  },
  {
    q: 'How does the 80% revenue share work?',
    a: 'You keep 80% of every sale. Porterful takes 20% — broken down as 15% payment processing and 5% platform operations. No hidden fees.',
  },
  {
    q: 'What music formats do you support?',
    a: 'MP3, WAV, FLAC, and AIFF. High-quality audio (320kbps+) is recommended for the best listener experience.',
  },
  {
    q: 'Can I sell physical merch too?',
    a: 'Yes! Create t-shirts, vinyl records, posters, and more from your artist dashboard. Physical products are print-on-demand and ship directly to fans worldwide.',
  },
  {
    q: 'When do I get paid?',
    a: 'Payments are processed via Stripe. Withdraw anytime with a $10 minimum. Payments typically arrive in 2-3 business days.',
  },
  {
    q: 'Do I keep control of my music?',
    a: '100%. You own your music, your catalog, and your fan relationships. No contracts, no commitments, no label interference.',
  },
]

export function ApplyFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-3" role="list">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl overflow-hidden"
              role="listitem"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`apply-faq-answer-${index}`}
                id={`apply-faq-question-${index}`}
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-[var(--pf-border)]/30 transition-colors"
              >
                <span className="font-semibold text-white pr-2">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[var(--pf-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`apply-faq-answer-${index}`}
                role="region"
                aria-labelledby={`apply-faq-question-${index}`}
                className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="px-6 pb-6 text-sm text-[var(--pf-text-secondary)]">{item.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
