import { getMemberCount } from '@/lib/actions/members';

export const revalidate = 60; // 60秒間キャッシュ

export default async function MemberCount() {
  const count = await getMemberCount();

  return (
    <div className="card-official text-center">
      <h2 className="text-2xl font-bold text-navy mb-4">現在の会員数</h2>
      <div className="text-6xl font-bold text-gold mb-2">{count.toLocaleString()}</div>
      <p className="text-gray-600">名の天パ会員が登録しています</p>
    </div>
  );
}
