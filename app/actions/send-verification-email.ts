'use server';

import { db } from '@/lib/firebase-admin';
import { EmailFormSchema } from '@/lib/validation';
import type { EmailFormData } from '@/types/member';
import { ZodError } from 'zod';
import { randomUUID } from 'crypto';

/**
 * メール確認送信 Server Action
 * メールアドレス確認用のトークンを生成して送信
 */
export async function sendVerificationEmail(
  formData: EmailFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebaseの初期化確認
    if (!db) {
      console.error('Firebase Admin SDK is not initialized');
      return {
        success: false,
        error: 'サーバーの初期化に失敗しました',
      };
    }

    // 1. Zodでバリデーション
    const validated = EmailFormSchema.parse(formData);

    // 2. メールアドレスがFirebase Authに既に登録されているかチェック
    // Note: Firebase Admin SDKではfetchSignInMethodsForEmailは使えない
    // 代わりにFirestoreのmembersコレクションを確認
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

    // 3. 既存のトークンを削除（同じメールアドレス用）
    const existingTokensSnapshot = await db
      .collection('emailVerificationTokens')
      .where('email', '==', validated.email)
      .get();

    const batch = db.batch();
    existingTokensSnapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // 4. トークン生成
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24時間有効

    // 5. Firestore emailVerificationTokens コレクションに保存
    await db.collection('emailVerificationTokens').add({
      email: validated.email,
      token,
      expiresAt,
      createdAt: new Date(),
    });

    // 6. メール送信
    // TODO: 実際にはFirebase Admin SDKやSendGrid/Resendなどを使用してメール送信
    // 現在は確認リンクをコンソールに出力
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;

    console.log('=== メール確認リンク ===');
    console.log(`宛先: ${validated.email}`);
    console.log(`確認リンク: ${verificationLink}`);
    console.log(`有効期限: ${expiresAt.toLocaleString('ja-JP')}`);
    console.log('========================');

    // TODO: 実際のメール送信実装
    // 例: SendGrid, Resend, Firebase Extensionsなど
    /*
    await sendEmail({
      to: validated.email,
      subject: '【日本天パ協会】メール確認',
      html: `
        <p>日本天パ協会へようこそ！</p>
        <p>以下のリンクをクリックしてメールアドレスを確認し、パスワードを設定してください。</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>このリンクの有効期限は24時間です。</p>
      `,
    });
    */

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
        error: `入力エラー: ${fieldErrors.map((e) => e.message).join(', ')}`,
      };
    }

    console.error('Send verification email error:', error);
    return {
      success: false,
      error: `メール送信に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
