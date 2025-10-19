# 実装タスク

## タスク概要

このドキュメントは、jta-membership-system 仕様の実装タスクを定義します。各タスクはコード生成プロンプトとして記述され、階層的な番号付けにより構造化されています。

## タスク階層

### フェーズ 1: プロジェクトセットアップ

#### 1. Next.js プロジェクト初期化

_Requirements: すべての要件の基盤_

**プロンプト:**

```
Next.js 15 App Routerプロジェクトを初期化してください。以下の要件を満たすこと：

- Next.js 15.x (App Router) + TypeScript 5.x
- TailwindCSS 3.x設定（カスタムカラー: 深紺#0F172A、金#CDA349）
- Noto Sans JP フォント統合
- ESLint + Prettier設定
- package.json に必要な依存関係を追加：
  - firebase (9.x)
  - zod (3.x)
  - react-hook-form (7.x)
  - canvas (ブラウザネイティブ - 型定義のみ)

ディレクトリ構成:
/app              # App Router
/components       # Reactコンポーネント
/lib              # ユーティリティ関数
/public/forecast  # 天パ予報マップ画像
/types            # TypeScript型定義
```

#### 1.1 TailwindCSS カスタム設定

_Requirements: 要件 4（デザイン要件）_

**プロンプト:**

```
tailwind.config.ts を以下の仕様で作成してください：

カスタムカラー:
- navy: '#0F172A' (深紺 - 背景)
- gold: '#CDA349' (金 - アクセント)

カスタムフォント:
- sans: ['Noto Sans JP', 'sans-serif']

カスタムコンポーネントクラス（官公庁風）:
- .card-official: 控えめなシャドウ、小さい角丸
- .btn-primary: 金背景、深紺テキスト
- .btn-secondary: 深紺背景、金テキスト

コンポーネント例:
- シャドウ: shadow-md
- 角丸: rounded-lg (8px以下)
```

#### 1.2 Firebase プロジェクト設定

_Requirements: 要件 4, 5, 6, 7, 12, 13（メール登録、認証、会員登録、ログイン、データ整合性、セキュリティ）_

**プロンプト:**

```
Firebase プロジェクトの設定ファイルを作成してください：

1. /lib/firebase.ts
   - Firebase Admin SDK初期化（サーバーサイド）
   - Firestore インスタンスエクスポート
   - Firebase Auth インスタンスエクスポート
   - 環境変数使用: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

2. /lib/firebase-client.ts
   - Firebase Client SDK初期化（クライアントサイド）
   - Firestore インスタンスエクスポート
   - Firebase Auth インスタンスエクスポート
   - 環境変数使用: NEXT_PUBLIC_FIREBASE_*

3. /lib/auth-context.tsx
   - Firebase Auth 状態管理用 Context Provider
   - useAuth カスタムフック提供
   - ログイン状態、ユーザー情報を管理

4. .env.local.example
   - 必要な環境変数リスト（実際の値は含めない）

注意:
- Server Components用とClient Components用を分離
- 環境変数は .gitignore に追加
- Firebase Authentication Email/Password プロバイダを有効化
```

---

### フェーズ 2: データモデルとバリデーション

#### 2. TypeScript 型定義

_Requirements: 要件 4（会員登録データモデル）_

**プロンプト:**

```
/types/member.ts を作成し、以下の型定義を実装してください：

interface Member {
  name: string | null;        // 任意
  email: string;              // 必須（RFC準拠）
  age: number;                // 必須（13–120）
  gender: "男性" | "女性" | "その他";
  hairType: "直毛" | "くせ毛" | "その他";
  memberId: string;           // 例: JCHA-123456
  issuedAt: Timestamp;        // Firebase Timestamp型
}

interface MemberFormData {
  name?: string;
  email: string;
  age: number;
  gender: "男性" | "女性" | "その他";
  hairType: "直毛" | "くせ毛" | "その他";
  agreeToPrivacy: boolean;
}

interface RegisterMemberResult {
  success: boolean;
  memberId?: string;
  error?: string;
}

すべてエクスポートすること。
```

#### 2.1 Zod バリデーションスキーマ

_Requirements: 要件 4, 5, 6（フォームバリデーション）_

**プロンプト:**

