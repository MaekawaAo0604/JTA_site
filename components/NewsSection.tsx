import Link from 'next/link';

const news = [
  {
    id: 1,
    date: '2025-10-07',
    title: '日本天パ協会公式サイトを開設しました',
    excerpt: '天パの個性を文化として認める協会の公式サイトを公開しました。',
  },
  {
    id: 2,
    date: '2025-10-07',
    title: '入会試験と会員証発行機能を公開',
    excerpt: 'Webから入会試験を受験し、会員証を発行できるようになりました。',
  },
  {
    id: 3,
    date: '2025-10-07',
    title: '天パ予報機能をリリース',
    excerpt: '気象データをもとに天パ爆発指数を可視化したマップを公開しました。',
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
