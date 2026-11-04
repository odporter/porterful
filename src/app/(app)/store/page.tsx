import { redirect } from 'next/navigation'

// /store was the legacy URL — /shop is now canonical
export default function StorePage() {
  redirect('/shop')
}
