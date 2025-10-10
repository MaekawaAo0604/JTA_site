# Requirements Document

## Project Overview

日本天パ協会の公式 Web サイト - 真面目な公式団体の外観とネタ要素を組み合わせた会員管理システム。入会試験から会員登録、会員証発行までの一連の体験フローを提供します。

## Project Description (User Input)

### 0. 目的／トーン

- 見た目は真面目な公式団体、中身はネタ
- 体験フロー：入会試験 → 必須登録（メール等） → 会員証発行
- 会員数を公開し、協会っぽい"規模感"を演出
- マップ画像は毎朝自動生成（6 都市版）を表示

### 1. 情報設計（ページ＆機能）

#### 1.1 トップ /

- ヘッダー（エンブレム＋サイト名、ナビ）
- 標語：「クセは個性、個性は文化。」
- 会員数表示（Firestore の members 件数）
- 本日の天パ天気予報マップ（/public/forecast/latest.png）
- お知らせ（簡易カード 2–3 件）
- CTA：入会試験へ（/join）

#### 1.2 協会について /about

- ミッション文（真面目風）
- 組織体制（肩書きは真面目、説明文に小ネタ）
- 倫理規定（例：「寝癖差別禁止」「梅雨期の直毛優遇を認めない」）

#### 1.3 入会試験 /join

- 形式：3 択 × 10 問（前半 5 問は真面目、後半 5 問はネタ）
- すべて選択済みで「送信」有効化
- スコア表示はしない
- 合否は必ず合格
- 送信後：/join/result へ遷移

#### 1.4 結果 /join/result

- 合格メッセージ＋登録フォーム（必須）
- 登録項目：名前（任意）、メール（必須）、年齢（必須、13–120）、性別（必須）、髪質（必須）、同意（必須）
- Firestore members に INSERT
- 成功後、「会員証を発行する」ボタン表示 → /member-card

#### 1.5 会員証 /member-card

- Canvas で PNG ダウンロード
- デザイン：免許証風（深紺 × 金）
- 内容：協会エンブレム、氏名、会員番号（JCHA-6 桁）、発行日、髪質、有効期限「全ての髪型が祝福される日まで」
- 注意書き：「この証明証は公的効力を有しません」

#### 1.6 予報 /forecast

- 最新マップ画像（毎朝更新）
- アーカイブ（直近 7 日分）
- 用語解説（湿度 / 露点 / 爆発指数）

#### 1.7 記事 /articles

- ネタ記事の一覧＋詳細（静的 Markdown）

#### 1.8 お問い合わせ /contact

- フォーム（送信 → 画面で完了表示）

### 2. データモデル（Firestore）

```typescript
interface Member {
  name: string | null; // 任意
  email: string; // 必須（形式バリデーション）
  age: number; // 必須（13–120）
  gender: "男性" | "女性" | "その他";
  hairType: "直毛" | "くせ毛" | "その他";
  memberId: string; // 例: JCHA-123456
  issuedAt: Timestamp; // 生成時サーバ時刻
}
```

### 3. 技術スタック

- フロント：Next.js（App Router or Pages）、TypeScript、TailwindCSS
- ホスティング：Vercel
- DB：Firebase Firestore
- 自動更新：GitHub Actions で毎朝 7:30 JST

### 4. デザイン要件

- カラー：背景 #0F172A（深紺）、アクセント #CDA349（金）
- タイポ：Noto Sans JP 推奨
- コンポーネント：官公庁風（控えめなシャドウ、角丸小）

### 5. 受け入れ基準

- ✅ / に会員数と最新マップが表示される
- ✅ /join で 10 問すべてに答えると送信でき、スコア非表示のまま合格になる
- ✅ /join/result のフォームでメール・年齢・性別・髪質が未入力だと送信できない
- ✅ フォーム送信で Firestore に members ドキュメントが作成される
- ✅ 送信成功後、/member-card で免許証風 PNG が DL できる
- ✅ トップの会員数が増える
- ✅ /forecast で画像が表示される

## 要件

### 要件 1: トップページ表示機能

**ユーザーストーリー:** 訪問者として、協会の規模感と最新の天パ予報情報を一目で確認し、入会への関心を高めたい

#### 受け入れ基準

1. WHERE トップページ THE SYSTEM SHALL 協会エンブレムとサイト名を含むヘッダーを表示する
2. WHERE トップページ THE SYSTEM SHALL 標語「クセは個性、個性は文化。」を表示する
3. WHERE トップページ THE SYSTEM SHALL Firestore の members コレクション件数を会員数として表示する
4. WHERE トップページ THE SYSTEM SHALL 最新の天パ天気予報マップ画像（/public/forecast/latest.png）を表示する
5. WHERE トップページ THE SYSTEM SHALL お知らせを 2〜3 件のカード形式で表示する
6. WHERE トップページ THE SYSTEM SHALL 入会試験ページ（/join）への CTA ボタンを表示する
7. WHEN ユーザーが CTA ボタンをクリック THEN システムは/join ページへ遷移 SHALL する

