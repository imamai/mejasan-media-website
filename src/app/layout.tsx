import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/layout/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mejasanmedia.com'),
  title: {
    default: 'Mejasan Media Production | Photography & Videography Kenya',
    template: '%s | Mejasan Media Production',
  },
  description:
    "Stories That Move People. Kenya's premier photography, videography, wedding films & drone production studio. Serving Nairobi and East Africa.",
  keywords: [
    'photography Kenya', 'videography Nairobi', 'wedding photographer Kenya',
    'corporate video production', 'drone photography Kenya', 'media production Nairobi',
    'Mejasan Media', 'event coverage Kenya',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://mejasanmedia.com',
    siteName: 'Mejasan Media Production',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mejasan Media Production' }],
  },
  twitter: { card: 'summary_large_image', creator: '@mejasanmedia' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${cormorant.variable}`}
      style={
        {
          '--font-sans':    'var(--font-inter), system-ui, sans-serif',
          '--font-display': 'var(--font-space-grotesk), system-ui, sans-serif',
          '--font-heading': 'var(--font-cormorant), Georgia, serif',
        } as React.CSSProperties
      }
    >
      <body className="bg-[#0B0B0B] text-[#FAFAFA] font-sans antialiased overflow-x-hidden">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </SmoothScroll>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#FAFAFA',
              border: '1px solid rgba(250,250,250,0.08)',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}
