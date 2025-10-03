'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-official max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-navy">エラーが発生しました</h1>
        <p className="text-gray-600">
          申し訳ございません。問題が発生しました。
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500">エラーID: {error.digest}</p>
        )}
        <button onClick={reset} className="btn-primary">
          再試行
        </button>
      </div>
    </div>
  );
}
