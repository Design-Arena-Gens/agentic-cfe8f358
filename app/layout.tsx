import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Teacher AI Agent | India',
  description: 'Creative content, visual stories, and kids ebook tools for primary teachers in India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-brand-50 to-white text-gray-900">
        <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-xl text-brand-700">GuruMitra</Link>
            <nav className="text-sm flex gap-4">
              <a className="hover:text-brand-700" href="#content">Content</a>
              <a className="hover:text-brand-700" href="#stories">Visual Stories</a>
              <a className="hover:text-brand-700" href="#ebook">Kids Ebook</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-500">
          Made for Indian primary teachers ? ????
        </footer>
      </body>
    </html>
  );
}