```
/lib/validation.ts を作成し、Zodスキーマを定義してください：

EmailFormSchema（メールアドレス登録用）:
- email: string with RFC準拠メールバリデーション
- agreeToPrivacy: boolean (must be true)

PasswordFormSchema（パスワード設定用）:
- password: string (min: 8文字)
- confirmPassword: string
- refine: password === confirmPassword

MemberFormSchema（会員情報登録用）:
- name: optional string (trimmed)
- age: number (min: 13, max: 120)
- gender: enum ["男性", "女性", "その他"]
- hairType: enum ["直毛", "くせ毛", "その他"]

LoginFormSchema（ログイン用）:
- email: string with RFC準拠メールバリデーション
- password: string (min: 1)

エラーメッセージは日本語で分かりやすく:
- email: "有効なメールアドレスを入力してください"
- age: "年齢は13歳から120歳の間で入力してください"
- password: "パスワードは8文字以上である必要があります"
- confirmPassword: "パスワードが一致しません"
- agreeToPrivacy: "プライバシーポリシーに同意する必要があります"

export const EmailFormSchema = z.object({...});
export const PasswordFormSchema = z.object({...});
export const MemberFormSchema = z.object({...});
export const LoginFormSchema = z.object({...});
export type EmailFormInput = z.infer<typeof EmailFormSchema>;
export type PasswordFormInput = z.infer<typeof PasswordFormSchema>;
export type MemberFormInput = z.infer<typeof MemberFormSchema>;
export type LoginFormInput = z.infer<typeof LoginFormSchema>;
```

---

### フェーズ 3: Server Actions 実装

#### 3. メール確認送信 Server Action

_Requirements: 要件 4（メールアドレス登録機能）_

**プロンプト:**

```
/app/actions/send-verification-email.ts を作成し、以下の Server Action を実装してください：

export async function sendVerificationEmail(formData: EmailFormData): Promise<{ success: boolean; error?: string }> {
  'use server';

  実装要件:
  1. Zodバリデーション（EmailFormSchemaで検証）
  2. メール重複チェック（Firebase Auth: fetchSignInMethodsForEmail）
  3. トークン生成（crypto.randomUUID()）
  4. Firestore emailVerificationTokens コレクションに保存:
     - email, token, expiresAt (24時間後), createdAt
  5. 確認メール送信（Firebase Auth のカスタムメールテンプレート使用）
     - 確認リンク: https://your-domain.com/auth/verify-email?token={token}
  6. エラーハンドリング:
     - バリデーションエラー → { success: false, error: "バリデーションエラー" }
     - メール重複 → { success: false, error: "このメールアドレスは既に登録されています" }
     - メール送信エラー → { success: false, error: "メール送信に失敗しました" }
  7. 成功時 → { success: true }

注意:
- 既存の未期限切れトークンがある場合は削除してから新規作成
- Firebase Admin SDK を使用してメール送信
```

#### 3.1 認証ユーザー作成 Server Action

_Requirements: 要件 5（メール確認・パスワード設定機能）_

**プロンプト:**

```
/app/actions/create-auth-user.ts を作成し、以下の Server Action を実装してください：

export async function createAuthUser(token: string, password: string): Promise<{ success: boolean; error?: string }> {
  'use server';

  実装要件:
  1. Firestore emailVerificationTokens からトークン取得
  2. トークン検証:
     - 存在チェック
     - 有効期限チェック（expiresAt > 現在時刻）
  3. Firebase Auth でユーザー作成:
     - createUserWithEmailAndPassword(email, password)
  4. トークン削除（Firestore emailVerificationTokens から削除）
  5. エラーハンドリング:
     - トークン無効 → { success: false, error: "確認リンクが無効または期限切れです" }
     - パスワード不正 → { success: false, error: "パスワードは8文字以上である必要があります" }
     - ユーザー作成エラー → { success: false, error: "アカウント作成に失敗しました" }
  6. 成功時 → { success: true }
```

#### 3.2 会員情報登録 Server Action

_Requirements: 要件 6（会員情報登録機能）_

**プロンプト:**

