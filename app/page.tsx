import { Suspense } from 'react';
import Link from 'next/link';
import MemberCount from '@/components/MemberCount';
import ForecastMap from '@/components/ForecastMap';
import NewsSection from '@/components/NewsSection';

function MemberCountSkeleton() {
  return (
    <div className="card-official text-center animate-pulse">
      <h2 className="text-2xl font-bold text-navy mb-4">現在の会員数</h2>
      <div className="h-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gold mb-6">
          クセは個性、個性は文化。
        </h1>
        <p className="text-xl text-white mb-8">
          日本天パ協会は、天然パーマの個性を文化として認め、
          <br />
          すべての天パの方々が誇りを持てる社会を目指します。
        </p>
        <Link href="/join" className="btn-primary text-lg px-8 py-4">
          入会試験を受ける
        </Link>
      </section>

      {/* Member Count & Forecast */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Suspense fallback={<MemberCountSkeleton />}>
          <MemberCount />
        </Suspense>
        <ForecastMap />
      </div>

      {/* News Section */}
      <section className="mb-12">
        <NewsSection />
      </section>

      {/* CTA Section */}
      <section className="card-official text-center bg-gradient-to-r from-navy to-blue-900">
        <h2 className="text-3xl font-bold text-gold mb-4">
          日本天パ協会の一員になりませんか？
        </h2>
        <p className="text-white mb-6">
          入会試験は誰でも合格できます。あなたの天パを認定しましょう。
        </p>
        <Link href="/join" className="btn-primary">
          今すぐ入会試験を受ける
        </Link>
      </section>
    </div>
  );
}
