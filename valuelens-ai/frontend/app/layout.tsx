import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TopNavbar } from '@/components/navigation/TopNavbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ValueLens AI — AI-Powered Migration Economics & Decision Intelligence',
  description:
    'Enterprise platform for analyzing integration migration economics from SAP PI/PO, webMethods, and MuleSoft to SAP BTP Integration Suite.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <TopNavbar />
        <main className="flex-1">{children}</main>
        <footer className="no-print bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">ValueLens AI</span>
              <span>•</span>
              <span>Enterprise Integration Migration Intelligence</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
