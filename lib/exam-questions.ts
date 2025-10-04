export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const examQuestions: Question[] = [
  // 前半5問: 真面目な質問
  {
    id: 1,
    question: '天然パーマの主な原因として正しいものはどれですか？',
    options: [
      '毛根の形状が曲がっているため',
      '栄養不足によるもの',
      'シャンプーの選び方が間違っているため',
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: '湿度が高い日に天パが広がりやすい理由は？',
    options: [
      '髪が水分を吸収して膨張するため',
      '静電気が発生しやすいため',
      '気圧の変化により髪質が変わるため',
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: '天パの方に適したヘアケア方法はどれですか？',
    options: [
      '毎日ブラッシングを念入りに行う',
      '保湿重視のトリートメントを使用する',
      'ドライヤーは使わず自然乾燥させる',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: '縮毛矯正の効果が持続する期間の目安は？',
    options: [
      '約1ヶ月',
      '約3〜6ヶ月',
      '約1年以上',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: '天パの遺伝について正しいものはどれですか？',
    options: [
      '優性遺伝のため、両親のどちらかが天パなら子供も天パになりやすい',
      '劣性遺伝のため、両親が直毛でも天パが生まれることがある',
      '遺伝とは無関係で、環境要因で決まる',
    ],
    correctAnswer: 0,
  },
  // 後半5問: ネタ質問
  {
    id: 6,
    question: '梅雨時期の天パあるあるとして最も共感できるものは？',
    options: [
      '朝のセットが完全に無意味になる',
      '髪が勝手に雨を予報してくれる',
      '湿度計として友人に重宝される',
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: '寝起きの天パを見た家族の反応として最も多いのは？',
    options: [
      '「爆発してるよ」',
      '「芸術作品みたい」',
      '「今日は特に元気だね（髪が）」',
    ],
    correctAnswer: 0,
  },
  {
    id: 8,
    question: '直毛の人に言われて最もイラッとする言葉は？',
    options: [
      '「パーマかけてるの？」',
      '「天パいいじゃん、お金かからなくて」',
      '「ストレートにすればいいのに」',
    ],
    correctAnswer: 2,
  },
  {
    id: 9,
    question: '天パ協会の公式マスコットの名前は何でしょう？',
    options: [
      'うねうね君',
      'くるりん',
      'もじゃ丸',
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: '天パの最大の敵は次のうちどれですか？',
    options: [
      '梅雨',
      '台風',
      '人類の「サラサラストレート至上主義」',
    ],
    correctAnswer: 2,
  },
];

// すべての質問に答えたかチェック
export function isAllAnswered(answers: Record<number, number>): boolean {
  return examQuestions.every((q) => answers[q.id] !== undefined);
}

// 合否判定（必ず合格）
export function getExamResult(answers: Record<number, number>): {
  passed: boolean;
  score: number;
  totalQuestions: number;
} {
  let correctCount = 0;
  examQuestions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  return {
    passed: true, // 必ず合格
    score: correctCount,
    totalQuestions: examQuestions.length,
  };
}
