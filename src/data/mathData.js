// Mathematics Curriculum & Questions generator for ages 5-6, 7-8, 9-10

export const MATH_TOPICS = {
  '5-6': [
    {
      id: 'count_visual',
      title: 'Meva va Yulduzlarni Sanash',
      subtitle: '1 dan 10 gacha quvnoq sanash',
      icon: '🍎',
      color: '#E26D5C',
      type: 'counting',
      questionsCount: 6,
    },
    {
      id: 'compare_quantities',
      title: 'Qaysi biri ko\'p?',
      subtitle: 'Katta va kichik to\'plamlarni taqqoslash',
      icon: '⚖️',
      color: '#F3B749',
      type: 'comparison',
      questionsCount: 6,
    },
    {
      id: 'simple_add_visual',
      title: 'Birga Qo\'shamiz (1-5)',
      subtitle: 'Rasmlar yordamida qo\'shish',
      icon: '➕',
      color: '#6EA888',
      type: 'visual_add',
      questionsCount: 6,
    }
  ],
  '7-8': [
    {
      id: 'add_sub_20',
      title: 'Qo\'shish va Ayirish (1-20)',
      subtitle: 'Tezkor hisoblash mashqlari',
      icon: '🎯',
      color: '#6AA8C8',
      type: 'arithmetic_20',
      questionsCount: 8,
    },
    {
      id: 'missing_number',
      title: 'Sehrli Bo\'sh Katak',
      subtitle: 'Tushib qolgan raqamni toping (8 + ? = 15)',
      icon: '🔍',
      color: '#9A7AA0',
      type: 'missing_number',
      questionsCount: 8,
    },
    {
      id: 'number_patterns',
      title: 'Ketma-ketliklar',
      subtitle: 'Sehrli sonlar zanjirini davom ettir',
      icon: '🚂',
      color: '#E26D5C',
      type: 'patterns',
      questionsCount: 8,
    }
  ],
  '9-10': [
    {
      id: 'multiplication_master',
      title: 'Ko\'paytirish Jadvali',
      subtitle: '2 dan 9 gacha jadvallar',
      icon: '⚡',
      color: '#F3B749',
      type: 'multiplication',
      questionsCount: 10,
    },
    {
      id: 'division_explorer',
      title: 'Bo\'lish Sarguzashti',
      subtitle: 'Teng bo\'lish va qoldiqli hisob',
      icon: '🍕',
      color: '#6EA888',
      type: 'division',
      questionsCount: 10,
    },
    {
      id: 'word_problems',
      title: 'Mantiqiy Masalalar',
      subtitle: 'Matnli qiziqarli topishmoqlar',
      icon: '🧠',
      color: '#6AA8C8',
      type: 'word_problem',
      questionsCount: 6,
    }
  ]
};

