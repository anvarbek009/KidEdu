// Uzbek Illustrated Storybooks for Reading Practice

export const SHORT_STORIES = [
  {
    id: 'story_1',
    title: 'Quvnoq Ayiqcha va Asal',
    icon: '🐻',
    ageGroup: '5-6',
    coverBg: '#FEF6E4',
    themeColor: '#F3B749',
    description: 'Kichkina ayiqchaning o\'rmondagi shirin asal qidiruvi haqida ertak.',
    pages: [
      {
        pageNumber: 1,
        illustration: '🌲🐻🌲',
        text: 'Ertalab quyosh charaqlab chiqdi. Kichkina Ayiqcha uyqudan uyg\'ondi va qorni juda ochqaganini sezdi.',
        highlightWords: ['Ayiqcha', 'quyosh', 'uyg\'ondi'],
      },
      {
        pageNumber: 2,
        illustration: '🐝🍯🌸',
        text: 'U qalin o\'rmonga qarab yo\'l oldi. Yo\'lda u mehnatkash asalari bilan uchrashdi. "Salom, menga bir qoshiq asal berasanmi?" dedi Ayiqcha.',
        highlightWords: ['o\'rmonga', 'asalari', 'asal'],
      },
      {
        pageNumber: 3,
        illustration: '😋🍯🐻',
        text: 'Asalari unga eng mazali tilla rangli asalni tuhfa qildi. Ayiqcha rahmat aytib, juda xursand bo\'ldi.',
        highlightWords: ['mazali', 'tuhfa', 'xursand'],
      }
    ],
    quiz: {
      question: 'Ayiqcha ertalab nimani qidirib o\'rmonga bordi?',
      options: ['Shirin Asal', 'Qizil Olma', 'Rangli Qalam'],
      correctIndex: 0,
      xpReward: 35
    }
  },
  {
    id: 'story_2',
    title: 'Quyonvoy va Sehrli Sabzi',
    icon: '🐰',
    ageGroup: '7-8',
    coverBg: '#FDECE9',
    themeColor: '#E26D5C',
    description: 'Quyonvoy o\'z do\'stlari bilan sabzini baham ko\'rgani haqida ibratli ertak.',
    pages: [
      {
        pageNumber: 1,
        illustration: '🥕🏡🐰',
        text: 'Kuz kunlarining birida Quyonvoy o\'z tomorqasidan juda katta va chiroyli sabzi topib oldi.',
        highlightWords: ['Quyonvoy', 'tomorqa', 'sabzi'],
      },
      {
        pageNumber: 2,
        illustration: '🦔🤝🐰',
        text: 'U sabzini yolg\'iz o\'zi yemadi. Yo\'ldan o\'tib ketayotgan Tipratikan do\'stini mehmonga chaqirdi.',
        highlightWords: ['yolg\'iz', 'Tipratikan', 'mehmonga'],
      },
      {
        pageNumber: 3,
        illustration: '🎉🥣🥕',
        text: 'Ular birgalikda mazali sabzili sho\'rva tayyorlab, hammaga ulashishdi. Do\'stlik — eng katta boylikdir!',
        highlightWords: ['birgalikda', 'sho\'rva', 'Do\'stlik'],
      }
    ],
    quiz: {
      question: 'Quyonvoy topgan sabzisini kim bilan baham ko\'rdi?',
      options: ['Bo\'ri bilan', 'Tipratikan bilan', 'Ayiq bilan'],
      correctIndex: 1,
      xpReward: 40
    }
  },
  {
    id: 'story_3',
    title: 'Koinotga Uchgan Qushcha',
    icon: '🚀',
    ageGroup: '9-10',
    coverBg: '#EAF4F9',
    themeColor: '#6AA8C8',
    description: 'Orzulari cheksiz bo\'lgan jasur qushchaning yulduzlar sari sayohati.',
    pages: [
      {
        pageNumber: 1,
        illustration: '✨🐦🌙',
        text: 'Kichik Qushcha har kecha yulduzlarga qarab, bir kun kelib o\'sha baland ko\'k osmonga yetib borishni orzu qilardi.',
        highlightWords: ['Qushcha', 'yulduzlarga', 'osmonga'],
      },
      {
        pageNumber: 2,
        illustration: '🔭🌟🦅',
        text: 'U har kuni qanotlarini mashq qildi, shamol qoidalarini va koinot xaritalarini o\'rgandi.',
        highlightWords: ['mashq', 'koinot', 'xaritalar'],
      },
      {
        pageNumber: 3,
        illustration: '🌌🚀✨',
        text: 'Nihoyat, u eng baland tog\' cho\'qqisiga uchib chiqib, yulduzlarning eng yorqin nurini butun yer yuziga ulashdi.',
        highlightWords: ['cho\'qqi', 'yorqin', 'yulduzlar'],
      }
    ],
    quiz: {
      question: 'Qushchaning eng katta orzusi nima edi?',
      options: ['Yulduzlar sari uchish', 'Dengizda suzish', 'Uxlash'],
      correctIndex: 0,
      xpReward: 50
    }
  }
];
