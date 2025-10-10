import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '協会について | 日本天パ協会',
  description: '日本天パ協会のミッション、組織体制、倫理規定について',
};

const leadership = [
  {
    title: '代表',
    name: '前川 蒼',
    description: '日本天パ協会の設立者。天パの個性を文化として認める活動を推進。',
  },
];

const ethics = [
  {
    title: '寝癖差別禁止',
    description:
      '寝起きの天パを「寝癖」と呼ぶことを禁止します。それは自然な形状です。',
  },
  {
    title: '梅雨期の直毛優遇を認めない',
    description:
      '梅雨時期に「髪が広がらなくていいね」と直毛の方を優遇する発言を禁止します。',
  },
  {
    title: 'ストレート至上主義の否定',
    description:
      'サラサラストレートが美の基準とする価値観を否定し、多様性を尊重します。',
  },
  {
    title: '無断での髪質判定禁止',
    description:
      '「これ天パ？」「パーマかけてるの？」など、許可なく髪質を詮索することを禁止します。',
  },
  {
    title: '縮毛矯正の強要禁止',
    description:
      '「ストレートにすれば？」など、髪質の変更を強要する発言を禁止します。',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Mission Section */}
      <section className="card-official mb-12">
        <h1 className="text-4xl font-bold text-navy mb-8 text-center">
          協会について
        </h1>

        <div className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">ミッション</h2>
            <p className="leading-relaxed">
              日本天パ協会は、天然パーマという個性を単なる髪質の違いではなく、
              文化的アイデンティティとして認識し、すべての天パの方々が自信と誇りを持てる社会の実現を目指します。
            </p>
            <p className="leading-relaxed mt-4">
              私たちは、長年にわたり「扱いにくい」「だらしない」といった
              不当な評価を受けてきた天パの歴史を変革し、
              その独自性と魅力を広く社会に発信します。
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">ビジョン</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>天パへの偏見と差別のない社会の実現</li>
              <li>天パ特有の悩みを共有し、解決策を提供するコミュニティの構築</li>
              <li>天パの美しさと多様性を称える文化の醸成</li>
              <li>気象条件と天パの関係性に関する科学的研究の推進</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">活動内容</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>天パ天気予報の毎日更新（湿度・露点・爆発指数）</li>
              <li>天パに関する正しい知識の啓発活動</li>
              <li>会員向け情報誌「うねり通信」の発行（月刊）</li>
              <li>全国天パサミットの開催（年1回）</li>
              <li>天パフレンドリー美容室認定制度の運営</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="card-official mb-12">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          組織体制
        </h2>
        <div className="flex justify-center">
          {leadership.map((member) => (
            <div
              key={member.title}
              className="p-6 border border-gray-200 rounded-lg hover:border-gold transition-colors max-w-md"
            >
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gold">
                  <Image
                    src="/images/maekawa-ao.jpg"
                    alt="前川 蒼"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gold mb-1">
                  {member.title}
                </h3>
                <p className="text-xl font-bold text-navy">{member.name}</p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ethics Section */}
      <section className="card-official">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          倫理規定
        </h2>
        <div className="space-y-6">
          {ethics.map((rule, index) => (
            <div
              key={index}
              className="p-6 border-l-4 border-gold bg-gray-50 rounded-r-lg"
            >
              <h3 className="text-xl font-bold text-navy mb-2">
                第{index + 1}条　{rule.title}
              </h3>
              <p className="text-gray-700">{rule.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            ※ 本倫理規定は、すべての会員および天パを持つ方々の尊厳を守るために制定されました。
          </p>
        </div>
      </section>
    </div>
  );
}
