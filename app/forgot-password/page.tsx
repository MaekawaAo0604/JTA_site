'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    console.log('=== Password Reset Debug ===');
    console.log('Email:', email);
    console.log('Auth object:', auth);
    console.log('Auth app name:', auth?.app?.name);

    try {
      console.log('Calling sendPasswordResetEmail...');
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully!');
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      if (err.code === 'auth/user-not-found') {
        setError('このメールアドレスは登録されていません');
      } else if (err.code === 'auth/invalid-email') {
        setError('有効なメールアドレスを入力してください');
      } else {
        setError(`パスワードリセットメールの送信に失敗しました: ${err.code || err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="card-official">
        <h1 className="text-3xl font-bold text-navy mb-6 text-center">
          パスワードリセット
        </h1>

        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <p className="text-gray-700 mb-4">
              パスワードリセット用のメールを送信しました。
            </p>
            <p className="text-sm text-gray-600 mb-6">
              メールに記載されているリンクをクリックして、新しいパスワードを設定してください。
            </p>
            <Link href="/login" className="btn-primary inline-block">
              ログインページに戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-700 mb-6">
              登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold text-navy mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="example@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '送信中...' : 'リセットメールを送信'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-gold hover:underline text-sm">
                ログインページに戻る
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
