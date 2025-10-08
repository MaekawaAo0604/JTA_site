'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getContacts, updateContactStatus } from '@/app/actions/get-contacts';
import { checkAdminAccess } from '@/app/actions/check-admin';
import type { Contact } from '@/types/member';

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const { isAdmin } = await checkAdminAccess();
      if (!isAdmin) {
        router.push('/login?redirect=/admin/contacts');
        return;
      }
      await loadContacts();
    } catch (error) {
      console.error('認証チェックに失敗しました:', error);
      router.push('/login?redirect=/admin/contacts');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('お問い合わせの読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: 'unread' | 'read' | 'replied') => {
    const result = await updateContactStatus(contactId, newStatus);
    if (result.success) {
      // ローカルステートを更新
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        )
      );
    } else {
      alert(result.error || 'ステータスの更新に失敗しました');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    filter === 'all' ? true : contact.status === filter
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return '未読';
      case 'read':
        return '既読';
      case 'replied':
        return '返信済み';
      default:
        return status;
    }
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-navy py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="card-official text-center">
            <p className="text-gray-600">
              {isCheckingAuth ? '認証確認中...' : '読み込み中...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="card-official">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-navy">お問い合わせ管理</h1>
            <button
              onClick={loadContacts}
              className="btn-primary px-4 py-2 text-sm"
            >
              🔄 更新
            </button>
          </div>

          {/* フィルター */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'all'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-navy'
              }`}
            >
              すべて ({contacts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'unread'
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
              }`}
            >
              未読 ({contacts.filter((c) => c.status === 'unread').length})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'read'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              既読 ({contacts.filter((c) => c.status === 'read').length})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'replied'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
              }`}
            >
              返信済み ({contacts.filter((c) => c.status === 'replied').length})
            </button>
          </div>

          {/* お問い合わせ一覧 */}
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              お問い合わせがありません
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gold transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                            contact.status
                          )}`}
                        >
                          {getStatusLabel(contact.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-navy mb-1">
                        {contact.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {contact.name} ({contact.email})
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(contact.id, 'unread')}
                      disabled={contact.status === 'unread'}
                      className="px-3 py-1 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      未読にする
                    </button>
                    <button
                      onClick={() => handleStatusChange(contact.id, 'read')}
                      disabled={contact.status === 'read'}
                      className="px-3 py-1 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      既読にする
                    </button>
                    <button
                      onClick={() => handleStatusChange(contact.id, 'replied')}
                      disabled={contact.status === 'replied'}
                      className="px-3 py-1 text-sm rounded-lg border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      返信済みにする
                    </button>
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      className="px-3 py-1 text-sm rounded-lg border border-gold text-navy hover:bg-gold/10 transition-colors ml-auto"
                    >
                      ✉️ メールで返信
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