```
/app/actions/register-member.ts を作成し、以下の Server Action を実装してください：

export async function registerMember(uid: string, formData: MemberFormData): Promise<RegisterMemberResult> {
  'use server';

  実装要件:
  1. Zodバリデーション（MemberFormSchemaで検証）
  2. Firebase Auth から uid でユーザー情報取得（email）
  3. 会員番号生成（"JCHA-" + 6桁ランダム数字、ユニークチェック付き）
  4. Firestore members コレクションに保存:
     - uid, name, email, age, gender, hairType, memberId
     - issuedAt, createdAt, updatedAt: serverTimestamp()
  5. エラーハンドリング:
     - バリデーションエラー → { success: false, error: "バリデーションエラー" }
     - ユーザー情報取得失敗 → { success: false, error: "認証情報が見つかりません" }
     - Firestore エラー → { success: false, error: "登録に失敗しました" }
  6. 成功時 → { success: true, memberId: "JCHA-123456" }

会員番号生成ロジック:
- Math.random() で100000～999999の6桁数字
- Firestore クエリでユニークチェック（最大10回リトライ）
```

#### 3.1 会員数取得 Server Action

_Requirements: 要件 1, 9（トップページ会員数表示、データ整合性）_

**プロンプト:**

```
/app/actions/get-member-count.ts を作成してください：

export async function getMemberCount(): Promise<number> {
  'use server';

  実装要件:
  1. Firestore members コレクションの件数を取得
  2. フェーズ1（初期実装）: getCountFromServer() 使用
  3. エラーハンドリング: エラー時は 0 を返す

フェーズ2（パフォーマンス最適化 - コメントで記載）:
// 将来的には aggregates/memberCount ドキュメントを使用
// Cloud Functions で members 作成・削除時に更新
// const countDoc = await db.collection('aggregates').doc('memberCount').get();
// return countDoc.data()?.count ?? 0;
```

#### 3.3 会員情報取得 Server Action

_Requirements: 要件 8（会員証発行）_

**プロンプト:**

```
/app/actions/get-member.ts を作成してください：

export async function getMemberByUid(uid: string): Promise<Member | null> {
  'use server';

  実装要件:
  1. Firestore クエリ: where('uid', '==', uid)
  2. 見つかった場合、Member型として返す
  3. 見つからない場合、null を返す
  4. エラーハンドリング: エラー時は null を返す

注意:
- uid は Firebase Auth UID
- Timestamp は toDate() で Date型に変換
```

#### 3.4 ログイン Server Action

_Requirements: 要件 7（ログイン機能）_

**プロンプト:**

```
/app/actions/login.ts を作成してください：

export async function login(formData: LoginFormData): Promise<{ success: boolean; error?: string }> {
  'use server';

  実装要件:
  1. Zodバリデーション（LoginFormSchemaで検証）
  2. Firebase Auth で認証:
     - signInWithEmailAndPassword(email, password)
  3. エラーハンドリング:
     - バリデーションエラー → { success: false, error: "バリデーションエラー" }
     - 認証失敗 → { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
  4. 成功時 → { success: true }

注意:
- クライアント側で Firebase Auth 状態を管理
- Server Action はバリデーションのみ実施
- 実際のログインはクライアント側で Firebase Auth SDK 使用
```

---

### フェーズ 4: 共通コンポーネント

#### 4. レイアウトとヘッダー

_Requirements: 要件 1（ヘッダー、エンブレム、ナビ）_

**プロンプト:**

```
以下のファイルを作成してください：

1. /app/layout.tsx (Root Layout)
   - HTML lang="ja"
   - Noto Sans JP フォント読み込み
   - TailwindCSS グローバルスタイル
   - <Header /> コンポーネント配置
   - 背景色: bg-navy

2. /components/Header.tsx (Server Component)
   - エンブレム画像 (placeholder: /images/emblem.png)
   - サイト名: "日本天パ協会"
   - ナビゲーション:
     - ホーム (/)
     - 協会について (/about)
     - 入会試験 (/join)
     - 天パ予報 (/forecast)
     - 記事 (/articles)
     - お問い合わせ (/contact)
   - スタイル: 深紺背景、金アクセント、官公庁風デザイン
```

#### 4.1 フッター

_Requirements: 要件 10（プライバシーポリシー）_

**プロンプト:**

```
/components/Footer.tsx (Server Component) を作成してください：

実装要件:
- 著作権表示: "© 2025 日本天パ協会. All rights reserved."
- リンク:
  - プライバシーポリシー (/privacy)
  - お問い合わせ (/contact)
- スタイル: 深紺背景、金テキスト、中央揃え

/app/layout.tsx に <Footer /> を追加すること。
```

#### 4.2 Loading と Error コンポーネント

_Requirements: すべての要件（UX 向上）_

**プロンプト:**

