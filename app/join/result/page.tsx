'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerMember } from '@/app/actions/register-member';
import type { MemberFormData } from '@/types/member';

export default function ResultPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [initialPassword, setInitialPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    age: 0,
    gender: '男性',
    hairType: '直毛',
    agreeToPrivacy: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};

    // メールバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // 年齢バリデーション
    if (!formData.age || formData.age < 13 || formData.age > 120) {
      newErrors.age = '年齢は13歳から120歳の間で入力してください';
    }

    // プライバシーポリシー同意
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'プライバシーポリシーに同意する必要があります';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerMember(formData);

      if (result.success && result.memberId) {
        setMemberId(result.memberId);
        setInitialPassword(result.initialPassword || null);
        setRegistrationComplete(true);
      } else {
        setError(result.error || '登録に失敗しました');
      }
    } catch (err) {
      setError('登録中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof MemberFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* 合格メッセージ */}
      <div className="card-official mb-8 text-center bg-gradient-to-r from-navy to-blue-900">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-gold mb-4">合格おめでとうございます！</h1>
        <p className="text-white text-lg">
          入会試験に合格しました。下記のフォームから会員登録を完了してください。
        </p>
      </div>

      {!registrationComplete ? (
        /* 登録フォーム */
        <form onSubmit={handleSubmit} className="card-official">
          <h2 className="text-2xl font-bold text-navy mb-6">会員登録フォーム</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* 名前（任意） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                お名前 <span className="text-gray-500 font-normal">(任意)</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="例: 山田 太郎"
              />
            </div>

            {/* メールアドレス（必須） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
                }`}
                placeholder="example@email.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* 年齢（必須） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                年齢 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gold'
                }`}
                placeholder="例: 25"
                min="13"
                max="120"
                required
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            {/* 性別（必須） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                性別 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              >
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* 髪質（必須） */}
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                髪質 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.hairType}
                onChange={(e) => handleInputChange('hairType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              >
                <option value="直毛">直毛</option>
                <option value="くせ毛">くせ毛</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* プライバシーポリシー同意 */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                  className="mt-1 accent-gold"
                  required
                />
                <span className="text-sm text-gray-700">
                  <a href="/privacy" className="text-gold hover:underline">
                    プライバシーポリシー
                  </a>
                  に同意します <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeToPrivacy && (
                <p className="text-red-500 text-sm mt-1">{errors.agreeToPrivacy}</p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      ) : (
        /* 登録完了メッセージ */
        <div className="card-official text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-navy mb-4">登録完了</h2>
          <p className="text-gray-700 mb-2">会員登録が完了しました。</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">会員番号</p>
            <p className="text-2xl font-bold text-navy mb-4">{memberId}</p>
            {initialPassword && (
              <>
                <p className="text-sm text-gray-600 mb-2">初期パスワード（会員証ログイン用）</p>
                <p className="text-2xl font-bold text-navy mb-2">{initialPassword}</p>
                <p className="text-xs text-red-600 mt-2">
                  ※ このパスワードは再表示されません。必ず保存してください。
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary text-lg px-8 py-3"
          >
            ログインして会員証を発行する
          </button>
        </div>
      )}
    </div>
  );
}
