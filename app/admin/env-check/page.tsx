import { checkFirebaseConfig } from '@/app/actions/check-firebase-config';

export default async function EnvCheckPage() {
  const config = await checkFirebaseConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">環境変数チェック</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Admin SDK</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={config.admin.projectId ? 'text-green-600' : 'text-red-600'}>
                {config.admin.projectId ? '✅' : '❌'}
              </span>
              <span>FIREBASE_PROJECT_ID: {config.admin.projectId ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.admin.clientEmail ? 'text-green-600' : 'text-red-600'}>
                {config.admin.clientEmail ? '✅' : '❌'}
              </span>
              <span>FIREBASE_CLIENT_EMAIL: {config.admin.clientEmail ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.admin.privateKey ? 'text-green-600' : 'text-red-600'}>
                {config.admin.privateKey ? '✅' : '❌'}
              </span>
              <span>FIREBASE_PRIVATE_KEY: {config.admin.privateKey ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className={config.admin.initialized ? 'text-green-600' : 'text-red-600'}>
                {config.admin.initialized ? '✅' : '❌'}
              </span>
              <span className="font-semibold">
                Admin SDK 初期化: {config.admin.initialized ? '成功' : '失敗'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Client SDK</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={config.client.apiKey ? 'text-green-600' : 'text-red-600'}>
                {config.client.apiKey ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_API_KEY: {config.client.apiKey ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.client.authDomain ? 'text-green-600' : 'text-red-600'}>
                {config.client.authDomain ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {config.client.authDomain ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.client.projectId ? 'text-green-600' : 'text-red-600'}>
                {config.client.projectId ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID: {config.client.projectId ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.client.storageBucket ? 'text-green-600' : 'text-red-600'}>
                {config.client.storageBucket ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {config.client.storageBucket ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.client.messagingSenderId ? 'text-green-600' : 'text-red-600'}>
                {config.client.messagingSenderId ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: {config.client.messagingSenderId ? '設定済み' : '未設定'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={config.client.appId ? 'text-green-600' : 'text-red-600'}>
                {config.client.appId ? '✅' : '❌'}
              </span>
              <span>NEXT_PUBLIC_FIREBASE_APP_ID: {config.client.appId ? '設定済み' : '未設定'}</span>
            </div>
          </div>
        </div>

        {config.admin.error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">エラー詳細</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{config.admin.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
