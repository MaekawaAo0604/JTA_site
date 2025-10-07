'use server';

import { db } from '@/lib/firebase-admin';
import type { Contact } from '@/types/member';

/**
 * すべてのお問い合わせを取得する（管理者用）
 */
export async function getContacts(): Promise<Contact[]> {
  try {
    const contactsSnapshot = await db
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .get();

    const contacts: Contact[] = contactsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    return contacts;
  } catch (error) {
    console.error('お問い合わせの取得に失敗しました:', error);
    return [];
  }
}

/**
 * お問い合わせのステータスを更新する（管理者用）
 */
export async function updateContactStatus(
  contactId: string,
  status: 'unread' | 'read' | 'replied'
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.collection('contacts').doc(contactId).update({
      status,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('ステータスの更新に失敗しました:', error);
    return {
      success: false,
      error: 'ステータスの更新に失敗しました',
    };
  }
}
