import Link from 'next/link';

const news = [
  {
    id: 1,
    date: '2025-01-15',
    title: '新規会員登録システムを公開しました',
    excerpt: '入会試験と会員証発行機能が利用可能になりました。',
  },
  {
    id: 2,
    date: '2025-01-10',
    title: '天パ予報マップの自動生成を開始',
    excerpt: '毎朝7:30に最新の天パ爆発指数マップを更新します。',
  },
  {
    id: 3,
    date: '2025-01-05',
    title: '日本天パ協会公式サイトを開設',
    excerpt: '天パの個性を文化として認める協会活動を開始しました。',
  },
];

export default function NewsSection() {
  return (
    <div className="card-official">
      <h2 className="text-2xl font-semibold text-navy mb-6">お知らせ</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="block p-4 rounded-lg border border-gray-200"
          >
            <time className="text-sm text-gray-500">{item.date}</time>
            <h3 className="text-lg font-semibold text-navy mt-1">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
