'use server';

import { adminDb } from '@/lib/firebase';
import { MemberFormSchema } from '@/lib/validation';
import type { MemberFormData, RegisterMemberResult } from '@/types/member';
import { ZodError } from 'zod';

/**
 * 会員番号生成（JCHA-XXXXXX形式、6桁ランダム数字）
 * ユニークチェック付き（最大10回リトライ）
 */
async function generateUniqueMemberId(): Promise<string> {
  const maxRetries = 10;

  for (let i = 0; i < maxRetries; i++) {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
    const memberId = `JCHA-${randomNumber}`;

    // Firestoreでユニークチェック
    const snapshot = await adminDb
      .collection('members')
      .where('memberId', '==', memberId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return memberId;
    }
  }

  throw new Error('会員番号の生成に失敗しました');
}

/**
 * 会員登録 Server Action
 */
export async function registerMember(
  formData: MemberFormData
): Promise<RegisterMemberResult> {
  try {
    // 0. Firebase接続チェック
    if (!adminDb) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'データベース接続エラー。環境変数を確認してください。',
      };
    }

    // 1. Zodバリデーション
    const validated = MemberFormSchema.parse(formData);

    // 2. メール重複チェック
    const emailSnapshot = await adminDb
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
    const memberId = await generateUniqueMemberId();

    // 4. Firestore members コレクションに保存
    await adminDb.collection('members').add({
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

    // 5. 成功時
    return {
      success: true,
      memberId,
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