```
以下のファイルを作成してください：

1. /app/loading.tsx
   - シンプルなローディングスピナー
   - 中央配置、深紺背景、金色スピナー

2. /app/error.tsx (Client Component)
   - エラーメッセージ表示
   - リロードボタン
   - スタイル: 官公庁風、落ち着いたエラー表示

3. /app/not-found.tsx
   - 404 ページ
   - "ページが見つかりません" メッセージ
   - ホームへ戻るリンク
```

---

### フェーズ 5: ページ実装 - 静的ページ

#### 5. トップページ

_Requirements: 要件 1（トップページ表示機能）_

**プロンプト:**

```
/app/page.tsx (Server Component) を作成してください：

実装要件:
1. 標語: "クセは個性、個性は文化。" (大きく目立つ配置)
2. 会員数表示:
   - getMemberCount() を await で取得
   - "現在の会員数: X 名" と表示
3. 天パ予報マップ:
   - <Image src="/forecast/latest.png" alt="本日の天パ天気予報" />
   - Next.js Image コンポーネント使用
4. お知らせセクション:
   - カード形式で2〜3件表示（placeholder データでOK）
   - タイトル、日付、概要
5. CTA ボタン:
   - "入会試験を受ける" ボタン
   - リンク: /join
   - スタイル: btn-primary クラス使用

レイアウト:
- グリッド配置、レスポンシブ対応
- 官公庁風デザイン（card-official クラス使用）
```

#### 5.1 協会についてページ

_Requirements: 要件 2（協会情報表示機能）_

**プロンプト:**

```
/app/about/page.tsx (Server Component) を作成してください：

実装要件:
1. ミッション文:
   - 見出し: "私たちのミッション"
   - 真面目な文体で協会の理念を記述（placeholder テキスト）

2. 組織体制:
   - 見出し: "組織体制"
   - 役職リスト（真面目な肩書き、説明文に小ネタ）:
     - 会長: "天パ文化の発展に尽力"
     - 副会長: "梅雨期のメンタルサポート担当"
     - 理事: "直毛との共生研究"

3. 倫理規定:
   - 見出し: "倫理規定"
   - リスト形式:
     - 第1条: 寝癖差別を禁止する
     - 第2条: 梅雨期の直毛優遇を認めない
     - 第3条: ストレートパーマの強要を許さない

スタイル:
- 官公庁風レイアウト
- セクションごとにcard-official クラス
```

#### 5.2 天パ予報ページ

_Requirements: 要件 6（天パ予報表示機能）_

**プロンプト:**

```
/app/forecast/page.tsx (Server Component) を作成してください：

実装要件:
1. 最新マップ表示:
   - <Image src="/forecast/latest.png" alt="最新の天パ予報" />
   - 大きく目立つ配置

2. アーカイブセクション:
   - 見出し: "過去7日間のアーカイブ"
   - /public/forecast/ 内のファイル一覧を取得（fs.readdirSync）
   - 日付順にソート、最新7件表示
   - サムネイル形式で配置

3. 用語解説セクション:
   - 見出し: "用語解説"
   - リスト:
     - 湿度: "空気中の水分量の割合"
     - 露点: "水蒸気が凝結し始める温度"
     - 爆発指数: "天パが広がる危険度を5段階で表示"

スタイル:
- グリッド配置
- 官公庁風デザイン
```

#### 5.3 記事ページ

_Requirements: 要件 7（記事閲覧機能）_

**プロンプト:**

```
以下のファイルを作成してください：

1. /app/articles/page.tsx (Server Component)
   - 見出し: "協会からのお知らせ"
   - 記事一覧をカード形式で表示
   - 各カード: タイトル、日付、概要
   - クリック → /articles/[slug]

2. /app/articles/[slug]/page.tsx (Server Component)
   - dynamic route で記事詳細表示
   - Markdown ファイル読み込み: /content/articles/[slug].md
   - remark, remark-html 使用してHTMLに変換
   - スタイル: 読みやすいタイポグラフィ

3. /content/articles/example.md (placeholder)
   - サンプル記事（ネタ内容）
   - frontmatter: title, date, excerpt

package.json に追加:
- remark
- remark-html
- gray-matter
```

#### 5.4 プライバシーポリシーページ

_Requirements: 要件 10（セキュリティとプライバシー）_

**プロンプト:**

