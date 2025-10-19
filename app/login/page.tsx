'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { auth } from '@/lib/firebase-client';
import { LoginFormSchema, type LoginFormInput } from '@/lib/validation';
import { getMemberByUid } from '@/app/actions/get-member-by-uid';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    if (!auth) {
      toast.error('Firebase認証が初期化されていません');
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebase Authでログイン
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // メールアドレスが確認されているかチェック
      if (!user.emailVerified) {
        toast.error('メールアドレスが確認されていません。確認メールをご確認ください。');
        if (auth) {
          await auth.signOut();
        }
        return;
      }

      // 会員情報が登録されているか確認
      const member = await getMemberByUid(user.uid);

      if (!member) {
        // 会員情報が未登録の場合は登録ページへ
        toast.success('ログインしました。会員情報を登録してください。');
        router.push('/auth/complete');
      } else {
        // 会員情報が登録済みの場合は会員証ページへ
        toast.success('ログインしました');
        router.push('/member-card');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // エラーメッセージをユーザーフレンドリーに変換
      let errorMessage = 'ログインに失敗しました';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが正しくありません';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'ログイン試行回数が多すぎます。しばらくしてから再度お試しください';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'ネットワークエラーが発生しました';
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Toaster position="top-center" />

      <div className="card-official">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">会員ログイン</h1>
          <p className="text-gray-600">
            メールアドレスとパスワードでログインしてください
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              パスワード
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="パスワード"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            アカウントをお持ちでない方は
            <br />
            <a href="/join" className="text-gold hover:underline font-bold">
              入会試験
            </a>
            からご登録ください
          </p>
        </div>
      </div>
    </div>
  );
}
