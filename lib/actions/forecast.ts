'use server';

import { adminDb } from '@/lib/firebase';

export async function getForecastImageUrl(): Promise<string> {
  try {
    if (!adminDb) {
      return '/forecast/latest.png';
    }

    const forecastDoc = await adminDb
      .collection('config')
      .doc('forecast')
      .get();

    if (!forecastDoc.exists) {
      return '/forecast/latest.png';
    }

    const data = forecastDoc.data();
    return data?.imageUrl || '/forecast/latest.png';
  } catch (error) {
    console.error('Failed to get forecast image URL:', error);
    return '/forecast/latest.png';
  }
}
