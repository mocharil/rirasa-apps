import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jakarta Insight',
  description: 'Real-Time Monitoring and AI-Powered Citizen Engagement for Jakarta',
  icons: {
    icon: "/jakarta-insight-logo.png", // Mengubah favicon.ico menjadi logo baru
    // Opsional: Tambahkan ukuran berbeda jika diperlukan
    apple: "/jakarta-insight-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}