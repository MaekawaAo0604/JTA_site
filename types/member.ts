import { Timestamp } from 'firebase/firestore';

/**
 * 会員データモデル
 */
export interface Member {
  id: string;
  name: string | null;
  email: string;
  age: number;
  gender: '男性' | '女性' | 'その他';
  hairType: '直毛' | 'くせ毛' | 'その他';
  memberId: string;
  issuedAt: Timestamp;
}

/**
 * 会員登録フォームデータ
 */
export interface MemberFormData {
  name?: string;
  email: string;
  age: number;
  gender: '男性' | '女性' | 'その他';
  hairType: '直毛' | 'くせ毛' | 'その他';
  agreeToPrivacy: boolean;
}

/**
 * 会員登録結果
 */
export interface RegisterMemberResult {
  success: boolean;
  memberId?: string;
  initialPassword?: string;
  error?: string;
}

/**
 * お問い合わせデータモデル（サーバー側）
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt: Timestamp | { seconds: number; nanoseconds: number };
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