```
/app/privacy/page.tsx (Server Component) を作成してください：

実装要件:
- 見出し: "プライバシーポリシー"
- 内容（placeholder テキスト）:
  - 個人情報の取り扱いについて
  - 収集する情報: 名前、メールアドレス、年齢、性別、髪質
  - 利用目的: 会員管理、統計分析
  - 第三者提供: しない
  - お問い合わせ先

スタイル:
- 官公庁風レイアウト
- セクションごとに明確な見出し
```

---

### フェーズ 6: ページ実装 - インタラクティブページ

#### 6. 入会試験ページ

_Requirements: 要件 3（入会試験機能）_

**プロンプト:**

```
/app/join/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ
2. 質問データ（10問）:
   - 前半5問: 真面目な質問（例: "天パの悩みは？"）
   - 後半5問: ネタ質問（例: "梅雨の日の気分は？"）
   - 各質問: id, question, options: [A, B, C]

3. 状態管理:
   - useState<Record<number, string>> で回答管理
   - すべて回答済みかチェック

4. UI:
   - 各質問をカード表示
   - 3択ラジオボタン
   - 送信ボタン:
     - 全回答済みで有効化
     - 未回答時は無効化＋グレーアウト

5. 送信処理:
   - スコア計算なし（常に合格）
   - useRouter で /join/result へ遷移

スタイル:
- 官公庁風デザイン
- 質問カード: card-official クラス
- 送信ボタン: btn-primary クラス
```

#### 6.1 試験結果・メール登録ページ

_Requirements: 要件 4（メールアドレス登録機能）_

**プロンプト:**

```
/app/join/result/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. 合格メッセージ表示:
   - "おめでとうございます！合格です。"
   - "会員登録を開始するには、メールアドレスを入力してください。"

3. React Hook Form + Zod 統合:
   - useForm<EmailFormInput>
   - resolver: zodResolver(EmailFormSchema)

4. フォームフィールド:
   - メールアドレス (required, email)
   - プライバシーポリシー同意 (required, checkbox)

5. エラー表示:
   - 各フィールド下に赤字でエラーメッセージ
   - formState.errors を使用

6. 送信処理:
   - ローディング状態管理（useState）
   - sendVerificationEmail Server Action 呼び出し
   - 成功時:
     - トースト通知（react-hot-toast）: "確認メールを送信しました。メールをご確認ください。"
     - 成功メッセージ表示（state管理）
   - 失敗時:
     - トースト通知でエラーメッセージ

package.json に追加:
- react-hot-toast
- @hookform/resolvers

スタイル:
- 官公庁風フォーム
- 送信ボタン: ローディング時はスピナー表示
```

#### 6.2 メール確認・パスワード設定ページ

_Requirements: 要件 5（メール確認・パスワード設定機能）_

**プロンプト:**

```
/app/auth/verify-email/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. トークン取得:
   - useSearchParams() でクエリパラメータ token 取得
   - token がない場合、エラーメッセージ表示＋/join へのリンク

3. トークン検証:
   - useEffect でマウント時に Server Action でトークン検証
   - 無効・期限切れの場合、エラーメッセージ表示＋/join へのリンク
   - 有効な場合、パスワード設定フォーム表示

4. React Hook Form + Zod 統合:
   - useForm<PasswordFormInput>
   - resolver: zodResolver(PasswordFormSchema)

5. フォームフィールド:
   - パスワード (required, password, 8文字以上)
   - パスワード確認 (required, password)

6. エラー表示:
   - 各フィールド下に赤字でエラーメッセージ

7. 送信処理:
   - ローディング状態管理（useState）
   - createAuthUser Server Action 呼び出し
   - 成功時:
     - トースト通知: "アカウントが作成されました"
     - /auth/complete へ遷移
   - 失敗時:
     - トースト通知でエラーメッセージ

スタイル:
- 官公庁風フォーム
- 送信ボタン: ローディング時はスピナー表示
```

#### 6.3 会員情報登録ページ

_Requirements: 要件 6（会員情報登録機能）_

**プロンプト:**

