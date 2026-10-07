import { redirect } from 'next/navigation'
export default function CheckoutSuccessPage() {
  // Canonical success page is at /checkout/checkout/success
  // This exists at /checkout/success for backwards compatibility
  redirect('/checkout/checkout/success')
}
