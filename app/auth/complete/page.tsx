'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { registerMember } from '@/app/actions/register-member';
import { getMemberByUid } from '@/app/actions/get-member-by-uid';
import { MemberFormSchema, type MemberFormInput } from '@/lib/validation';

export default function CompletePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormInput>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues: {
      age: 20,
      gender: '男性',
      hairType: 'くせ毛',
    },
  });

  useEffect(() => {
    if (!auth) {
      toast.error('Firebase認証が初期化されていません');
      router.push('/login');
      return;
    }

    // 認証状態を確認
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 未認証の場合はログインページへ
        toast.error('アカウントが見つかりません。ログインしてください。');
        router.push('/login');
        return;
      }

      // 既に会員登録済みかチェック
      const member = await getMemberByUid(user.uid);
      if (member) {
        // 既に登録済みの場合は会員証ページへ
        toast.success('既に会員登録が完了しています');
        router.push('/member-card');
        return;
      }

      setUid(user.uid);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const onSubmit = async (data: MemberFormInput) => {
    if (!uid) {
      toast.error('認証情報が見つかりません');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerMember(uid, data);

      if (result.success && result.memberId) {
        toast.success(`会員登録が完了しました！会員番号: ${result.memberId}`);
        // 会員証ページへ遷移
        router.push('/member-card');
      } else {
        toast.error(result.error || '登録に失敗しました');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('登録中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="card-official text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Toaster position="top-center" />

      {/* ヘッダー */}
      <div className="card-official mb-8 text-center bg-gradient-to-r from-navy to-blue-900">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-4xl font-bold text-gold mb-4">会員情報登録</h1>
        <p className="text-white text-lg">
          あと少しで登録完了です。会員情報を入力してください。
        </p>
      </div>

      {/* 会員情報入力フォーム */}
      <form onSubmit={handleSubmit(onSubmit)} className="card-official">
        <div className="space-y-6">
          {/* 名前（任意） */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              名前 <span className="text-gray-500 text-xs">(任意)</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="山田 太郎"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              ※ 会員証に表示されます。未入力の場合は会員番号のみ表示されます。
            </p>
          </div>

          {/* 年齢 */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              年齢 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
              }`}
              placeholder="20"
              min="13"
              max="120"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              性別 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="男性"
                  {...register('gender')}
                  className="accent-gold"
                />
                <span>男性</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="女性"
                  {...register('gender')}
                  className="accent-gold"
                />
                <span>女性</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="その他"
                  {...register('gender')}
                  className="accent-gold"
                />
                <span>その他</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
            )}
          </div>

          {/* 髪質 */}
          <div>
            <label className="block text-sm font-bold text-navy mb-2">
              髪質 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="直毛"
                  {...register('hairType')}
                  className="accent-gold"
                />
                <span>直毛</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="くせ毛"
                  {...register('hairType')}
                  className="accent-gold"
                />
                <span>くせ毛</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="その他"
                  {...register('hairType')}
                  className="accent-gold"
                />
                <span>その他</span>
              </label>
            </div>
            {errors.hairType && (
              <p className="text-red-500 text-sm mt-1">{errors.hairType.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '登録中...' : '会員登録を完了'}
          </button>
        </div>
      </form>
    </div>
  );
}