```
/app/auth/complete/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. 認証状態確認:
   - useAuth() でログイン状態取得
   - 未ログインの場合、/login へリダイレクト

3. React Hook Form + Zod 統合:
   - useForm<MemberFormInput>
   - resolver: zodResolver(MemberFormSchema)

4. フォームフィールド:
   - 名前 (optional, text)
   - 年齢 (required, number, 13-120)
   - 性別 (required, radio: 男性/女性/その他)
   - 髪質 (required, radio: 直毛/くせ毛/その他)

5. エラー表示:
   - 各フィールド下に赤字でエラーメッセージ

6. 送信処理:
   - ローディング状態管理（useState）
   - registerMember Server Action 呼び出し（uid を渡す）
   - 成功時:
     - トースト通知: "会員登録が完了しました"
     - 「会員証を発行する」ボタン表示（state管理）
     - クリック → /member-card
   - 失敗時:
     - トースト通知でエラーメッセージ

スタイル:
- 官公庁風フォーム
- 送信ボタン: ローディング時はスピナー表示
```

#### 6.4 ログインページ

_Requirements: 要件 7（ログイン機能）_

**プロンプト:**

```
/app/login/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. React Hook Form + Zod 統合:
   - useForm<LoginFormInput>
   - resolver: zodResolver(LoginFormSchema)

3. フォームフィールド:
   - メールアドレス (required, email)
   - パスワード (required, password)

4. エラー表示:
   - 各フィールド下に赤字でエラーメッセージ

5. 送信処理:
   - ローディング状態管理（useState）
   - Firebase Auth signInWithEmailAndPassword 使用
   - 成功時:
     - トースト通知: "ログインしました"
     - /member-card へリダイレクト
   - 失敗時:
     - トースト通知でエラーメッセージ

スタイル:
- 官公庁風フォーム
- 送信ボタン: ローディング時はスピナー表示
```

#### 6.5 会員証発行ページ

_Requirements: 要件 8（会員証発行機能）_

**プロンプト:**

```
/app/member-card/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. 認証状態確認:
   - useAuth() でログイン状態取得
   - 未ログインの場合、/login へリダイレクト

3. 会員情報取得:
   - useEffect で getMemberByUid(uid) 呼び出し
   - useState<Member | null> で状態管理
   - ローディング状態管理

4. Canvas 生成処理:
   - useRef<HTMLCanvasElement> でCanvas参照
   - useEffect で会員情報取得後にCanvas描画
   - 描画内容:
     - サイズ: 800x500px
     - 背景: 深紺 (#0F172A)
     - 左上: エンブレム画像（placeholder）
     - 右側テキスト（金色 #CDA349）:
       - 氏名: {member.name || "未設定"}
       - 会員番号: {member.memberId}
       - 発行日: {formatDate(member.issuedAt)}
       - 髪質: {member.hairType}
     - 中央: 透かしエンブレム（薄い色）
     - 下部テキスト（小さく）:
       - "有効期限: 全ての髪型が祝福される日まで"
       - "この証明証は公的効力を有しません"

5. ダウンロード機能:
   - ボタン: "会員証をダウンロード"
   - クリック → canvas.toDataURL('image/png')
   - <a download="会員証.png" href={dataURL}> で自動ダウンロード

スタイル:
- Canvas表示エリア中央配置
- ダウンロードボタン: btn-primary クラス
```

#### 6.6 お問い合わせページ

_Requirements: 要件 11（お問い合わせ機能）_

**プロンプト:**

```
/app/contact/page.tsx (Client Component) を作成してください：

実装要件:
1. 'use client' ディレクティブ

2. フォームフィールド:
   - 名前 (required, text)
   - メールアドレス (required, email)
   - 件名 (required, text)
   - お問い合わせ内容 (required, textarea)

3. バリデーション:
   - React Hook Form使用
   - 各フィールド必須チェック
   - メール形式チェック

4. 送信処理:
   - ローディング状態管理
   - 送信時: console.log でフォームデータ出力（実際の送信はなし）
   - 1秒後に成功メッセージ表示
   - 成功時:
     - トースト通知: "お問い合わせを受け付けました"
     - フォームリセット
     - 画面上に成功メッセージ表示

5. 注意書き:
   - "現在、お問い合わせ機能は開発中です。" を表示

スタイル:
- 官公庁風フォーム
- 送信ボタン: btn-primary クラス
```

---

### フェーズ 7: GitHub Actions ワークフロー

#### 7. 天パ予報マップ生成スクリプト

_Requirements: 要件 6（天パ予報表示機能 - 自動生成）_

**プロンプト:**

