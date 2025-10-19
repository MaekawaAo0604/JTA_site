import { Timestamp } from 'firebase/firestore';

/**
 * 会員データモデル
 */
export interface Member {
  id: string;
  uid: string; // Firebase Auth UID
  name: string | null;
  email: string;
  age: number;
  gender: '男性' | '女性' | 'その他';
  hairType: '直毛' | 'くせ毛' | 'その他';
  memberId: string;
  issuedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * メール確認トークンデータモデル
 */
export interface EmailVerificationToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
}

/**
 * メールアドレス登録フォームデータ
 */
export interface EmailFormData {
  email: string;
  agreeToPrivacy: boolean;
}

/**
 * パスワード設定フォームデータ
 */
export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * 会員情報登録フォームデータ
 */
export interface MemberFormData {
  name?: string;
  age: number;
  gender: '男性' | '女性' | 'その他';
  hairType: '直毛' | 'くせ毛' | 'その他';
}

/**
 * ログインフォームデータ
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 会員登録結果
 */
export interface RegisterMemberResult {
  success: boolean;
  memberId?: string;
  error?: string;
}

/**
 * お問い合わせデータモデル（クライアント側 - シリアライズ済み）
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string; // ISO 8601 文字列
  updatedAt: string; // ISO 8601 文字列
}

/**
 * お問い合わせフォームデータ
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * お問い合わせ送信結果
 */
export interface SubmitContactResult {
  success: boolean;
  error?: string;
}
