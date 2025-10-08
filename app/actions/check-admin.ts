'use server';

import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

const ADMIN_EMAIL = 'ao.maekawa@gmail.com';

/**
 * 管理者権限チェック
 */
export async function checkAdminAccess(): Promise<{ isAdmin: boolean; email?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return { isAdmin: false };
    }

    // セッションCookieを検証
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const email = decodedClaims.email;

    // 管理者メールアドレスと一致するか確認
    const isAdmin = email === ADMIN_EMAIL;

    return { isAdmin, email };
  } catch (error) {
    console.error('Admin access check failed:', error);
    return { isAdmin: false };
  }
}
