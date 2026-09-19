import type { Metadata } from 'next';
import './globals.css';
import { TopNavbar } from '@/components/navigation/TopNavbar';
import { AppFooter } from '@/components/navigation/AppFooter';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { RouteGuard } from '@/components/auth/RouteGuard';

export const metadata: Metadata = {
  title: 'ValueLens AI — AI-Powered Migration Economics & Decision Intelligence',
  description:
    'Enterprise platform for analyzing integration migration economics from SAP PI/PO, MuleSoft, SAP CPI (Neo), and Boomi to SAP BTP Integration Suite.',
  icons: {
    icon: [
      { url: '/images/incture-favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/incture-favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/incture-favicon-32.png',
    apple: '/images/incture-favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f5f6f7] text-[#1d2d3e] font-sans antialiased selection:bg-[#e5f0ff] selection:text-[#0070f2]">
        <AuthProvider>
          <ScrollToTop />
          <TopNavbar />
          <RouteGuard>
            <main className="flex-1">{children}</main>
          </RouteGuard>
          <AppFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
