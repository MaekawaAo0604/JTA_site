// Firebase Admin SDK (サーバーサイド用)
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

if (!getApps().length && hasFirebaseConfig) {
  try {
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY!);

    initializeApp({
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
}

export const adminDb = hasFirebaseConfig ? getFirestore() : null as any;
