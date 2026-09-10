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
        <footer className="no-print bg-white border-t border-slate-200/80 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Brand */}
            <div className="flex items-center space-x-2.5">
              <a
                href="https://incture.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-85 transition-opacity"
                title="Visit Incture.com"
              >
                <img
                  src="/images/incture-logo.png"
                  alt="Incture"
                  className="h-5 w-auto object-contain"
                />
              </a>
              <span className="h-5 w-px bg-slate-300"></span>
              <img
                src="/images/business-valuelens-ai-logo.png?v=newlogo"
                alt="Business ValueLens AI"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>

            {/* Middle: Slogan */}
            <div className="flex items-center space-x-3 text-slate-600 font-medium text-xs">
              <span className="h-px w-12 sm:w-16 bg-slate-200"></span>
              <span className="text-[11px] text-slate-700">Turning Technology Decisions into Business Value.</span>
              <span className="h-px w-12 sm:w-16 bg-slate-200"></span>
            </div>

            {/* Right: Legal & Copyright */}
            <div className="flex items-center space-x-2.5 text-xs text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacy</span>
              <span className="text-slate-300">|</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Terms</span>
              <span className="text-slate-300">|</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Support</span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-500">© 2026 Incture. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
