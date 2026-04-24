// Shared product data for the store and product pages

export interface Product {
  id: string
  name: string
  price: number
  category: string
  artist: string
  image: string
  images?: string[]
  description?: string
  featured?: boolean
  colors?: string[]
  sizes?: string[]
  format?: string
  tracks?: number
  inStock?: boolean
  artistCut?: number
  sales?: number
  rating?: number
  reviews?: number
  // Fulfillment
  // - "printful" = linked to Printful catalog (works)
  // - "dropship" = third-party supplier (works)
  // - "mock" = placeholder, CANNOT fulfill right now
  fulfillment?: 'printful' | 'dropship' | 'mock'
  // available: true only when a real purchase + fulfillment path is confirmed.
  // Anything not explicitly available renders as "Coming Soon" with Buy Now disabled.
  available?: boolean
  // Dropship fields
  dropship?: boolean
  supplier?: string
  supplierPrice?: number
}

export function isPurchasable(product: Pick<Product, 'available' | 'fulfillment'>) {
  return product.available === true && product.fulfillment !== 'mock'
}

export const PRODUCTS: Product[] = [
  // ==========================================================
  // FULFILLABLE PRODUCTS (Printful or dropship linked)
  // ==========================================================


  // ==========================================================
  // MOCK PRODUCTS — cannot fulfill right now
  // Printful not configured, no supplier linked
  // These are design mockups / placeholder listings
  // ==========================================================

  {
    id: 'signal-shirt',
    name: 'LIKENESS Signal Shirt',
    price: 65,
    category: 'Signal',
    artist: 'Likeness™',
    image: '/signal/black-front.png',
    images: [
      '/signal/black-front.png',
      '/signal/black-side.png',
      '/signal/black-back.png',
      '/signal/white-front.png',
      '/signal/white-side.png',
      '/signal/white-back.png',
      '/signal/origin-front.png',
      '/signal/origin-side.png',
      '/signal/origin-back.png',
    ],
    featured: true,
    description: 'Wear your signal. NFC tap point connects anyone who taps to your Likeness registry. Available in Black, White, and Origin.',
    colors: ['Black', 'White', 'Origin'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fulfillment: 'mock', // Images are placeholders, no Printful link
    inStock: true,
    artistCut: 0,
    sales: 0,
    rating: 0,
    reviews: 0,
  },
  {
    id: 'gune-shirt',
    name: 'Gune Classic Tee',
    price: 40,
    category: 'Merch',
    artist: 'Gune',
    image: '/artist-images/gune/gune-shirt.jpg',
    featured: true,
    description: 'Official Gune merch. Limited edition shirt.',
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    artistCut: 32,
    sales: 0,
    rating: 0,
    reviews: 0,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.featured)
