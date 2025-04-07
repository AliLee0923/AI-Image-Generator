import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'AI Image Generator using Stability API',
  generator: 'Ali Lee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
