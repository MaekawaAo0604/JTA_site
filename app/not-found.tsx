import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto card-official text-center">
        <h2 className="text-6xl font-bold text-navy mb-4">404</h2>
        <h3 className="text-2xl font-bold text-navy mb-4">
          ページが見つかりません
        </h3>
        <p className="text-gray-600 mb-6">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" className="btn-primary inline-block">
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
