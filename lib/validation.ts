import { z } from 'zod';

export const MemberFormSchema = z.object({
  name: z.string().trim().optional(),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .trim(),
  age: z
    .number()
    .int()
    .min(13, '年齢は13歳から120歳の間で入力してください')
    .max(120, '年齢は13歳から120歳の間で入力してください'),
  gender: z.enum(['男性', '女性', 'その他'], {
    message: '性別を選択してください',
  }),
  hairType: z.enum(['直毛', 'くせ毛', 'その他'], {
    message: '髪質を選択してください',
  }),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'プライバシーポリシーに同意する必要があります',
    }),
});

export type MemberFormInput = z.infer<typeof MemberFormSchema>;
