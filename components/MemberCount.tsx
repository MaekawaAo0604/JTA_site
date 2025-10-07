import { getMemberCount } from '@/lib/actions/members';

export const revalidate = 0; // キャッシュを無効化（リアルタイム更新）

export default async function MemberCount() {
  const count = await getMemberCount();

  return (
    <div className="card-official text-center">
      <h2 className="text-2xl font-semibold text-navy mb-4">現在の会員数</h2>
      <p className="text-6xl font-bold text-gold mb-2">
        <span>{count.toLocaleString()}</span>
        <span className="text-3xl ml-2">名</span>
      </p>
      <p className="text-gray-600">の天パ会員が登録しています</p>
    </div>
  );
}
