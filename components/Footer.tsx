import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
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
