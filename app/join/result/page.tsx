'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { sendVerificationEmail } from '@/app/actions/send-verification-email';
import { EmailFormSchema, type EmailFormInput } from '@/lib/validation';

export default function ResultPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormInput>({
    resolver: zodResolver(EmailFormSchema),
  });

  const onSubmit = async (data: EmailFormInput) => {
    setIsSubmitting(true);

    try {
      const result = await sendVerificationEmail(data);

      if (result.success) {
        setEmailSent(true);
        toast.success('確認メールを送信しました。メールをご確認ください。');
      } else {
        toast.error(result.error || 'メール送信に失敗しました');
      }
    } catch (err) {
      toast.error('メール送信中にエラーが発生しました');
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
          入会試験に合格しました。会員登録を開始するには、メールアドレスを入力してください。
        </p>
      </div>

      {!emailSent ? (
        /* メールアドレス入力フォーム */
        <form onSubmit={handleSubmit(onSubmit)} className="card-official">
          <h2 className="text-2xl font-bold text-navy mb-6">メールアドレス登録</h2>

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
              {isSubmitting ? '送信中...' : '確認メールを送信'}
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
            メール内のリンクをクリックして、パスワードの設定を完了してください。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-gray-600">
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
              <br />
              確認リンクの有効期限は24時間です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
