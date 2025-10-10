'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getMemberByUid } from '@/app/actions/get-member-by-uid';

export default function MemberCardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [hairType, setHairType] = useState('くせ毛');
  const [isLoaded, setIsLoaded] = useState(false);
  const issuedAt = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 認証チェックとFirestoreから会員情報を読み込む
  useEffect(() => {
    const loadMemberData = async () => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const memberData = await getMemberByUid(user.uid);
        if (memberData) {
          setMemberName(memberData.name || '会員');
          setMemberId(memberData.memberId);
          setHairType(memberData.hairType);
        } else {
          setMemberName('会員');
          setMemberId('JTA-000000');
        }
      } catch (error) {
        console.error('会員情報の取得に失敗しました:', error);
        setMemberName('会員');
        setMemberId('JTA-000000');
      } finally {
        setIsLoaded(true);
      }
    };

    loadMemberData();
  }, [user, loading, router]);

  // データ読み込み完了後にCanvasを初期描画
  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      generateMemberCard(canvasRef.current);
    }
  }, [isLoaded, memberName, memberId, hairType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImage(imageUrl);
        // 画像アップロード後、会員証を即座に再生成（新しい画像URLを直接渡す）
        const canvas = canvasRef.current;
        if (canvas) generateMemberCard(canvas, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMemberCard = (canvas: HTMLCanvasElement, customImageUrl?: string) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas設定（免許証サイズ: 幅85.6mm × 高さ53.98mm = 約 856px × 540px）
    canvas.width = 856;
    canvas.height = 540;

    // 背景（深紺）
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ロゴ画像を背景に配置（透かし）
    const logoImg = new Image();
    logoImg.src = '/images/jta-logo.png';
    logoImg.onload = () => {
      ctx.globalAlpha = 0.08;
      const logoSize = 300;
      ctx.drawImage(
        logoImg,
        canvas.width / 2 - logoSize / 2,
        canvas.height / 2 - logoSize / 2,
        logoSize,
        logoSize
      );
      ctx.globalAlpha = 1.0;

      // ロゴ読み込み後、残りの描画を実行
      drawCardContent(ctx, canvas, customImageUrl);
    };

    // ロゴ読み込みエラー時も描画を続ける
    logoImg.onerror = () => {
      drawCardContent(ctx, canvas, customImageUrl);
    };
  };

  const drawCardContent = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, customImageUrl?: string) => {

    // 金色のボーダー
    ctx.strokeStyle = '#CDA349';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // タイトル「会員証」
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('会員証', 50, 70);

    // 協会名
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText('日本天パ協会', 50, 110);

    // 顔写真枠
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(50, 150, 180, 220);
    ctx.strokeStyle = '#CDA349';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 150, 180, 220);

    // 画像を読み込んで描画（customImageUrlが渡されていればそれを使用、なければuploadedImageを使用）
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.src = customImageUrl || uploadedImage || '/images/default-tenpa-avatar.png';
    avatarImg.onload = () => {
      // 画像を枠内にフィット
      const imgAspect = avatarImg.width / avatarImg.height;
      const frameAspect = 180 / 220;
      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > frameAspect) {
        // 画像が横長
        drawHeight = 220;
        drawWidth = drawHeight * imgAspect;
        drawX = 50 - (drawWidth - 180) / 2;
        drawY = 150;
      } else {
        // 画像が縦長
        drawWidth = 180;
        drawHeight = drawWidth / imgAspect;
        drawX = 50;
        drawY = 150 - (drawHeight - 220) / 2;
      }

      // クリップ領域を設定
      ctx.save();
      ctx.beginPath();
      ctx.rect(50, 150, 180, 220);
      ctx.clip();
      ctx.drawImage(avatarImg, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // 枠を再描画
      ctx.strokeStyle = '#CDA349';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 150, 180, 220);

      // 画像読み込み後に会員情報を描画
      drawMemberInfo(ctx, canvas, memberName, memberId, hairType, issuedAt);
    };

    // 画像読み込みエラー時も会員情報を描画
    avatarImg.onerror = () => {
      drawMemberInfo(ctx, canvas, memberName, memberId, hairType, issuedAt);
    };
  };

  const drawMemberInfo = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    name: string,
    id: string,
    hair: string,
    issued: string
  ) => {
    // 会員情報
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    const infoX = 260;
    let infoY = 180;
    const lineHeight = 50;

    // 氏名
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('氏名', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(name || '（未登録）', infoX + 120, infoY);
    infoY += lineHeight;

    // 会員番号
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('会員番号', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(id, infoX + 120, infoY);
    infoY += lineHeight;

    // 発行日
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('発行日', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.fillText(issued, infoX + 120, infoY);
    infoY += lineHeight;

    // 髪質
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('髪質', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(hair, infoX + 120, infoY);
    infoY += lineHeight;

    // 有効期限
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('有効期限', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.fillText('すべての髪型が祝福される日まで', infoX + 120, infoY);

    // 下部注意書き
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      '※ この証明証は公的効力を有しません',
      canvas.width / 2,
      canvas.height - 30
    );
    ctx.textAlign = 'left';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    // PNG画像としてダウンロード
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `JTA-会員証-${memberId}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
      setIsGenerating(false);
    }, 'image/png');
  };

  const handleShareTwitter = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Canvasから画像を生成
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (!blob) {
        alert('画像の生成に失敗しました');
        return;
      }

      const siteUrl = window.location.origin;
      const text = `日本天パ協会の会員証を取得しました！\n会員番号: ${memberId}\n\n${siteUrl}\n\n#日本天パ協会 #天パ`;

      // Web Share API対応チェック（モバイル向け）
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `JTA-会員証-${memberId}.png`, { type: 'image/png' });
        const shareData = {
          text: text,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Web Share API非対応の場合はテキストのみでX（Twitter）を開く
      const url = encodeURIComponent(window.location.origin);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');

      // 画像を別途ダウンロード
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `JTA-会員証-${memberId}.png`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      alert('画像をダウンロードしました。Xの投稿画面で画像を添付してください。');
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleShareInstagram = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Canvasから画像を生成
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (!blob) {
        alert('画像の生成に失敗しました');
        return;
      }

      const siteUrl = window.location.origin;
      const text = `日本天パ協会の会員証を取得しました！\n会員番号: ${memberId}\n\n${siteUrl}\n\n#日本天パ協会 #天パ`;

      // Web Share API対応チェック（モバイル向け）
      if (navigator.share) {
        const file = new File([blob], `JTA-会員証-${memberId}.png`, { type: 'image/png' });
        const shareData = {
          text: text,
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Web Share API非対応の場合は画像をダウンロード
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `JTA-会員証-${memberId}.png`;
      link.click();
      URL.revokeObjectURL(url);

      alert('会員証をダウンロードしました。Instagramアプリから画像を選択して投稿してください。');
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // ローディング中
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-navy py-16 flex items-center justify-center">
        <div className="text-gold text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="card-official mb-8">
        <h1 className="text-4xl font-bold text-navy mb-4 text-center">
          会員証発行
        </h1>
        <p className="text-gray-600 text-center">
          あなたの会員証が発行されました。画像をダウンロードしてご利用ください。
        </p>
      </div>

      {/* 会員情報入力 */}
      <div className="card-official mb-8">
        <h2 className="text-xl font-bold text-navy mb-4">会員情報</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">
              氏名
            </label>
            <input
              type="text"
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="山田 太郎"
            />
          </div>
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1">
              会員番号
            </label>
            <input
              type="text"
              id="memberId"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="JTA-123456"
            />
          </div>
          <div>
            <label htmlFor="hairType" className="block text-sm font-medium text-gray-700 mb-1">
              髪質
            </label>
            <select
              id="hairType"
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="くせ毛">くせ毛</option>
              <option value="天然パーマ">天然パーマ</option>
              <option value="ストレート">ストレート</option>
              <option value="ウェーブ">ウェーブ</option>
            </select>
          </div>
        </div>
      </div>

      {/* 画像アップロード */}
      <div className="card-official mb-8">
        <h2 className="text-xl font-bold text-navy mb-4">
          会員証の写真をアップロード
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="member-photo-upload"
          />
          <label
            htmlFor="member-photo-upload"
            className="btn-primary cursor-pointer px-8 py-3"
          >
            写真を選択
          </label>
          <p className="text-sm text-gray-600">
            ※ 画像が選択されていない場合はデフォルトの画像が使用されます
          </p>
        </div>
      </div>

      {/* 会員証プレビュー */}
      <div className="card-official mb-8">
        <div className="flex justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="border-4 border-gold rounded-lg shadow-2xl w-full h-auto"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>

      {/* ダウンロードボタン */}
      <div className="text-center space-y-4">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'ダウンロード中...' : '会員証をダウンロード'}
        </button>
        <p className="text-sm text-gray-600">
          ※ PNG形式でダウンロードされます
        </p>

        {/* SNS共有ボタン */}
        <div className="pt-4">
          <p className="text-sm text-gray-700 mb-3">SNSで共有する</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShareTwitter}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xで共有
            </button>
            <button
              onClick={handleShareInstagram}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagramで共有
            </button>
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mt-12 card-official bg-blue-50 border border-blue-200">
        <h2 className="text-xl font-bold text-navy mb-4">会員証について</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• この会員証は日本天パ協会の正式な会員であることを証明します</li>
          <li>• 公的な身分証明書としての効力はありません</li>
          <li>• SNS等でのシェアは自由です</li>
          <li>• 会員証の再発行はいつでも可能です</li>
        </ul>
      </div>
    </div>
  );
}
