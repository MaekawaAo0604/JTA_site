'use server';

import { db } from '@/lib/firebase-admin';

export async function getMemberCount(): Promise<number> {
  try {
    if (!db) {
      return 0; // Firebase未設定時は0を返す
    }
    const membersSnapshot = await db
      .collection('members')
      .count()
      .get();
    return membersSnapshot.data().count;
  } catch (error) {
    console.error('Failed to get member count:', error);
    return 0;
  }
}