// Generates dynamic question sets for any topic and age
export function generateMathQuestions(topicId, ageGroup = '7-8') {
  const emojis = ['🍎', '⭐️', '🐰', '🎈', '🐠', '🍓', '🥕', '🐱', '⚽️', '🌸'];

  switch (topicId) {
    case 'count_visual': {
      const questions = [];
      for (let i = 0; i < 6; i++) {
        const count = Math.floor(Math.random() * 7) + 2; // 2 to 8
        const emoji = emojis[i % emojis.length];
        const wrong1 = count + (Math.random() > 0.5 ? 1 : -1);
        const wrong2 = count + (Math.random() > 0.5 ? 2 : -2);
        const options = Array.from(new Set([count, wrong1 > 0 ? wrong1 : count + 3, wrong2 > 0 && wrong2 !== wrong1 ? wrong2 : count + 4])).slice(0, 3);
        while (options.length < 3) options.push(options[0] + options.length + 1);
        options.sort(() => Math.random() - 0.5);

        questions.push({
          id: `cv_${i}`,
          prompt: `Savatchada nechta ${emoji} bor?`,
          visualItems: Array(count).fill(emoji),
          correctAnswer: count,
          options: options,
          hint: 'Har birini birma-bir barmog\'ingiz bilan sanang!'
        });
      }
      return questions;
    }

    case 'compare_quantities': {
      const questions = [];
      for (let i = 0; i < 6; i++) {
        const countA = Math.floor(Math.random() * 6) + 1;
        let countB = Math.floor(Math.random() * 6) + 1;
        while (countB === countA) countB = Math.floor(Math.random() * 6) + 1;

        const isLeftMore = countA > countB;
        questions.push({
          id: `cq_${i}`,
          prompt: 'Qaysi tomonda narsalar KO\'PROQ?',
          leftItems: Array(countA).fill('🍎'),
          rightItems: Array(countB).fill('🍓'),
          correctAnswer: isLeftMore ? 'Chap tomon' : 'O\'ng tomon',
          options: ['Chap tomon', 'O\'ng tomon'],
          hint: 'Ikkala tomonni sanab, qaysi biri ko\'p ekanini toping!'
        });
      }
      return questions;
    }

    case 'simple_add_visual': {
      const questions = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.floor(Math.random() * 4) + 1;
        const b = Math.floor(Math.random() * 4) + 1;
        const ans = a + b;
        const emoji = emojis[i % emojis.length];
        const options = Array.from(new Set([ans, ans + 1, Math.max(1, ans - 1)])).sort(() => Math.random() - 0.5);

        questions.push({
          id: `sav_${i}`,
          prompt: `${a} + ${b} = ?`,
          leftItems: Array(a).fill(emoji),
          rightItems: Array(b).fill(emoji),
          correctAnswer: ans,
          options: options,
          hint: 'Barcha narsalarni birga qo\'shib sanang!'
        });
      }
      return questions;
    }

    case 'add_sub_20': {
      const questions = [];
      for (let i = 0; i < 8; i++) {
        const isAdd = Math.random() > 0.4;
        let a, b, ans, op;
        if (isAdd) {
          a = Math.floor(Math.random() * 12) + 3;
          b = Math.floor(Math.random() * 9) + 2;
          ans = a + b;
          op = '+';
        } else {
          a = Math.floor(Math.random() * 15) + 6;
          b = Math.floor(Math.random() * (a - 2)) + 1;
          ans = a - b;
          op = '-';
        }
        const options = Array.from(new Set([ans, ans + 2, Math.max(1, ans - 2), ans + 1])).slice(0, 4).sort(() => Math.random() - 0.5);
        questions.push({
          id: `as20_${i}`,
          prompt: `${a} ${op} ${b} = ?`,
          equation: `${a} ${op} ${b}`,
          correctAnswer: ans,
          options: options,
          hint: `${a} ga ${b} ni ${isAdd ? 'qo\'shing' : 'ayiring'}.`
        });
      }
      return questions;
    }

    case 'missing_number': {
      const questions = [];
      for (let i = 0; i < 8; i++) {
        const a = Math.floor(Math.random() * 10) + 2;
        const missing = Math.floor(Math.random() * 8) + 2;
        const sum = a + missing;
        const options = Array.from(new Set([missing, missing + 1, Math.max(1, missing - 1), missing + 3])).slice(0, 4).sort(() => Math.random() - 0.5);

        questions.push({
          id: `mn_${i}`,
          prompt: `${a} + ❓ = ${sum}`,
          equation: `${a} + [ ? ] = ${sum}`,
          correctAnswer: missing,
          options: options,
          hint: `${sum} dan ${a} ni ayirib ko'ring!`
        });
      }
      return questions;
    }

    case 'number_patterns': {
      const questions = [];
      for (let i = 0; i < 8; i++) {
        const step = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
        const start = Math.floor(Math.random() * 5) + 1;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const next = start + step * 4;
        const options = Array.from(new Set([next, next + 2, next - 2, next + step + 1])).slice(0, 4).sort(() => Math.random() - 0.5);

        questions.push({
          id: `pat_${i}`,
          prompt: `Keyingi sonni toping: ${seq.join(', ')}, ❓`,
          sequence: seq,
          correctAnswer: next,
          options: options,
          hint: `Har safar sonlar ${step} taga oshmoqda!`
        });
      }
      return questions;
    }

    case 'multiplication_master': {
      const questions = [];
      for (let i = 0; i < 10; i++) {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const ans = a * b;
        const options = Array.from(new Set([ans, ans + a, ans - b > 0 ? ans - b : ans + 4, ans + 2])).slice(0, 4).sort(() => Math.random() - 0.5);

        questions.push({
          id: `mult_${i}`,
          prompt: `${a} × ${b} = ?`,
          equation: `${a} × ${b}`,
          correctAnswer: ans,
          options: options,
          hint: `${a} ta ${b} ni birga qo'shing.`
        });
      }
      return questions;
    }

    case 'division_explorer': {
      const questions = [];
      for (let i = 0; i < 10; i++) {
        const divisor = Math.floor(Math.random() * 7) + 2;
        const quotient = Math.floor(Math.random() * 7) + 2;
        const dividend = divisor * quotient;
        const options = Array.from(new Set([quotient, quotient + 1, Math.max(1, quotient - 1), quotient + 2])).slice(0, 4).sort(() => Math.random() - 0.5);

        questions.push({
          id: `div_${i}`,
          prompt: `${dividend} ÷ ${divisor} = ?`,
          equation: `${dividend} ÷ ${divisor}`,
          correctAnswer: quotient,
          options: options,
          hint: `${divisor} ni nechiga ko'paytirsak ${dividend} bo'ladi?`
        });
      }
      return questions;
    }

    case 'word_problem': {
      const storyPool = [
        {
          text: "Jasur bog'dan 6 ta qizil olma va 8 ta sariq olma terdi. Jasur jami nechta olma terdi?",
          ans: 14,
          options: [12, 14, 15, 16],
          hint: "6 + 8 = ?"
        },
        {
          text: "Malikada 20 ta rangli qalam bor edi. U do'stiga 7 tasini sovg'a qildi. Malikada nechta qalam qoldi?",
          ans: 13,
          options: [11, 13, 14, 15],
          hint: "20 - 7 = ?"
        },
        {
          text: "Har bir qutida 4 tadan shokolad bor. 5 ta qutida jami nechta shokolad bo'ladi?",
          ans: 20,
          options: [16, 18, 20, 24],
          hint: "5 × 4 = ?"
        },
        {
          text: "18 ta konfetni 3 nafar bolaga teng taqsimlab berishdi. Har bir bola nechtadan konfet oldi?",
          ans: 6,
          options: [5, 6, 7, 8],
          hint: "18 ÷ 3 = ?"
        },
        {
          text: "Daraxtda 9 ta qush o'tirgan edi. Yana 5 ta qush uchib keldi, keyin 3 tasi uchib ketdi. Daraxtda nechta qush qoldi?",
          ans: 11,
          options: [10, 11, 12, 14],
          hint: "9 + 5 - 3 = ?"
        },
        {
          text: "Avtobusda 15 nafar yo'lovchi bor edi. Bekatda 6 kishi tushdi va 4 kishi chiqdi. Avtobusda nechta yo'lovchi bo'ldi?",
          ans: 13,
          options: [12, 13, 14, 15],
          hint: "15 - 6 + 4 = ?"
        }
      ];

      return storyPool.map((s, idx) => ({
        id: `wp_${idx}`,
        prompt: s.text,
        isStory: true,
        correctAnswer: s.ans,
        options: s.options.sort(() => Math.random() - 0.5),
        hint: s.hint
      }));
    }

    default:
      return [];
  }
}
