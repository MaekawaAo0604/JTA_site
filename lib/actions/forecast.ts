'use server';

import { db } from '@/lib/firebase-admin';

export async function getForecastImageUrl(): Promise<string> {
  // キャッシュバスティング用の日付パラメータを追加
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const defaultImageUrl = `https://raw.githubusercontent.com/MaekawaAo0604/tenpayoho/gh-pages/forecast/latest.png?v=${today}`;

  try {
    if (!db) {
      return defaultImageUrl;
    }

    const forecastDoc = await db
      .collection('config')
      .doc('forecast')
      .get();

    if (!forecastDoc.exists) {
      return defaultImageUrl;
    }

    const data = forecastDoc.data();
    const imageUrl = data?.imageUrl || defaultImageUrl;

    // Firestoreから取得したURLにもキャッシュバスティングパラメータを追加
    return imageUrl.includes('?') ? `${imageUrl}&v=${today}` : `${imageUrl}?v=${today}`;
  } catch (error) {
    console.error('Failed to get forecast image URL:', error);
    return defaultImageUrl;
  }
}
