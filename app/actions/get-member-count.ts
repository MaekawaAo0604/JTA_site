'use server';

import { db } from '@/lib/firebase-admin';

/**
 * 会員数取得 Server Action
 * フェーズ1: getCountFromServer() 使用
 */
export async function getMemberCount(): Promise<number> {
  try {
    const snapshot = await db.collection('members').count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error('Get member count error:', error);
    return 0;
  }
}

// フェーズ2（パフォーマンス最適化 - 将来実装）
// 将来的には aggregates/memberCount ドキュメントを使用
// Cloud Functions で members 作成・削除時に更新
// const countDoc = await db.collection('aggregates').doc('memberCount').get();
// return countDoc.data()?.count ?? 0;
