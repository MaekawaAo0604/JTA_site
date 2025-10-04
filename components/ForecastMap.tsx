'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase-client';
import { doc, getDoc } from 'firebase/firestore';

export default function ForecastMap() {
  const [imageUrl, setImageUrl] = useState<string>('/forecast/latest.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecastImage = async () => {
      try {
        const forecastDoc = await getDoc(doc(db, 'config', 'forecast'));
        if (forecastDoc.exists()) {
          const data = forecastDoc.data();
          setImageUrl(data.imageUrl || '/forecast/latest.png');
        }
      } catch (error) {
        console.error('Failed to fetch forecast image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastImage();
  }, []);

  return (
    <div className="card-official">
      <h2 className="text-2xl font-bold text-navy mb-4">本日の天パ天気予報</h2>
      <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400">読み込み中...</div>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="天パ天気予報マップ"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        )}
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        毎朝7:30更新 | 6都市の天パ爆発指数
      </p>
    </div>
  );
}