### 要件 2: 協会情報表示機能

**ユーザーストーリー:** 訪問者として、協会の理念・組織体制・倫理規定を理解し、協会の信頼性を確認したい

#### 受け入れ基準

1. WHERE 協会についてページ（/about） THE SYSTEM SHALL 真面目な文体でミッション文を表示する
2. WHERE 協会についてページ THE SYSTEM SHALL 組織体制を表示する（肩書きは真面目、説明文に小ネタを含む）
3. WHERE 協会についてページ THE SYSTEM SHALL 倫理規定を表示する（例：「寝癖差別禁止」「梅雨期の直毛優遇を認めない」）

### 要件 3: 入会試験機能

**ユーザーストーリー:** 入会希望者として、3 択 ×10 問の試験を受け、合格して会員登録に進みたい

#### 受け入れ基準

1. WHERE 入会試験ページ（/join） THE SYSTEM SHALL 3 択形式の質問を 10 問表示する
2. WHERE 入会試験ページ THE SYSTEM SHALL 前半 5 問は真面目な質問、後半 5 問はネタ質問を表示する
3. IF ユーザーがすべての質問に回答していない THEN システムは送信ボタンを無効化 SHALL する
4. IF ユーザーがすべての質問に回答完了 THEN システムは送信ボタンを有効化 SHALL する
5. WHERE 入会試験ページ THE SYSTEM SHALL スコアを表示しない
6. WHEN ユーザーが送信ボタンをクリック THEN システムは必ず合格判定 SHALL する
7. WHEN 試験送信完了 THEN システムは/join/result ページへ遷移 SHALL する

### 要件 4: 会員登録機能

**ユーザーストーリー:** 試験合格者として、必須情報を入力して会員登録を完了し、会員証発行に進みたい

#### 受け入れ基準

1. WHERE 結果ページ（/join/result） THE SYSTEM SHALL 合格メッセージを表示する
2. WHERE 結果ページ THE SYSTEM SHALL 会員登録フォームを表示する
3. WHERE 登録フォーム THE SYSTEM SHALL 名前入力欄を任意項目として提供する
4. WHERE 登録フォーム THE SYSTEM SHALL メールアドレス入力欄を必須項目として提供する
5. WHERE 登録フォーム THE SYSTEM SHALL 年齢入力欄を必須項目として提供する（13〜120 の範囲）
6. WHERE 登録フォーム THE SYSTEM SHALL 性別選択欄を必須項目として提供する（男性/女性/その他）
7. WHERE 登録フォーム THE SYSTEM SHALL 髪質選択欄を必須項目として提供する（直毛/くせ毛/その他）
8. WHERE 登録フォーム THE SYSTEM SHALL プライバシーポリシー同意チェックボックスを必須項目として提供する
9. IF メールアドレスが RFC 準拠の形式でない THEN システムはメール欄下に赤字エラーメッセージを表示 SHALL する
10. IF 年齢が 13 未満または 120 超過 THEN システムは年齢欄下に赤字エラーメッセージを表示 SHALL する
11. IF 性別が未選択 THEN システムは性別欄下に赤字エラーメッセージを表示 SHALL する
12. IF 髪質が未選択 THEN システムは髪質欄下に赤字エラーメッセージを表示 SHALL する
13. IF プライバシーポリシー同意が未チェック THEN システムは送信ボタンを無効化 SHALL する
14. WHEN ユーザーが「登録する」ボタンをクリック THEN システムは Firestore の members コレクションに新規ドキュメントを作成 SHALL する
15. WHEN Firestore ドキュメント作成 THEN システムは以下のフィールドを保存 SHALL する：name（string|null）, email（string）, age（number）, gender（string）, hairType（string）, memberId（"JCHA-" + 6 桁ランダム数字）, issuedAt（Timestamp）
16. WHILE フォーム送信処理中 THE SYSTEM SHALL 送信ボタンにローディング表示を継続する
17. WHEN 登録成功 THEN システムはトースト通知で成功メッセージを表示 SHALL する
18. WHEN 登録成功 THEN システムは「会員証を発行する」ボタンを表示 SHALL する
19. WHEN 登録失敗 THEN システムはトースト通知でエラーメッセージを表示 SHALL する
20. WHEN ユーザーが「会員証を発行する」ボタンをクリック THEN システムは/member-card ページへ遷移 SHALL する

### 要件 5: 会員証発行機能

**ユーザーストーリー:** 登録完了者として、免許証風の会員証を PNG 画像としてダウンロードし、SNS 等で共有したい

