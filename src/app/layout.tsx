import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Health Dashboard',
  description: 'Personal health & nutrition tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}
