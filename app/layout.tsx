import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Chart The Course - Strategic Personal Development',
  description: 'A minimalist tool for knowledge workers to translate vision into consistent daily effort through focused work sessions and strategic planning.',
  keywords: 'productivity, deep work, strategic planning, personal development, focus timer',
  authors: [{ name: 'Chart The Course' }],
  openGraph: {
    title: 'Chart The Course',
    description: 'Strategic orchestrator for personal and professional development',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  )
}