#### 受け入れ基準

1. WHERE 会員証ページ（/member-card） THE SYSTEM SHALL Canvas を使用して免許証風デザインの画像を生成する
2. WHERE 会員証画像 THE SYSTEM SHALL 背景色に深紺（#0F172A）を使用する
3. WHERE 会員証画像 THE SYSTEM SHALL アクセント色に金（#CDA349）を使用する
4. WHERE 会員証画像の左上 THE SYSTEM SHALL 協会エンブレムをフルカラーで表示する
5. WHERE 会員証画像の右側 THE SYSTEM SHALL 氏名・会員番号・発行日・髪質を同列・同トーンで表示する
6. WHERE 会員証画像の顔写真枠 THE SYSTEM SHALL マスコット画像を表示する
7. WHERE 会員証画像の中央 THE SYSTEM SHALL 透かしエンブレムを淡い色で表示する
8. WHERE 会員証画像の下部 THE SYSTEM SHALL 注意書き「この証明証は公的効力を有しません」を表示する
9. WHERE 会員証画像の有効期限欄 THE SYSTEM SHALL 「全ての髪型が祝福される日まで」を表示する
10. WHEN 会員証ページロード THEN システムは登録済みの会員情報を取得 SHALL する
11. WHEN ユーザーがダウンロードボタンをクリック THEN システムは会員証 PNG 画像をダウンロード SHALL する

### 要件 6: 天パ予報表示機能

**ユーザーストーリー:** 訪問者として、最新の天パ予報マップと過去のアーカイブを確認し、天パの状態を把握したい

#### 受け入れ基準

1. WHERE 予報ページ（/forecast） THE SYSTEM SHALL 最新の天パ予報マップ画像を表示する
2. WHERE 予報ページ THE SYSTEM SHALL 直近 7 日分のアーカイブ画像リストを表示する
3. WHERE 予報ページ THE SYSTEM SHALL 用語解説（湿度・露点・爆発指数）を表示する
4. WHEN GitHub Actions が毎朝 7:30 JST に実行 THEN システムは新しい予報マップ画像を生成 SHALL する
5. WHEN 新しい予報マップ生成 THEN システムは/public/forecast/latest.png を上書き SHALL する

### 要件 7: 記事閲覧機能

**ユーザーストーリー:** 訪問者として、協会が発信するネタ記事を読み、天パに関する情報を楽しみたい

#### 受け入れ基準

1. WHERE 記事ページ（/articles） THE SYSTEM SHALL ネタ記事の一覧を表示する
2. WHEN ユーザーが記事タイトルをクリック THEN システムは記事詳細ページを表示 SHALL する
3. WHERE 記事詳細ページ THE SYSTEM SHALL 静的 Markdown 形式の記事コンテンツを表示する

### 要件 8: お問い合わせ機能

**ユーザーストーリー:** 訪問者として、協会に問い合わせ内容を送信し、確認メッセージを受け取りたい

#### 受け入れ基準

1. WHERE お問い合わせページ（/contact） THE SYSTEM SHALL お問い合わせフォームを表示する
2. WHEN ユーザーが送信ボタンをクリック THEN システムは画面上で送信完了メッセージを表示 SHALL する
3. WHERE お問い合わせページ THE SYSTEM SHALL メール送信機能は初期段階では実装しない（将来拡張）

### 要件 9: データ整合性とパフォーマンス

**ユーザーストーリー:** システム管理者として、会員データの整合性を保ち、リアルタイムで正確な会員数を表示したい

#### 受け入れ基準

1. WHEN 新規会員登録完了 THEN トップページの会員数表示は自動的に増加 SHALL する
2. WHERE Firestore THE SYSTEM SHALL members コレクションの件数をリアルタイムでカウントする
3. IF 会員数表示のパフォーマンスが問題 THEN システムは集計ドキュメントを別途用意して最適化 SHALL する

### 要件 10: セキュリティとプライバシー

**ユーザーストーリー:** 会員として、個人情報が適切に保護され、プライバシーポリシーに基づいて管理されることを期待する

#### 受け入れ基準

1. WHERE サイト全体 THE SYSTEM SHALL プライバシーポリシーページを提供する
2. WHERE 登録フォーム THE SYSTEM SHALL プライバシーポリシーへの同意を必須とする
3. WHERE Firestore THE SYSTEM SHALL 適切なセキュリティルールを設定する
4. WHERE Firestore セキュリティルール THE SYSTEM SHALL 会員数カウント用の read 権限を許可する
5. WHERE Firestore セキュリティルール THE SYSTEM SHALL 個人情報の一覧公開を防ぐ適切な制限を設ける

---

**STATUS**: 要件生成完了
**NEXT STEP**: `/kiro:spec-design jta-membership-system` を実行して技術設計を生成