```
以下のファイルを作成してください：

1. /scripts/generate-forecast-map.ts
   - Node.js スクリプト（tsx で実行）
   - Open-Meteo API から6都市の天気データ取得:
     - 東京、大阪、札幌、福岡、名古屋、仙台
   - 各都市のデータ:
     - 湿度 (humidity)
     - 露点 (dewpoint)
     - 爆発指数 (計算式: humidity * 0.7 + dewpoint * 0.3)
   - canvas (node-canvas) で画像生成:
     - サイズ: 1200x800px
     - 背景: 深紺
     - 各都市を地図上にマッピング
     - 爆発指数を5段階で色分け表示（緑→黄→橙→赤→紫）
   - 生成画像を保存:
     - /public/forecast/latest.png （上書き）
     - /public/forecast/{YYYY-MM-DD}.png （アーカイブ）

2. package.json に追加:
   - canvas (node-canvas)
   - node-fetch
   - tsx

3. .env.local.example に追加:
   - OPEN_METEO_API_URL (https://api.open-meteo.com/v1/forecast)
```

#### 7.1 GitHub Actions ワークフロー

_Requirements: 要件 9（天パ予報表示機能 - cron 自動実行）_

**プロンプト:**

```
/.github/workflows/generate-forecast.yml を作成してください：

実装要件:
1. トリガー:
   - schedule: cron '30 22 * * *' (UTC 22:30 = JST 7:30)
   - workflow_dispatch (手動実行可能)

2. ジョブ:
   - runs-on: ubuntu-latest
   - steps:
     1. actions/checkout@v4
     2. actions/setup-node@v4 (Node.js 20.x)
     3. npm install
     4. tsx scripts/generate-forecast-map.ts 実行
     5. git add public/forecast/*.png
     6. git commit -m "Update forecast map [automated]"
     7. git push

3. 環境変数:
   - OPEN_METEO_API_URL (secrets から取得)

注意:
- GitHub Actions にはコミット権限が必要
- GITHUB_TOKEN を使用
```

---

### フェーズ 8: Firestore セキュリティルール

#### 8. セキュリティルール実装

_Requirements: 要件 13（セキュリティとプライバシー）_

**プロンプト:**

```
/firestore.rules ファイルを作成してください：

実装要件:
1. members コレクション:
   - read: 全ユーザー許可（会員数カウント用）
   - create: 認証済みユーザーのみ、以下の条件を満たす場合のみ許可:
     - request.auth.uid == request.resource.data.uid
     - age >= 13 && age <= 120
     - email が RFC準拠メール形式
     - gender が ["男性", "女性", "その他"] のいずれか
     - hairType が ["直毛", "くせ毛", "その他"] のいずれか
     - memberId が "JCHA-" で始まる
   - update: 自分のドキュメントのみ許可
   - delete: 不許可

2. emailVerificationTokens コレクション:
   - read: 全ユーザー許可（トークン検証用）
   - create: 不許可（Server Actions のみ）
   - update, delete: 不許可（Server Actions のみ）

3. aggregates コレクション（将来拡張用）:
   - read: 全ユーザー許可
   - write: 不許可（Cloud Functions のみ）

ルール例:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{docId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.uid
                    && request.resource.data.age >= 13
                    && request.resource.data.age <= 120
                    && request.resource.data.email.matches('^[^@]+@[^@]+\\.[^@]+$')
                    && request.resource.data.gender in ['男性', '女性', 'その他']
                    && request.resource.data.hairType in ['直毛', 'くせ毛', 'その他']
                    && request.resource.data.memberId.matches('^JCHA-[0-9]{6}$');
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.uid;
      allow delete: if false;
    }

    match /emailVerificationTokens/{tokenId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

### フェーズ 9: テスト実装

#### 9. ユニットテスト

_Requirements: すべての要件（品質保証）_

**プロンプト:**

```
以下のテストファイルを作成してください：

1. /lib/__tests__/validation.test.ts
   - MemberFormSchema のバリデーションテスト
   - 正常系: すべてのフィールドが正しい場合
   - 異常系:
     - email 形式エラー
     - age 範囲外（12, 121）
     - agreeToPrivacy が false
   - Jest使用

2. /app/actions/__tests__/register-member.test.ts
   - registerMember Server Action のテスト
   - モック: Firestore SDK
   - 正常系: 新規会員登録成功
   - 異常系:
     - メール重複エラー
     - バリデーションエラー
   - Jest + @testing-library/react 使用

