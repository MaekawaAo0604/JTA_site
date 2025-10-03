import Image from 'next/image';

export default function ForecastMap() {
  return (
    <div className="card-official">
      <h2 className="text-2xl font-bold text-navy mb-4">本日の天パ天気予報</h2>
      <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src="/forecast/latest.png"
          alt="天パ天気予報マップ"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        毎朝7:30更新 | 6都市の天パ爆発指数
      </p>
    </div>
  );
}
