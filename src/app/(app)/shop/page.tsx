import { redirect } from 'next/navigation'

export default function ShopPage() {
  // /shop is now /store — redirecting for canonical URLs
  redirect('/store')
}
