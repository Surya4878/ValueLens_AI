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
              <span className="h-4 w-px bg-slate-300"></span>
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-1 leading-none">
                  <span className="text-[11px] font-normal text-slate-700">Business</span>
                  <span className="text-[11px] font-black text-slate-900">ValueLens</span>
                  <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase bg-purple-600 text-white ml-0.5">AI</span>
                </div>
                <p className="text-[8px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Migration Economics</p>
              </div>
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
