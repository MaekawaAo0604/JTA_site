'use server';

import { db } from '@/lib/firebase-admin';

/**
 * UIDから会員情報を取得
 */
export async function getMemberByUid(uid: string) {
  try {
    const snapshot = await db
      .collection('members')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      memberId: data.memberId,
      hairType: data.hairType,
      age: data.age,
      gender: data.gender,
    };
  } catch (error) {
    console.error('会員情報の取得に失敗しました:', error);
    return null;
  }
}
