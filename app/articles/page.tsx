import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '天パに関する記事とニュース',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gold mb-12 text-center">
            記事一覧
          </h1>

          <div className="card-official text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-navy mb-4">
              記事コンテンツ準備中
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              天パに関する情報や最新ニュース、ヘアケアのコツなど、
              <br />
              様々なコンテンツを順次公開予定です。
            </p>
            <Link href="/" className="inline-block bg-transparent border-2 border-gold text-gold font-medium px-8 py-3 rounded-lg hover:bg-gold hover:text-navy transition-all duration-300">
              ホームに戻る
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="card-official">
              <h3 className="text-xl font-semibold text-navy mb-3">公開予定コンテンツ</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>天パヘアケアガイド</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>天パあるある体験談</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>おすすめスタイリング製品レビュー</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>季節別対策コラム</span>
                </li>
              </ul>
            </div>

            <div className="card-official">
              <h3 className="text-xl font-semibold text-navy mb-3">最新情報を受け取る</h3>
              <p className="text-gray-700 mb-4 text-sm">
                記事公開時にお知らせを受け取りたい方は、会員登録をお願いします。
              </p>
              <Link href="/join" className="inline-block bg-gold text-navy font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
                会員登録
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
