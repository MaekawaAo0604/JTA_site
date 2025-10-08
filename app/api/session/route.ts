import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // ID トークンを検証
    const decodedIdToken = await auth.verifyIdToken(idToken);

    // セッション Cookie の有効期限（5日間）
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // セッション Cookie を作成
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Cookie を設定
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000, // 秒単位
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation failed:', error);
    return NextResponse.json(
      { error: 'セッションの作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('__session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion failed:', error);
    return NextResponse.json(
      { error: 'セッションの削除に失敗しました' },
      { status: 500 }
    );
  }
}
