import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';

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
    title: '日本天パ協会 - クセは個性、個性は文化。',
    description: 'すべての髪型が祝福される日まで。天パの個性を文化として認め、誇りを持てる社会を目指します。',
    images: [
      {
        url: 'https://tenpa.org/images/jta-logo.png',
        width: 1200,
        height: 630,
        alt: '日本天パ協会 - クセは個性、個性は文化',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '日本天パ協会 - クセは個性、個性は文化。',
    description: 'すべての髪型が祝福される日まで。天パの個性を文化として認め、誇りを持てる社会を目指します。',
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
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1KW441LW97"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1KW441LW97');
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
