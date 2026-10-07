// This layout is intentionally minimal — it just passes children through.
// The page.tsx file exports the metadata (title, description, etc.) for this route.
// Next.js uses the most specific metadata in the route hierarchy.
export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
