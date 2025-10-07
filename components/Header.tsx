'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useAuth();

  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/about', label: '協会について' },
    { href: '/join', label: '入会試験' },
    { href: '/forecast', label: '天パ予報' },
    { href: '/articles', label: '記事' },
    { href: '/contact', label: 'お問い合わせ' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-navy border-b border-gold/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* エンブレムとサイト名 */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0" onClick={closeMobileMenu}>
            <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0">
              <Image
                src="/images/jta-logo.png"
                alt="日本天パ協会ロゴ"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-gold text-base md:text-xl font-bold whitespace-nowrap">日本天パ協会</h1>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gold hover:text-gold/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link
                      href="/member-card"
                      className="text-gold hover:text-gold/80 transition-colors"
                    >
                      会員証
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => logOut()}
                      className="text-gold hover:text-gold/80 transition-colors"
                    >
                      ログアウト
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="text-gold hover:text-gold/80 transition-colors"
                  >
                    ログイン
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* ハンバーガーメニューボタン */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-gold p-2 focus:outline-none focus:ring-2 focus:ring-gold rounded"
            aria-label="メニューを開く"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-4">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-gold hover:text-gold/80 transition-colors py-2 px-4 rounded hover:bg-gold/10"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link
                      href="/member-card"
                      className="block text-gold hover:text-gold/80 transition-colors py-2 px-4 rounded hover:bg-gold/10"
                      onClick={closeMobileMenu}
                    >
                      会員証
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logOut();
                        closeMobileMenu();
                      }}
                      className="block text-gold hover:text-gold/80 transition-colors py-2 px-4 rounded hover:bg-gold/10 w-full text-left"
                    >
                      ログアウト
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="block text-gold hover:text-gold/80 transition-colors py-2 px-4 rounded hover:bg-gold/10"
                    onClick={closeMobileMenu}
                  >
                    ログイン
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
