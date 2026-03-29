'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wifi, Smartphone, Music, Shirt, Tag, CreditCard, ArrowRight, Check, Package, Zap } from 'lucide-react'

const PRODUCTS = [
  {
    id: 'wristband',
    name: 'NFC Wristband',
    price: 15,
    icon: Shirt,
    description: 'Comfortable silicone wristband. Perfect for concerts, festivals, everyday wear.',
    color: 'from-orange-500 to-red-600',
    useCase: 'Fan wears it, taps phone anytime to discover artist',
  },
  {
    id: 'stickers',
    name: 'NFC Tags (Set of 3)',
    price: 12,
    icon: Tag,
    description: 'Stick anywhere — guitar case, laptop, notebook, bike. Thin and waterproof.',
    color: 'from-blue-500 to-cyan-600',
    useCase: 'Peel and stick on merch, equipment, anywhere',
  },
  {
    id: 'card',
    name: 'NFC Business Card',
    price: 8,
    icon: CreditCard,
    description: 'Wallet-sized card. Fits in any wallet or phone case. Subtle and professional.',
    color: 'from-purple-500 to-violet-600',
    useCase: 'Hand out at shows, meetings, networking events',
  },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Wifi,
    title: 'Fan taps their phone',
    desc: 'No app needed. Most modern phones (2018+) have NFC built in. Just tap.',
  },
  {
    step: 2,
    icon: Music,
    title: 'Opens your artist page',
    desc: 'They land directly on your Porterful page with your music, merch, and bio.',
  },
  {
    step: 3,
    icon: Shirt,
    title: 'They follow, buy, stream',
    desc: 'One tap and they\'re connected. Easy to buy a track or share with friends.',
  },
]

export default function TapMarketingPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  return (
    <div className="min-h-screen pt-20 pb-24 bg-[var(--pf-bg)]">
      <div className="pf-container max-w-5xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pf-orange)]/10 rounded-full text-[var(--pf-orange)] text-sm font-medium mb-6">
            <Zap size={16} />
            New: Artist Tap Marketing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let Fans <span className="text-[var(--pf-orange)]">Tap</span> Into Your Music
          </h1>
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-8">
            NFC wristbands, tags, and cards that link directly to your artist page. 
            No app. No typing. Just tap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#products" className="px-6 py-3 bg-[var(--pf-orange)] text-white rounded-lg font-semibold hover:bg-[var(--pf-orange-dark)] transition-colors inline-flex items-center justify-center gap-2">
              Shop Products <ArrowRight size={18} />
            </a>
            <Link href="/artists" className="px-6 py-3 border border-[var(--pf-border)] rounded-lg font-medium hover:border-[var(--pf-orange)] transition-colors">
              Browse Artists
            </Link>
          </div>
        </div>

        {/* Demo */}
        <div className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-[var(--pf-surface)] to-[var(--pf-bg)] border border-[var(--pf-border)] overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--pf-orange)]/10 text-[var(--pf-orange)] text-xs font-medium rounded-full">
            See it in action
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[var(--pf-orange)] to-red-600 flex items-center justify-center shrink-0">
              <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center">
                <Wifi size={48} className="text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">How it works</h3>
              <p className="text-[var(--pf-text-secondary)] mb-4">
                Fan holds phone near the wristband for 1-2 seconds. Phone buzzes. 
                Your artist page opens automatically.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone size={16} className="text-[var(--pf-orange)]" />
                  <span>iPhone & Android</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-400" />
                  <span>No app needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-400" />
                  <span>Reusable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Steps */}
        <h2 className="text-2xl font-bold mb-6 text-center">The Fan Experience</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="p-6 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[var(--pf-orange)] flex items-center justify-center text-white font-bold mb-4">
                  {item.step}
                </div>
                <Icon size={24} className="text-[var(--pf-orange)] mb-2" />
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-[var(--pf-text-muted)]">{item.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Products */}
        <div id="products" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Format</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PRODUCTS.map((product) => {
              const Icon = product.icon
              return (
                <div 
                  key={product.id}
                  className={`p-6 bg-[var(--pf-surface)] border rounded-xl transition-all cursor-pointer ${
                    selectedProduct === product.id 
                      ? 'border-[var(--pf-orange)] shadow-lg shadow-[var(--pf-orange)]/20' 
                      : 'border-[var(--pf-border)] hover:border-[var(--pf-orange)]'
                  }`}
                  onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-2xl font-bold text-[var(--pf-orange)] mb-3">${product.price}</p>
                  <p className="text-sm text-[var(--pf-text-secondary)] mb-3">{product.description}</p>
                  <div className="pt-3 border-t border-[var(--pf-border)]">
                    <p className="text-xs text-[var(--pf-text-muted)]">{product.useCase}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* For Artists */}
        <div className="mb-16 p-8 rounded-2xl bg-gradient-to-r from-[var(--pf-orange)]/10 to-purple-500/10 border border-[var(--pf-orange)]/20">
          <h2 className="text-2xl font-bold mb-4">For Artists: Custom Branding</h2>
          <p className="text-[var(--pf-text-secondary)] mb-4">
            Want your NFC products customized? We can print your artist name, logo, or QR code on wristbands and cards. 
            Bulk orders available for touring artists and record labels.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Custom colors & branding</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Bulk pricing (50+ units)</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Programmable to any URL</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Ships in 5-7 business days</span>
            </li>
          </ul>
          <Link 
            href="/support" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pf-orange)] text-white rounded-lg font-semibold hover:bg-[var(--pf-orange-dark)] transition-colors"
          >
            Contact for Bulk Orders <ArrowRight size={18} />
          </Link>
        </div>

        {/* Tech Details */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl">
              <h4 className="font-semibold mb-3">Compatibility</h4>
              <ul className="space-y-2 text-sm text-[var(--pf-text-secondary)]">
                <li>• iPhone XR and newer (iOS 11+)</li>
                <li>• Android phones (Android 8.0+)</li>
                <li>• Most smartwatches with NFC</li>
                <li>• Works through phone cases</li>
              </ul>
            </div>
            <div className="p-6 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl">
              <h4 className="font-semibold mb-3">What's Included</h4>
              <ul className="space-y-2 text-sm text-[var(--pf-text-secondary)]">
                <li>• NFC product (wristband/tag/card)</li>
                <li>• Pre-programmed to your artist page</li>
                <li>• Instructions card</li>
                <li>• Free replacement if defective</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
          <Package size={48} className="mx-auto text-[var(--pf-orange)] mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ready to connect?</h2>
          <p className="text-[var(--pf-text-secondary)] mb-6">
            Each purchase links to your artist page. After checkout, tell us your artist URL and we'll program it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#products" className="px-8 py-4 bg-[var(--pf-orange)] text-white rounded-lg font-semibold hover:bg-[var(--pf-orange-dark)] transition-colors text-lg">
              Shop NFC Products
            </a>
            <Link href="/dashboard" className="px-8 py-4 border border-[var(--pf-border)] rounded-lg font-medium hover:border-[var(--pf-orange)] transition-colors">
              Set Up Artist Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
