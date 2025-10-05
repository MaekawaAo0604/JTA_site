'use server';

import { adminDb } from '@/lib/firebase';

export async function getForecastImageUrl(): Promise<string> {
  const defaultImageUrl = 'https://raw.githubusercontent.com/MaekawaAo0604/tenpayoho/gh-pages/forecast/latest.png';

  try {
    if (!adminDb) {
      return defaultImageUrl;
    }

    const forecastDoc = await adminDb
      .collection('config')
      .doc('forecast')
      .get();

    if (!forecastDoc.exists) {
      return defaultImageUrl;
    }

    const data = forecastDoc.data();
    return data?.imageUrl || defaultImageUrl;
  } catch (error) {
    console.error('Failed to get forecast image URL:', error);
    return defaultImageUrl;
  }
}