3. /components/__tests__/Header.test.tsx
   - Header コンポーネントのレンダリングテスト
   - ナビゲーションリンク存在確認
   - Jest + @testing-library/react 使用

package.json に追加:
- jest
- @testing-library/react
- @testing-library/jest-dom
```

#### 9.1 E2E テスト

_Requirements: 要件 3, 4, 5, 6, 7, 8（入会試験、メール登録、認証、会員登録、ログイン、会員証発行フロー）_

**プロンプト:**

```
以下の Playwright E2Eテストを作成してください：

1. /e2e/join-flow.spec.ts
   - テストシナリオ:
     1. / にアクセス
     2. "入会試験を受ける" ボタンをクリック
     3. /join で10問すべてに回答
     4. 送信ボタンをクリック
     5. /join/result で合格メッセージ確認
     6. メールアドレス入力フォーム入力
     7. 送信ボタンをクリック
     8. 成功メッセージ確認
     9. テスト用: Firestore から直接トークン取得
     10. /auth/verify-email?token=xxx にアクセス
     11. パスワード設定フォーム入力
     12. 送信ボタンをクリック
     13. /auth/complete で会員情報入力フォーム表示確認
     14. 会員情報入力（すべて正常値）
     15. 送信ボタンをクリック
     16. 「会員証を発行する」ボタンが表示されることを確認
     17. ボタンクリック
     18. /member-card で会員証表示確認
     19. Canvas要素が存在することを確認

2. /e2e/login-flow.spec.ts
   - テストシナリオ:
     1. 既存アカウントでログイン
     2. /member-card にアクセス
     3. 会員証表示確認

package.json に追加:
- @playwright/test

playwright.config.ts を作成:
- baseURL: 'http://localhost:3000'
- testDir: './e2e'
- use.storageState でログイン状態保持
```

---

### フェーズ 10: 最適化とデプロイ準備

#### 10. パフォーマンス最適化

_Requirements: 要件 12（パフォーマンス）_

**プロンプト:**

```
以下の最適化を実装してください：

1. /app/page.tsx
   - 会員数表示を Suspense でラップ
   - <Suspense fallback={<MemberCountSkeleton />}>
   - getMemberCount() を遅延読み込み

2. /components/MemberCount.tsx (Server Component)
   - 会員数取得と表示を分離
   - キャッシュ: { next: { revalidate: 60 } } （60秒）

3. /app/forecast/page.tsx
   - アーカイブ画像を Suspense でラップ
   - <Suspense fallback={<ArchiveSkeleton />}>

4. Next.js 設定最適化 (next.config.js):
   - images.domains: ['firebasestorage.googleapis.com']
   - experimental.optimizeCss: true
```

#### 10.1 Vercel デプロイ設定

_Requirements: すべての要件（本番環境デプロイ）_

**プロンプト:**

```
以下のファイルを作成してください：

1. /vercel.json
   - build コマンド: next build
   - output: .next
   - 環境変数リスト（実際の値は Vercel Dashboard で設定）:
     - FIREBASE_PROJECT_ID
     - FIREBASE_CLIENT_EMAIL
     - FIREBASE_PRIVATE_KEY
     - NEXT_PUBLIC_FIREBASE_*

2. README.md に追加:
   - デプロイ手順:
     1. Vercel プロジェクト作成
     2. 環境変数設定
     3. git push でデプロイ
   - 環境変数一覧
   - ローカル開発手順:
     1. npm install
     2. .env.local 作成
     3. npm run dev
```

---

## タスク完了基準

各タスクは以下の基準を満たした時点で完了とします：

1. **コード品質:**

   - TypeScript エラーなし（npm run type-check）
   - ESLint エラーなし（npm run lint）
   - すべてのテストが通過（npm test）

2. **機能要件:**

   - 対応する EARS 要件がすべて満たされている
   - E2E テストで主要フローが検証されている

3. **ドキュメント:**

   - コードにコメント（複雑なロジックのみ）
   - README.md にセットアップ手順記載

4. **セキュリティ:**
   - Firestore セキュリティルールが設定されている
   - 環境変数が .env.local.example に記載されている
   - 実際の認証情報が Git にコミットされていない

---

**STATUS**: タスク生成完了
**NEXT STEP**: 実装開始 - フェーズ 1 から順次実装を進めてください
**READY FOR IMPLEMENTATION**: 設計承認後、本タスクリストに基づいて実装可能
