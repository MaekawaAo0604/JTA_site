'use server';

import { db, auth } from '@/lib/firebase-admin';
import { MemberFormSchema } from '@/lib/validation';
import type { MemberFormData, RegisterMemberResult } from '@/types/member';
import { ZodError } from 'zod';

/**
 * 会員番号生成（JTA-XXXXXXXX形式、8桁連番）
 * Firestore Transactionで安全に連番を発行
 * 最大99,999,999人まで対応
 */
async function generateSequentialMemberId(): Promise<string> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const counterRef = db.collection('counters').doc('memberIdCounter');

  return await db.runTransaction(async (transaction: FirebaseFirestore.Transaction) => {
    const counterDoc = await transaction.get(counterRef) as unknown as FirebaseFirestore.DocumentSnapshot;

    // 現在のカウンターを取得（初回は0）
    let currentNumber = 0;
    if (counterDoc.exists) {
      const data = counterDoc.data();
      currentNumber = data?.current || 0;
    }

    // 次の番号
    const nextNumber = currentNumber + 1;

    // 最大値チェック（99,999,999人まで）
    if (nextNumber > 99999999) {
      throw new Error('会員番号の上限に達しました');
    }

    // 8桁にゼロパディング
    const paddedNumber = nextNumber.toString().padStart(8, '0');
    const memberId = `JTA-${paddedNumber}`;

    // カウンターを更新
    transaction.set(counterRef, { current: nextNumber }, { merge: true });

    return memberId;
  });
}

/**
 * 会員情報登録 Server Action（メール認証後）
 * Firebase Auth UIDを受け取り、会員情報をFirestoreに保存
 */
export async function registerMember(
  uid: string,
  formData: MemberFormData
): Promise<RegisterMemberResult> {
  try {
    // 0. Firebase接続チェック
    if (!db || !auth) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'データベース接続エラー。環境変数を確認してください。',
      };
    }

    // 1. Zodバリデーション
    const validated = MemberFormSchema.parse(formData);

    // 2. Firebase Auth から uid でユーザー情報取得
    let userEmail: string;
    try {
      const userRecord = await auth.getUser(uid);
      userEmail = userRecord.email || '';

      if (!userEmail) {
        return {
          success: false,
          error: '認証情報が見つかりません',
        };
      }
    } catch (authError: any) {
      console.error('Failed to get user by UID:', authError);
      return {
        success: false,
        error: '認証情報の取得に失敗しました',
      };
    }

    // 3. 既に会員登録済みかチェック
    const existingMemberSnapshot = await db
      .collection('members')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (!existingMemberSnapshot.empty) {
      return {
        success: false,
        error: 'このアカウントは既に会員登録されています',
      };
    }

    // 4. 会員番号生成
    const memberId = await generateSequentialMemberId();

    // 5. Firestore members コレクションに保存
    await db.collection('members').add({
      uid,
      name: validated.name || null,
      email: userEmail,
      age: validated.age,
      gender: validated.gender,
      hairType: validated.hairType,
      memberId,
      issuedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Member registered successfully:', {
      uid,
      memberId,
      email: userEmail,
    });

    // 6. 成功時
    return {
      success: true,
      memberId,
    };
  } catch (error) {
    // エラーハンドリング
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      console.error('Zod validation error:', fieldErrors);
      return {
        success: false,
        error: `バリデーションエラー: ${fieldErrors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
      };
    }

    console.error('Registration error:', error);
    return {
      success: false,
      error: `登録に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
