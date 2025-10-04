'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { examQuestions, isAllAnswered } from '@/lib/exam-questions';

export default function JoinExamPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllAnswered(answers)) {
      alert('すべての質問に回答してください');
      return;
    }

    setIsSubmitting(true);

    // 送信処理（わずかな遅延で体験向上）
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 結果ページへ遷移（必ず合格）
    router.push('/join/result');
  };

  const allAnswered = isAllAnswered(answers);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="card-official mb-8">
        <h1 className="text-4xl font-bold text-navy mb-4 text-center">
          入会試験
        </h1>
        <p className="text-gray-600 text-center mb-6">
          全10問の質問に答えてください。すべて選択すると送信できます。
        </p>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-600">回答済み:</span>
          <span className="font-bold text-navy">
            {answeredCount} / {examQuestions.length}
          </span>
          {allAnswered && (
            <span className="ml-2 text-gold">✓ すべて回答完了</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {examQuestions.map((question) => (
          <div key={question.id} className="card-official">
            <div className="mb-4">
              <span className="inline-block bg-navy text-gold px-3 py-1 rounded text-sm font-bold mb-2">
                問{question.id}
              </span>
              <h2 className="text-xl font-bold text-navy">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === index
                      ? 'border-gold bg-gold bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index}
                    checked={answers[question.id] === index}
                    onChange={() => handleAnswerChange(question.id, index)}
                    className="mr-3 accent-gold"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={!allAnswered || isSubmitting}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '送信中...' : '試験を送信する'}
          </button>
          {!allAnswered && (
            <p className="text-sm text-gray-500 mt-3">
              すべての質問に回答すると送信できます
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
