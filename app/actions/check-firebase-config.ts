'use server';

import { db } from '@/lib/firebase-admin';

export async function checkFirebaseConfig() {
  const adminConfig = {
    projectId: !!process.env.FIREBASE_PROJECT_ID,
    clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    initialized: false,
    error: null as string | null,
  };

  const clientConfig = {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Admin SDK初期化確認
  try {
    if (db) {
      // 簡単なFirestore操作でテスト
      await db.collection('_health_check').limit(1).get();
      adminConfig.initialized = true;
    }
  } catch (error) {
    adminConfig.error = error instanceof Error ? error.message : String(error);
  }

  return {
    admin: adminConfig,
    client: clientConfig,
  };
}
