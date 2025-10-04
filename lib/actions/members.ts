'use server';

import { adminDb } from '@/lib/firebase';

export async function getMemberCount(): Promise<number> {
  try {
    if (!adminDb) {
      return 0; // Firebase未設定時は0を返す
    }
    const membersSnapshot = await adminDb
      .collection('members')
      .count()
      .get();
    return membersSnapshot.data().count;
  } catch (error) {
    console.error('Failed to get member count:', error);
    return 0;
  }
}
