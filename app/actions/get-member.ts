'use server';

import { adminDb } from '@/lib/firebase';
import type { Member } from '@/types/member';

/**
 * 会員情報取得 Server Action
 * @param memberId 会員番号 (例: "JCHA-123456")
 */
export async function getMemberById(
  memberId: string
): Promise<Member | null> {
  try {
    const snapshot = await adminDb
      .collection('members')
      .where('memberId', '==', memberId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // 型安全性のためのバリデーション
    if (
      typeof data.email !== 'string' ||
      typeof data.age !== 'number' ||
      !['男性', '女性', 'その他'].includes(data.gender) ||
      !['直毛', 'くせ毛', 'その他'].includes(data.hairType) ||
      typeof data.memberId !== 'string'
    ) {
      console.error('Invalid member data format:', data);
      return null;
    }

    return {
      id: doc.id,
      name: data.name || null,
      email: data.email,
      age: data.age,
      gender: data.gender as '男性' | '女性' | 'その他',
      hairType: data.hairType as '直毛' | 'くせ毛' | 'その他',
      memberId: data.memberId,
      issuedAt: data.issuedAt,
    };
  } catch (error) {
    console.error('Get member error:', error);
    return null;
  }
}
