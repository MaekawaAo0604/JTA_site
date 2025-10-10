import Image from 'next/image';
import { getForecastImageUrl } from '@/lib/actions/forecast';

export default async function ForecastMap() {
  const imageUrl = await getForecastImageUrl();

  return (
    <div className="card-official">
      <h2 className="text-2xl font-semibold text-navy mb-4">天パ天気予報</h2>
      <div className="relative w-full aspect-[16/9] bg-navy/5 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={imageUrl}
          alt="天パ天気予報（札幌・東京・名古屋・大阪・広島・福岡の天パ爆発指数マップ）"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        毎朝7:30更新 | 6都市の天パ爆発指数
      </p>
    </div>
  );
}
