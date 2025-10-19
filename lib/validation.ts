import { z } from 'zod';

/**
 * メールアドレス登録フォーム用バリデーションスキーマ
 */
export const EmailFormSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
    .trim(),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'プライバシーポリシーに同意する必要があります',
    }),
});

/**
 * パスワード設定フォーム用バリデーションスキーマ
 */
export const PasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, 'パスワードは8文字以上である必要があります'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

/**
 * 会員情報登録フォーム用バリデーションスキーマ（メール認証後）
 */
export const MemberFormSchema = z.object({
  name: z.string().trim().optional(),
  age: z
    .number()
    .int()
    .min(13)
    .max(120),
  gender: z.enum(['男性', '女性', 'その他']),
  hairType: z.enum(['直毛', 'くせ毛', 'その他']),
});

/**
 * ログインフォーム用バリデーションスキーマ
 */
export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
    .trim(),
  password: z.string().min(1, 'パスワードを入力してください'),
});

// 型推論用のエクスポート
export type EmailFormInput = z.infer<typeof EmailFormSchema>;
export type PasswordFormInput = z.infer<typeof PasswordFormSchema>;
export type MemberFormInput = z.infer<typeof MemberFormSchema>;
export type LoginFormInput = z.infer<typeof LoginFormSchema>;
