import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ | 日本天パ協会',
  description: '日本天パ協会へのお問い合わせ',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card-official">
          <h1 className="text-3xl font-semibold text-navy mb-8">お問い合わせ</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">メールでのお問い合わせ</h2>
              <p className="mb-4">
                日本天パ協会へのお問い合わせは、以下のメールアドレスまでご連絡ください。
              </p>
              <div className="bg-navy/5 p-6 rounded-lg border border-gray-200">
                <p className="text-lg font-medium text-navy">
                  Email: <a href="mailto:info@tenpa.org" className="text-gold hover:opacity-90 transition-opacity">info@tenpa.org</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">お問い合わせの前に</h2>
              <p className="mb-4">
                よくあるご質問については、以下をご確認ください。
              </p>
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
                    個人情報の取り扱いについては、<a href="/privacy" className="text-gold hover:opacity-90 transition-opacity">プライバシーポリシー</a>をご確認ください。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy mb-4">お問い合わせ内容</h2>
              <p className="mb-4">
                以下のような内容についてお問い合わせいただけます。
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>入会試験・会員登録に関するご質問</li>
                <li>会員証の発行・再発行について</li>
                <li>天パ天気予報に関するご質問</li>
                <li>個人情報の開示・訂正・削除のご依頼</li>
                <li>その他、当協会へのご意見・ご要望</li>
              </ul>
            </section>

            <section className="bg-gold/10 p-6 rounded-lg border border-gold/30">
              <h2 className="text-lg font-semibold text-navy mb-3">ご注意</h2>
              <ul className="space-y-2 text-sm">
                <li>• お問い合わせへの回答には数日かかる場合がございます。</li>
                <li>• 内容によっては回答できない場合もございますので、予めご了承ください。</li>
                <li>• 営業時間外（土日祝日）にいただいたお問い合わせは、翌営業日以降の対応となります。</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
