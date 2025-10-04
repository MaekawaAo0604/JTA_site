'use client';

import { useState } from 'react';
import { registerMember } from '@/app/actions/register-member';
import type { MemberFormData } from '@/types/member';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResult('テスト中...');

    try {
      // テストデータで登録を試行
      const testData: MemberFormData = {
        name: 'テストユーザー',
        email: `test-${Date.now()}@example.com`,
        age: 25,
        gender: '男性',
        hairType: 'くせ毛',
        agreeToPrivacy: true,
      };

      const result = await registerMember(testData);

      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const checkEnvVars = () => {
    const envCheck = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ 設定済み' : '❌ 未設定',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ 設定済み' : '❌ 未設定',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ 設定済み' : '❌ 未設定',
    };

    setTestResult(JSON.stringify(envCheck, null, 2));
  };

  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card-official">
          <h1 className="text-3xl font-bold text-navy mb-8">🔧 デバッグページ</h1>

          <div className="space-y-6">
            {/* 環境変数チェック */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">1. クライアント環境変数チェック</h2>
              <button
                onClick={checkEnvVars}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                環境変数を確認
              </button>
            </div>

            {/* Firebase登録テスト */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">2. Firebase登録テスト</h2>
              <button
                onClick={testFirebaseConnection}
                disabled={loading}
                className="bg-gold text-navy px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'テスト中...' : '登録テストを実行'}
              </button>
            </div>

            {/* 結果表示 */}
            {testResult && (
              <div>
                <h2 className="text-xl font-semibold text-navy mb-4">結果</h2>
                <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto text-sm">
                  {testResult}
                </pre>
              </div>
            )}

            {/* 手動入力テスト */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">3. 手動入力テスト</h2>
              <ManualTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualTest() {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    age: 0,
    gender: '男性',
    hairType: 'くせ毛',
    agreeToPrivacy: false,
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('送信中...');

    try {
      const res = await registerMember(formData);
      setResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setResult(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">名前</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メール *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">年齢 *</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.agreeToPrivacy}
              onChange={(e) => setFormData({ ...formData, agreeToPrivacy: e.target.checked })}
              className="accent-gold"
            />
            <span className="text-sm">プライバシーポリシーに同意</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-gold px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '送信中...' : '登録テスト'}
        </button>
      </form>

      {result && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm mt-4">
          {result}
        </pre>
      )}
    </div>
  );
}
