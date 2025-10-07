'use client';

import { useState } from 'react';
import { submitContact } from '@/app/actions/submit-contact';
import type { ContactFormData } from '@/types/member';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContact(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'お問い合わせを送信しました。ご連絡ありがとうございます。',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || '送信に失敗しました',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '送信中にエラーが発生しました',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card-official">
          <h1 className="text-3xl font-semibold text-navy mb-8">お問い合わせ</h1>

          {/* お問い合わせフォーム */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="山田 太郎"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                件名 <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="入会試験・会員登録について">入会試験・会員登録について</option>
                <option value="会員証について">会員証について</option>
                <option value="天パ天気予報について">天パ天気予報について</option>
                <option value="個人情報について">個人情報について</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                お問い合わせ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="お問い合わせ内容を入力してください"
              />
            </div>

            {submitStatus.type && (
              <div
                className={`p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </button>
          </form>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">お問い合わせの前に</h2>
              <p className="mb-4">よくあるご質問については、以下をご確認ください。</p>
              <div className="space-y-4">
                <div className="border-l-4 border-gold pl-4">
                  <h3 className="font-semibold text-navy mb-2">入会について</h3>
                  <p className="text-sm">
                    入会試験に合格すると、自動的に会員登録が完了し、会員証がダウンロードできるようになります。
                  </p>
                </div>
                <div className="border-l-4 border-gold pl-4">
                  <h3 className="font-semibold text-navy mb-2">会員証について</h3>
                  <p className="text-sm">
                    会員証は登録完了後すぐにダウンロード可能です。PNG形式の画像ファイルとして保存されます。
                  </p>
                </div>
                <div className="border-l-4 border-gold pl-4">
                  <h3 className="font-semibold text-navy mb-2">個人情報について</h3>
                  <p className="text-sm">
                    個人情報の取り扱いについては、
                    <a
                      href="/privacy"
                      className="text-gold hover:opacity-90 transition-opacity"
                    >
                      プライバシーポリシー
                    </a>
                    をご確認ください。
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gold/10 p-6 rounded-lg border border-gold/30">
              <h2 className="text-lg font-semibold text-navy mb-3">ご注意</h2>
              <ul className="space-y-2 text-sm">
                <li>• お問い合わせへの回答には数日かかる場合がございます。</li>
                <li>• 内容によっては回答できない場合もございますので、予めご了承ください。</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
