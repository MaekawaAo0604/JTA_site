'use server';

import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

/**
 * Firebase ID トークンからセッション Cookie を作成
 */
export async function createSessionCookie(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // ID トークンを検証
    const decodedIdToken = await auth.verifyIdToken(idToken);
    
    // セッション Cookie の有効期限（5日間）
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // セッション Cookie を作成
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    // Cookie を設定
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Session cookie creation failed:', error);
    return { success: false, error: 'セッションの作成に失敗しました' };
  }
}

/**
 * セッション Cookie を削除（ログアウト）
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('__session');
}
