'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        showToast('Message sent! We\'ll get back to you within 24-48 hours.', 'success')
      } else {
        showToast('Failed to send. Email us at hello@porterful.com', 'error')
      }
    } catch {
      showToast('Network error. Email us at hello@porterful.com', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-[var(--pf-text-secondary)]">
            Questions? Ideas? Want to partner? We're all ears.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[var(--pf-surface)] rounded-2xl p-8 text-center border border-[var(--pf-orange)]/30">
            <div className="text-6xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-[var(--pf-text-secondary)] mb-6">
              We'll get back to you within 24-48 hours.
            </p>
            <Link href="/" className="text-[var(--pf-orange)] hover:underline">
              ← Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--pf-orange)] transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--pf-orange)] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">Subject</label>
              <select
                id="contact-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--pf-orange)] transition-colors"
              >
                <option value="">Select a topic</option>
                <option value="artist">I'm an artist interested in joining</option>
                <option value="business">I'm a business wanting to list products</option>
                <option value="brand">Brand partnership inquiry</option>
                <option value="support">Customer support</option>
                <option value="press">Press / Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--pf-orange)] transition-colors resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--pf-orange)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--pf-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>

            <p className="text-center text-[var(--pf-text-muted)] text-sm">
              Or email us directly at{' '}
              <a href="mailto:hello@porterful.com" className="text-[var(--pf-orange)] hover:underline">
                hello@porterful.com
              </a>
            </p>
          </form>
        )}

        {/* Quick Links */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 text-center border border-[var(--pf-border)]">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold mb-1">Help Center</h3>
            <Link href="/faq" className="text-[var(--pf-text-muted)] text-sm hover:text-[var(--pf-orange)]">
              FAQs and guides
            </Link>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 text-center border border-[var(--pf-border)]">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">Community</h3>
            <a
              href="https://discord.gg/porterful"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--pf-orange)] hover:underline text-sm"
            >
              Join our Discord
            </a>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 text-center border border-[var(--pf-border)]">
            <div className="text-3xl mb-2">🐦</div>
            <h3 className="font-semibold mb-1">Twitter</h3>
            <a
              href="https://twitter.com/porterful"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--pf-orange)] hover:underline text-sm"
            >
              @porterful
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
