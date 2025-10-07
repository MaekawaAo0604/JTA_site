// Firebase Admin SDK (サーバーサイド用)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Firebase設定チェック
const hasFirebaseConfig = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

// Private Keyの正規化
function normalizePrivateKey(key: string): string {
  // すでに改行が含まれている場合はそのまま返す
  if (key.includes('\n')) {
    return key;
  }

  // \n を実際の改行に変換
  return key.replace(/\\n/g, '\n');
}

let adminApp: App | null = null;

if (!getApps().length && hasFirebaseConfig) {
  try {
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY!);

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    console.error('Private key length:', process.env.FIREBASE_PRIVATE_KEY?.length);
    console.error('Private key starts with:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50));
  }
} else if (getApps().length > 0) {
  adminApp = getApps()[0];
}

export const db = hasFirebaseConfig && adminApp ? getFirestore(adminApp) : null as any;
export const auth = hasFirebaseConfig && adminApp ? getAuth(adminApp) : null as any;
