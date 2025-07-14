import './globals.css';
import Link from 'next/link';
import { Metadata } from 'next';
import { Providers } from './providers';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Простой блог на Next.js с Firestore',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-800 min-h-screen dark:bg-gray-900 dark:text-gray-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wide">
                  Blog
                </Link>
                <div className="flex items-center space-x-6">
                  <nav className="space-x-6">
                    <Link href="/posts" className="hover:text-gray-200 transition">
                      Посты
                    </Link>
                    <Link href="/create" className="hover:text-gray-200 transition">
                      Создать
                    </Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
