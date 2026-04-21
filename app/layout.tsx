import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata: Metadata = { title: 'Rocky', description: 'Tool Control Dashboard' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-950">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
