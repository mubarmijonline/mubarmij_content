// Root layout is required by Next.js App Router but our actual app structure
// lives under [locale]. This file simply forwards to whatever locale layout
// renders for the request — Next-Intl handles locale routing in middleware.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
