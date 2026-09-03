import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { Outfit } from 'next/font/google';
import { BRAND } from '@/lib/brand';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientChrome from '@/providers/ClientChrome';
import '@/styles/global.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
});

const splashGateScript = `(function(){try{if(window.__ifSplashDone||window.__ifAstroClientNav){document.documentElement.classList.remove('if-splash');return;}var path=location.pathname;if(path!=='/'&&path!=='')return;var nav=performance.getEntriesByType('navigation')[0];if(nav&&nav.type==='back_forward')return;document.documentElement.classList.add('if-splash');}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://inovativefashion.com'),
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.short,
  appleWebApp: {
    capable: true,
    title: BRAND.short,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/apple-touch-icon.png' }],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F1218',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${outfit.className} hero-bg min-h-screen max-w-full overflow-x-clip font-sans text-snow antialiased`}>
        <Script id="if-splash-gate" strategy="beforeInteractive">
          {splashGateScript}
        </Script>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-lg focus:bg-signal focus:px-3 focus:py-2"
        >
          Skip to content
        </a>

        <div className="min-h-screen max-w-full overflow-x-clip bg-[#0F1218]">
          <Suspense
            fallback={<div className="h-[57px] border-b border-dark-border/80 bg-dark-bg/85 md:h-[97px]" aria-hidden />}
          >
            <Header />
          </Suspense>
          <main id="main">{children}</main>
          <Footer />
        </div>

        <ClientChrome />
      </body>
    </html>
  );
}
