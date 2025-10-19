'use server';

import { db, auth } from '@/lib/firebase-admin';
import { PasswordFormSchema } from '@/lib/validation';
import { ZodError } from 'zod';

/**
 * 認証ユーザー作成 Server Action
 * トークンを検証し、Firebase Authユーザーを作成
 */
export async function createAuthUser(
  token: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase接続チェック
    if (!db || !auth) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'データベース接続エラー。環境変数を確認してください。',
      };
    }

    // 1. パスワードバリデーション
    const validated = PasswordFormSchema.parse({ password, confirmPassword });

    // 2. Firestore emailVerificationTokens からトークン取得
    const tokensSnapshot = await db
      .collection('emailVerificationTokens')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (tokensSnapshot.empty) {
      return {
        success: false,
        error: '確認リンクが無効または期限切れです',
      };
    }

    const tokenDoc = tokensSnapshot.docs[0];
    const tokenData = tokenDoc.data();

    // 3. 有効期限チェック
    const expiresAt = tokenData.expiresAt.toDate();
    const now = new Date();

    if (expiresAt < now) {
      // 期限切れトークンを削除
      await tokenDoc.ref.delete();
      return {
        success: false,
        error: '確認リンクの有効期限が切れています。もう一度登録をやり直してください。',
      };
    }

    // 4. Firebase Auth でユーザー作成
    try {
      await auth.createUser({
        email: tokenData.email,
        password: validated.password,
      });

      console.log('Firebase Auth user created:', tokenData.email);
    } catch (authError: any) {
      console.error('Firebase Auth user creation failed:', authError);

      // 既に登録済みのメールアドレスの場合
      if (authError.code === 'auth/email-already-exists') {
        return {
          success: false,
          error: 'このメールアドレスは既に登録されています',
        };
      }

      return {
        success: false,
        error: `アカウント作成に失敗しました: ${authError.message || '不明なエラー'}`,
      };
    }

    // 5. トークン削除
    await tokenDoc.ref.delete();

    return {
      success: true,
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
        error: `バリデーションエラー: ${fieldErrors.map((e) => e.message).join(', ')}`,
      };
    }

    console.error('Create auth user error:', error);
    return {
      success: false,
      error: `アカウント作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
