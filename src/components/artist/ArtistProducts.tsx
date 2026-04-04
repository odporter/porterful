'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/lib/products'

interface ArtistProductsProps {
  products: Product[]
  artistName: string
}

export function ArtistProducts({ products, artistName }: ArtistProductsProps) {
  return (
    <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)]">Merch</p>
        <Link href="/shop" className="text-xs text-[var(--pf-text-muted)] hover:text-[var(--pf-orange)] transition-colors">
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {products.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--pf-bg)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)]/40 transition-colors group"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-[var(--pf-text-muted)]">{product.category}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-semibold">${product.price}</span>
              <ArrowRight size={14} className="text-[var(--pf-text-muted)] group-hover:text-[var(--pf-orange)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
