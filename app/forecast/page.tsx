import type { Metadata } from 'next';
import ForecastMap from '@/components/ForecastMap';

export const metadata: Metadata = {
  title: '天パ天気予報',
  description: '全国6都市の天パ爆発指数を毎日更新',
};

export default function ForecastPage() {
  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gold mb-8 text-center">
            天パ天気予報
          </h1>

          <div className="mb-12">
            <ForecastMap />
          </div>

          <div className="card-official">
            <h2 className="text-2xl font-semibold text-navy mb-6">天パ爆発指数について</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                天パ爆発指数は、湿度・気温・風速などの気象データを基に、
                天然パーマの髪がどれだけ爆発しやすいかを数値化したものです。
              </p>

              <div className="bg-navy/5 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy mb-4">指数の見方</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-red-600 min-w-[60px]">90-100:</span>
                    <span>危険 - 外出は避けるレベル</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-orange-600 min-w-[60px]">70-89:</span>
                    <span>警戒 - 帽子や整髪料必須</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-600 min-w-[60px]">50-69:</span>
                    <span>注意 - 軽い対策が必要</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-green-600 min-w-[60px]">30-49:</span>
                    <span>良好 - 比較的安定</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600 min-w-[60px]">0-29:</span>
                    <span>最良 - 髪型が決まる日</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-navy mb-3">更新時刻</h3>
                <p>毎朝7:30に全国6都市（札幌・東京・名古屋・大阪・福岡・那覇）の予報を更新しています。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
