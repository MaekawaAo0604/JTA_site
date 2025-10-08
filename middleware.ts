import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /admin/* へのアクセスを保護
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Cookie から Firebase Auth セッショントークンを取得
    const sessionCookie = request.cookies.get('__session')?.value;
    
    if (!sessionCookie) {
      // 未認証の場合はログインページにリダイレクト
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
