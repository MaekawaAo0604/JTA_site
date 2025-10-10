import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* SNSリンク */}
          <div className="flex gap-4">
            <a
              href="https://x.com/tenpa_assoc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 transition-colors"
              aria-label="公式X（Twitter）"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* リンク */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>

          {/* 著作権表示 */}
          <p className="text-gold/60 text-sm text-center">
            © 2025 日本天パ協会 (tenpa.org). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
