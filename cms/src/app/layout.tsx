import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mubarmij CMS',
  description: 'Mubarmij Online content management.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}

