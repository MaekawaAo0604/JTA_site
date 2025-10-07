'use server';

import { db } from '@/lib/firebase-admin';
import type { ContactFormData, SubmitContactResult } from '@/types/member';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * お問い合わせを送信する
 */
export async function submitContact(
  data: ContactFormData
): Promise<SubmitContactResult> {
  try {
    // バリデーション
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        error: 'すべての項目を入力してください',
      };
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: '有効なメールアドレスを入力してください',
      };
    }

    // Firebase Admin SDK初期化チェック
    if (!db) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'データベース接続エラーが発生しました',
      };
    }

    // Firestoreに保存
    const contactRef = db.collection('contacts').doc();
    await contactRef.set({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'unread',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('お問い合わせの送信に失敗しました:', error);
    return {
      success: false,
      error: 'お問い合わせの送信に失敗しました。時間をおいて再度お試しください。',
    };
  }
}
