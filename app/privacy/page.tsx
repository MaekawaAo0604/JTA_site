import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 日本天パ協会',
  description: '日本天パ協会のプライバシーポリシー',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card-official">
          <h1 className="text-3xl font-semibold text-navy mb-8">プライバシーポリシー</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">個人情報の収集について</h2>
              <p className="mb-4">
                日本天パ協会（以下「当協会」）は、会員登録の際に以下の情報を収集します。
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>メールアドレス</li>
                <li>年齢</li>
                <li>性別</li>
                <li>髪質に関する情報</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">利用目的</h2>
              <p className="mb-4">
                収集した個人情報は、以下の目的で利用します。
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>会員管理</li>
                <li>会員証の発行</li>
                <li>お知らせ・ニュースレターの配信</li>
                <li>天パに関する情報提供</li>
                <li>統計データの作成（個人を特定できない形式）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">個人情報の保管</h2>
              <p>
                収集した個人情報は、適切なセキュリティ対策のもと、Firebase（Google Cloud Platform）を利用して安全に保管します。
                不正アクセス、紛失、破壊、改ざん、漏洩などを防ぐため、必要な措置を講じています。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">第三者への提供</h2>
              <p>
                当協会は、法令に基づく場合を除き、会員の個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">個人情報の開示・訂正・削除</h2>
              <p>
                会員ご本人からの個人情報の開示、訂正、削除のご要望につきましては、
                下記のお問い合わせ先までご連絡ください。適切に対応させていただきます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">お問い合わせ先</h2>
              <p>
                プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。
              </p>
              <p className="mt-4 font-medium">
                日本天パ協会<br />
                Email: privacy@tenpa.org
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600 mt-8">
                最終更新日: 2025年10月4日
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
