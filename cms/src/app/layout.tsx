import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MubarmiJ CMS',
  description: 'MubarmiJ content management.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}

