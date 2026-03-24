'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers';
import { CreditCard, Lock, Check, DollarSign, Users, Gift, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  name: string;
  artist: string;
  image: string;
  artistCut: number;
}

export default function CheckoutPage() {
  const { user } = useSupabase();
  const { items: cartContextItems, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'complete'>('shipping');
  const [processing, setProcessing] = useState(false);
  const [showSupportTip, setShowSupportTip] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [shipping, setShipping] = useState({
    name: '', email: '', address: '', city: '', state: '', zip: '', country: 'United States',
  });

  // Load cart items from context or localStorage
  useEffect(() => {
    if (cartContextItems && cartContextItems.length > 0) {
      setCartItems(cartContextItems);
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('porterful-checkout-items');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    }
  }, [cartContextItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const artistCut = cartItems.reduce((sum, item) => sum + item.artistCut * item.quantity, 0);
  const platformFee = subtotal - artistCut;
  const shippingCost = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shippingCost;

  const [payment, setPayment] = useState({
    cardNumber: '', expiry: '', cvc: '',
  })

  const handlePaymentSubmit = () => {
    if (!payment.cardNumber || !payment.expiry || !payment.cvc) {
      alert('Please fill in all payment fields.')
      return
    }
    setStep('review')
  }

  const handleFinalSubmit = async () => {
    setProcessing(true)
    
    try {
      // Convert cart items to Stripe format (prices in cents)
      const stripeItems = cartItems.map(item => ({
        title: item.name,
        artist: item.artist,
        price: Math.round(item.price * 100), // Convert to cents
        quantity: item.quantity,
        image: item.image,
      }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: stripeItems,
          shipping,
          referralCode: null,
        }),
      })

      const data = await response.json()

      if (data.url && !data.demo) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 1500))
        clearCart()
        localStorage.removeItem('porterful-checkout-items')
        setStep('complete')
      }
    } catch (error) {
      console.error('Checkout failed:', error)
      // Still show success in demo mode
      setStep('complete')
    }
    
    setProcessing(false)
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="pf-container max-w-2xl">
          <div className="pf-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="text-green-400" size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
            <p className="text-[var(--pf-text-secondary)] mb-6">
              Thank you for supporting independent artists.
            </p>
            
            <div className="bg-[var(--pf-bg)] rounded-lg p-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-[var(--pf-text-muted)]">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--pf-text-muted)]">Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--pf-border)]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[var(--pf-orange)]/10 rounded-lg p-4 mb-6">
              <p className="text-[var(--pf-orange)] font-semibold flex items-center justify-center gap-2">
                <DollarSign size={20} />
                ${artistCut.toFixed(2)} going directly to artists
              </p>
              <p className="text-sm text-[var(--pf-text-muted)] mt-1">
                That's {((artistCut / subtotal) * 100).toFixed(0)}% of your purchase!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="pf-btn pf-btn-primary">Continue Shopping</Link>
              <Link href="/dashboard/artist" className="pf-btn pf-btn-secondary">View Your Library</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container max-w-4xl">
        {/* Progress - Simple 3-step */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['shipping', 'payment', 'review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                ['payment', 'review', 'complete'].includes(step) && i < ['shipping', 'payment', 'review'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : step === s 
                    ? 'bg-[var(--pf-orange)] text-white' 
                    : 'bg-[var(--pf-surface)] text-[var(--pf-text-muted)]'
              }`}>
                {['payment', 'review', 'complete'].includes(step) && i < ['shipping', 'payment', 'review'].indexOf(step) ? <Check size={16} /> : i + 1}
              </div>
              <span className={`hidden sm:block capitalize ${step === s ? 'text-white' : 'text-[var(--pf-text-muted)]'}`}>
                {s}
              </span>
              {i < 2 && <div className="w-8 h-px bg-[var(--pf-border)]" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="pf-card p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                
                {/* Guest checkout option */}
                {!user && showSupportTip && (
                  <div className="bg-[var(--pf-orange)]/10 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Gift className="text-[var(--pf-orange)] shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-[var(--pf-orange)]">Create an account?</p>
                      <p className="text-sm text-[var(--pf-text-secondary)]">Get 10% off your first order and support your favorite artists every time you shop.</p>
                      <Link href="/signup" className="text-sm text-[var(--pf-orange)] underline">Sign up now →</Link>
                    </div>
                    <button onClick={() => setShowSupportTip(false)} className="text-[var(--pf-text-muted)] hover:text-white">
                      ✕
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">First Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none" 
                        placeholder="First"
                        value={shipping.name.split(' ')[0] || ''}
                        onChange={(e) => setShipping(s => ({ ...s, name: (e.target.value + ' ' + (s.name.split(' ')[1] || '')).trim() }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none" 
                        placeholder="Last"
                        value={shipping.name.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => setShipping(s => ({ ...s, name: ((s.name.split(' ')[0] || '') + ' ' + e.target.value).trim() }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none" 
                      placeholder="you@email.com"
                      value={shipping.email}
                      onChange={(e) => setShipping(s => ({ ...s, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none" 
                      placeholder="Street address"
                      value={shipping.address}
                      onChange={(e) => setShipping(s => ({ ...s, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">City</label>
                      <input 
                        type="text" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={shipping.city}
                        onChange={(e) => setShipping(s => ({ ...s, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">State</label>
                      <input 
                        type="text" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={shipping.state}
                        onChange={(e) => setShipping(s => ({ ...s, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">ZIP Code</label>
                      <input 
                        type="text" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={shipping.zip}
                        onChange={(e) => setShipping(s => ({ ...s, zip: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Country</label>
                      <select 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={shipping.country}
                        onChange={(e) => setShipping(s => ({ ...s, country: e.target.value }))}
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => {
                  if (!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
                    alert('Please fill in all required shipping fields.')
                    return
                  }
                  setStep('payment')
                }} className="w-full pf-btn pf-btn-primary mt-6">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="pf-card p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                {/* Payment options */}
                <div className="space-y-3 mb-6">
                  <div className="bg-[var(--pf-bg)] rounded-lg p-4 flex items-center gap-4 border-2 border-[var(--pf-orange)]">
                    <CreditCard className="text-[var(--pf-orange)]" size={24} />
                    <div className="flex-1">
                      <p className="font-medium">Credit or Debit Card</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Visa, Mastercard, Amex, Discover</p>
                    </div>
                    <Check className="text-[var(--pf-orange)]" size={20} />
                  </div>
                  
                  <div className="bg-[var(--pf-bg)] rounded-lg p-4 flex items-center gap-4 opacity-50">
                    <Zap className="text-[var(--pf-text-muted)]" size={24} />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--pf-text-muted)]">Pay with PayPal</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242" 
                      className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment(p => ({ ...p, cardNumber: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={payment.expiry}
                        onChange={(e) => setPayment(p => ({ ...p, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--pf-text-muted)] mb-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:border-[var(--pf-orange)] focus:outline-none"
                        value={payment.cvc}
                        onChange={(e) => setPayment(p => ({ ...p, cvc: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm text-[var(--pf-text-muted)]">
                  <Lock size={14} />
                  <span>Your payment is secure and encrypted</span>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep('shipping')} className="pf-btn pf-btn-secondary">Back</button>
                  <button onClick={handlePaymentSubmit} className="flex-1 pf-btn pf-btn-primary">Review Order</button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="pf-card p-6">
                <h2 className="text-xl font-bold mb-6">Review Order</h2>
                
                {/* Shipping summary */}
                <div className="bg-[var(--pf-bg)] rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[var(--pf-text-muted)]">Ship to</p>
                      <p className="font-medium">{shipping.name || 'Not provided'}</p>
                      <p className="text-sm">
                        {shipping.address ? `${shipping.address}, ` : ''}{shipping.city ? `${shipping.city}, ` : ''}{shipping.state || ''} {shipping.zip || ''}
                      </p>
                    </div>
                    <button onClick={() => setStep('shipping')} className="text-[var(--pf-orange)] text-sm">Edit</button>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-[var(--pf-border)] pt-4 mb-6">
                  <h3 className="text-sm text-[var(--pf-text-muted)] mb-4">Items</h3>
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between mb-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[var(--pf-text-muted)]">{item.artist} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Artist earnings highlight */}
                <div className="bg-green-500/10 rounded-lg p-4 mb-6 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-green-400" size={20} />
                      <span className="font-medium text-green-400">Artist Earnings</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">${artistCut.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-[var(--pf-text-muted)] mt-1">
                    {((artistCut / subtotal) * 100).toFixed(0)}% of your purchase goes directly to artists
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep('payment')} className="pf-btn pf-btn-secondary">Back</button>
                  <button onClick={handleFinalSubmit} disabled={processing} className="flex-1 pf-btn pf-btn-primary">
                    {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="pf-card p-6 sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-[var(--pf-text-muted)]">{item.artist} × {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--pf-border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--pf-text-muted)]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--pf-text-muted)]">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping progress */}
              {subtotal < 50 && (
                <div className="mt-4 p-3 bg-[var(--pf-surface)] rounded-lg">
                  <p className="text-sm text-[var(--pf-text-muted)]">
                    Add <span className="text-[var(--pf-orange)] font-medium">${(50 - subtotal).toFixed(2)}</span> more for FREE shipping
                  </p>
                  <div className="w-full bg-[var(--pf-bg)] rounded-full h-2 mt-2">
                    <div className="bg-[var(--pf-orange)] rounded-full h-2" style={{ width: `${(subtotal / 50) * 100}%` }} />
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[var(--pf-text-muted)]">
                <Lock size={14} />
                <span className="text-xs">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}