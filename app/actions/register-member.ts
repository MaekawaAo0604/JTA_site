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
    const counterDoc = await transaction.get(counterRef) as FirebaseFirestore.DocumentSnapshot;

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
 * 会員登録 Server Action
 */
export async function registerMember(
  formData: MemberFormData
): Promise<RegisterMemberResult> {
  try {
    // 0. Firebase接続チェック
    if (!db) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'データベース接続エラー。環境変数を確認してください。',
      };
    }

    // 1. Zodバリデーション
    const validated = MemberFormSchema.parse(formData);

    // 2. メール重複チェック
    const emailSnapshot = await db
      .collection('members')
      .where('email', '==', validated.email)
      .limit(1)
      .get();

    if (!emailSnapshot.empty) {
      return {
        success: false,
        error: 'このメールアドレスは既に登録されています',
      };
    }

    // 3. 会員番号生成
    const memberId = await generateSequentialMemberId();

    // 4. Firebase Authユーザー作成（初期パスワード: 会員番号の下8桁）
    const initialPassword = memberId.split('-')[1]; // JTA-00000001 → 00000001
    let uid: string;

    console.log('=== Firebase Auth User Creation Debug ===');
    console.log('Attempting to create user with email:', validated.email);
    console.log('Initial password:', initialPassword);
    console.log('Display name:', validated.name || 'undefined');
    console.log('Auth instance:', auth ? 'initialized' : 'null');

    if (!auth) {
      console.error('Firebase Auth is not initialized');
      return {
        success: false,
        error: 'Firebase認証が初期化されていません',
      };
    }

    try {
      const userRecord = await auth.createUser({
        email: validated.email,
        password: initialPassword,
        displayName: validated.name || undefined,
      });
      uid = userRecord.uid;
      console.log('User created successfully with UID:', uid);
    } catch (authError: any) {
      console.error('Firebase Auth user creation failed:', authError);
      console.error('Error code:', authError.code);
      console.error('Error message:', authError.message);
      console.error('Error details:', JSON.stringify(authError, null, 2));
      return {
        success: false,
        error: `ユーザー作成に失敗しました: ${authError.message || authError.code || '不明なエラー'}`,
      };
    }

    // 5. Firestore members コレクションに保存
    await db.collection('members').add({
      uid,
      name: validated.name || null,
      email: validated.email,
      age: validated.age,
      gender: validated.gender,
      hairType: validated.hairType,
      memberId,
      agreeToPrivacy: validated.agreeToPrivacy,
      agreeToPrivacyAt: new Date(),
      issuedAt: new Date(),
    });

    // 6. 成功時（初期パスワードを返す）
    return {
      success: true,
      memberId,
      initialPassword,
    };
  } catch (error) {
    // エラーハンドリング
    if (error instanceof ZodError) {
      // Zodエラーの詳細を返す
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

    // 詳細なエラーログ
    console.error('Registration error details:', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      formData: {
        email: formData.email,
        hasName: !!formData.name,
        age: formData.age,
        gender: formData.gender,
        hairType: formData.hairType,
      },
    });

    return {
      success: false,
      error: `登録に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
