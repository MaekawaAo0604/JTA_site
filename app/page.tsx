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
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold text-gold mb-8 leading-tight">
          クセは個性、個性は文化。
        </h1>
        <p className="text-xl md:text-2xl text-white mb-10 font-light leading-relaxed max-w-3xl mx-auto">
          日本天パ協会は、天然パーマの個性を文化として認め、
          <br />
          すべての天パの方々が誇りを持てる社会を目指します。
        </p>
        <Link href="/join" className="inline-block bg-transparent border-2 border-gold text-gold font-medium px-10 py-4 rounded-lg hover:bg-gold hover:text-navy transition-all duration-300 text-lg">
          入会試験を受ける
        </Link>
      </section>

      {/* Member Count & Forecast */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Suspense fallback={<MemberCountSkeleton />}>
          <MemberCount />
        </Suspense>
        <ForecastMap />
      </div>

      {/* News Section */}
      <section className="mb-16">
        <NewsSection />
      </section>

      {/* CTA Section */}
      <section className="card-official text-center">
        <h2 className="text-3xl font-semibold text-navy mb-6">
          日本天パ協会の一員になりませんか？
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          入会試験は誰でも合格できます。あなたの天パを認定しましょう。
        </p>
        <Link href="/join" className="inline-block bg-transparent border-2 border-gold text-gold font-medium px-10 py-4 rounded-lg hover:bg-gold hover:text-navy transition-all duration-300 text-lg">
          今すぐ入会試験を受ける
        </Link>
      </section>
    </div>
  );
}
