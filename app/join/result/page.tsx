'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { auth } from '@/lib/firebase-client';
import { z } from 'zod';

// メール＋パスワード登録用のスキーマ
const RegisterFormSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
    .trim(),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります'),
  confirmPassword: z.string(),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'プライバシーポリシーに同意する必要があります',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type RegisterFormInput = z.infer<typeof RegisterFormSchema>;

export default function ResultPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    if (!auth) {
      toast.error('Firebase認証が初期化されていません');
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebase Auth でユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // メール確認送信
      await sendEmailVerification(userCredential.user);

      setEmailSent(true);
      toast.success('確認メールを送信しました。メールをご確認ください。');
    } catch (error: any) {
      console.error('Registration error:', error);

      let errorMessage = '登録に失敗しました';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に登録されています';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '有効なメールアドレスを入力してください';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードが弱すぎます';
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Toaster position="top-center" />

      {/* 合格メッセージ */}
      <div className="card-official mb-8 text-center bg-gradient-to-r from-navy to-blue-900">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-gold mb-4">合格おめでとうございます！</h1>
        <p className="text-white text-lg">
          入会試験に合格しました。アカウントを作成して会員登録を開始してください。
        </p>
      </div>

      {!emailSent ? (
        /* アカウント作成フォーム */
        <form onSubmit={handleSubmit(onSubmit)} className="card-official">
          <h2 className="text-2xl font-bold text-navy mb-6">アカウント作成</h2>

          <div className="space-y-6">
            {/* メールアドレス（必須） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
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

            {/* プライバシーポリシー同意 */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  {...register('agreeToPrivacy')}
                  className="mt-1 accent-gold"
                />
                <span className="text-sm text-gray-700">
                  <a href="/privacy" target="_blank" className="text-gold hover:underline">
                    プライバシーポリシー
                  </a>
                  に同意します <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeToPrivacy && (
                <p className="text-red-500 text-sm mt-1">{errors.agreeToPrivacy.message}</p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'アカウント作成中...' : 'アカウントを作成'}
            </button>
          </div>
        </form>
      ) : (
        /* メール送信完了メッセージ */
        <div className="card-official text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-3xl font-bold text-navy mb-4">確認メールを送信しました</h2>
          <p className="text-gray-700 mb-6">
            ご登録いただいたメールアドレスに確認メールを送信しました。
            <br />
            メール内のリンクをクリックしてメールアドレスを確認してください。
            <br />
            確認後、ログインして会員情報を登録してください。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600">
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            ログインページへ
          </button>
        </div>
      )}
    </div>
  );
}
