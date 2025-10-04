# 日本天パ協会 (JTA) 公式サイト

日本天パ協会の公式Webサイト - 入会試験から会員証発行までの会員管理システム

## 機能概要

- 入会試験（3択×10問）→ 会員登録 → 会員証発行フロー
- 会員数表示、天パ予報マップ自動生成
- 免許証風会員証（Canvas生成PNG）
- Next.js + TypeScript + Firestore + TailwindCSS

## 技術スタック

- **フレームワーク**: Next.js 15.5.4 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: TailwindCSS 3.x
- **データベース**: Firebase Firestore
- **バリデーション**: Zod 3.x
- **フォーム管理**: React Hook Form 7.x

## ローカル開発手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Firebase Admin SDK (サーバーサイド)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (クライアントサイド)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### 4. ビルド確認

```bash
npm run build
```

## デプロイ手順（Vercel）

### 1. Vercel プロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Import Project" をクリック
3. GitHub リポジトリを選択

### 2. 環境変数の設定

Vercel Dashboard の "Settings" → "Environment Variables" で以下を設定：

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 3. デプロイ

```bash
git push origin main
```

Vercel が自動的にデプロイを開始します。

## プロジェクト構成

```
/app              # Next.js App Router
  /actions        # Server Actions
  /join           # 入会試験・登録フォーム
  /member-card    # 会員証発行
  /about          # 協会情報
  /forecast       # 天パ予報
  /articles       # 記事一覧
  /contact        # お問い合わせ
/components       # Reactコンポーネント
/lib              # ユーティリティ関数・Firebase設定
/public           # 静的ファイル
  /forecast       # 天パ予報マップ画像
/types            # TypeScript型定義
```

## パフォーマンス最適化

- **会員数表示**: 60秒間キャッシュ + Suspense による遅延ロード
- **画像最適化**: Next.js Image コンポーネント使用
- **CSS最適化**: experimental.optimizeCss 有効化

## セキュリティ

- Firestore セキュリティルールによるデータ保護
- 環境変数による認証情報管理
- Zod による入力バリデーション

## ライセンス

© 2025 日本天パ協会. All rights reserved.
