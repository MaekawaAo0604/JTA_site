'use client';

import { useRef, useState } from 'react';

// モック会員データ（実際はFirestoreから取得）
const mockMemberData = {
  name: '山田 太郎',
  memberId: 'JTA-123456',
  hairType: 'くせ毛',
  issuedAt: new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
};

export default function MemberCardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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
      drawMemberInfo(ctx, canvas);
    };

    // 画像読み込みエラー時も会員情報を描画
    avatarImg.onerror = () => {
      drawMemberInfo(ctx, canvas);
    };
  };

  const drawMemberInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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
    ctx.fillText(mockMemberData.name || '（未登録）', infoX + 120, infoY);
    infoY += lineHeight;

    // 会員番号
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('会員番号', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(mockMemberData.memberId, infoX + 120, infoY);
    infoY += lineHeight;

    // 発行日
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('発行日', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.fillText(mockMemberData.issuedAt, infoX + 120, infoY);
    infoY += lineHeight;

    // 髪質
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('髪質', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(mockMemberData.hairType, infoX + 120, infoY);
    infoY += lineHeight;

    // 有効期限
    ctx.fillStyle = '#CDA349';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('有効期限', infoX, infoY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.fillText('髪がなくなるその日まで', infoX + 120, infoY);

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
        link.download = `JTA-会員証-${mockMemberData.memberId}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
      setIsGenerating(false);
    }, 'image/png');
  };

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
        <div className="flex justify-center">
          <canvas
            ref={(el) => {
              if (el && canvasRef.current !== el) {
                canvasRef.current = el;
                generateMemberCard(el);
              }
            }}
            className="border-4 border-gold rounded-lg shadow-2xl max-w-full h-auto"
            style={{ maxWidth: '856px' }}
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
