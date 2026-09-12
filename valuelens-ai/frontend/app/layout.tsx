import type { Metadata } from 'next';
import './globals.css';
import { TopNavbar } from '@/components/navigation/TopNavbar';

export const metadata: Metadata = {
  title: 'ValueLens AI — AI-Powered Migration Economics & Decision Intelligence',
  description:
    'Enterprise platform for analyzing integration migration economics from SAP PI/PO, MuleSoft, SAP CPI (Neo), and Boomi to SAP BTP Integration Suite.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f5f6f7] text-[#1d2d3e] font-sans antialiased selection:bg-[#e5f0ff] selection:text-[#0070f2]">
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

            {/* Middle: Powered by IntSwitch */}
            <div className="flex items-center space-x-2 text-slate-600 font-medium text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Powered by</span>
              <a
                href="/intswitch"
                className="inline-flex items-center hover:opacity-85 transition-opacity"
                title="Powered by Incture IntSwitch"
              >
                <img
                  src="/images/intswitch-logo.png"
                  alt="IntSwitch"
                  className="h-5 w-auto object-contain"
                />
              </a>
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
