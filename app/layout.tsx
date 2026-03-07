import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/components/language-provider'
import { getSiteContent } from '@/lib/data'
import './globals.css'

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const _playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSiteContent()
    return {
      title: content.metaTitle || content.siteName || 'Luxury Moroccan Tours',
      description: content.metaDescription || 'Curated luxury travel experiences across Morocco.',
    }
  } catch {
    return {
      title: 'Luxury Moroccan Tours',
      description: 'Curated luxury travel experiences across Morocco.',
    }
  }
}

export const viewport: Viewport = {
  themeColor: '#1b1f3b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`${_inter.variable} ${_playfair.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
