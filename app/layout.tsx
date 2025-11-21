import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gourmet Fried Chicken - Hero Gallery',
  description: 'Hyper-realistic 3D hero shots of gourmet fried chicken with dynamic sauce physics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
