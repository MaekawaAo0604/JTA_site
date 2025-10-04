import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: '日本天パ協会',
    template: '%s | 日本天パ協会',
  },
  description: 'クセは個性、個性は文化。日本天パ協会公式サイト',
  keywords: ['天パ', '天然パーマ', 'くせ毛', '髪質', '日本天パ協会'],
  authors: [{ name: '日本天パ協会' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://tenpa.org',
    siteName: '日本天パ協会',
    title: '日本天パ協会',
    description: 'クセは個性、個性は文化。日本天パ協会公式サイト',
    images: [
      {
        url: 'https://tenpa.org/images/jta-logo.png',
        width: 1200,
        height: 630,
        alt: '日本天パ協会ロゴ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '日本天パ協会',
    description: 'クセは個性、個性は文化。日本天パ協会公式サイト',
    images: ['https://tenpa.org/images/jta-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
