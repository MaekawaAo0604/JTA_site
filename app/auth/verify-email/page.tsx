'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { createAuthUser } from '@/app/actions/create-auth-user';
import { PasswordFormSchema, type PasswordFormInput } from '@/lib/validation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(PasswordFormSchema),
  });

  useEffect(() => {
    // トークンの存在確認
    if (!token) {
      setTokenValid(false);
      toast.error('確認リンクが無効です');
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const onSubmit = async (data: PasswordFormInput) => {
    if (!token) {
      toast.error('確認リンクが無効です');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAuthUser(token, data.password, data.confirmPassword);

      if (result.success) {
        toast.success('アカウントを作成しました。会員情報を登録してください。');
        // 会員情報登録ページへ遷移
        router.push('/auth/complete');
      } else {
        toast.error(result.error || 'アカウント作成に失敗しました');
      }
    } catch (err) {
      console.error('Account creation error:', err);
      toast.error('アカウント作成中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // トークンがない場合のエラー表示
  if (tokenValid === false) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Toaster position="top-center" />
        <div className="card-official text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-navy mb-4">確認リンクが無効です</h1>
          <p className="text-gray-700 mb-6">
            確認リンクが見つからないか、無効です。
            <br />
            もう一度登録をやり直してください。
          </p>
          <button
            onClick={() => router.push('/join/result')}
            className="btn-primary"
          >
            登録ページへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Toaster position="top-center" />

      {/* パスワード設定フォーム */}
      <div className="card-official mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-navy mb-2">パスワード設定</h1>
          <p className="text-gray-700">
            アカウントのパスワードを設定してください。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* パスワード */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="8文字以上のパスワード"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              ※ 8文字以上で設定してください
            </p>
          </div>

          {/* パスワード確認 */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              パスワード（確認） <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="パスワードを再入力"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '作成中...' : 'アカウントを作成'}
            </button>
          </div>
        </form>
      </div>

      {/* セキュリティ情報 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-navy mb-2">セキュリティについて</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>パスワードは8文字以上で設定してください</li>
          <li>他のサービスと同じパスワードの使用は避けてください</li>
          <li>パスワードは安全に保管してください</li>
        </ul>
      </div>
    </div>
  );
}
