import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-navy border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* エンブレムとサイト名 */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <Image
                src="/images/jta-logo.png"
                alt="日本天パ協会ロゴ"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-gold text-xl font-bold">日本天パ協会</h1>
          </Link>

          {/* ナビゲーション */}
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  協会について
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  入会試験
                </Link>
              </li>
              <li>
                <Link
                  href="/forecast"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  天パ予報
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  記事
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
