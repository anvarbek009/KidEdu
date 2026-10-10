import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Play, 
  Edit3, 
  Headphones, 
  Puzzle, 
  BookOpen,
  RotateCcw,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UZBEK_ALPHABET, READING_LESSONS, ALPHABET_LESSONS } from '../../data/alphabetData';
import { audio } from '../../services/audioService';
import LetterTracingCanvas from './LetterTracingCanvas';
import MascotDoni from '../mascot/MascotDoni';

export default function AlphabetForestView({
  activeChild,
  onBack,
  onLessonComplete
}) {
  const [selectedLetter, setSelectedLetter] = useState(UZBEK_ALPHABET[0]);
  const [mode, setMode] = useState('explore'); // 'explore', 'reading', 'tracing', 'listening', 'spelling'
  
  // Reading Lessons 30-50 State
  const [selectedReadingLesson, setSelectedReadingLesson] = useState(null);
  const [readingQuizAnswer, setReadingQuizAnswer] = useState(null);
  const [readingQuizDone, setReadingQuizDone] = useState(false);
  
  // Listening Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Spelling Game State
  const [spellingWordIndex, setSpellingWordIndex] = useState(0);
  const spellingPool = [
    { word: 'OLMA', emoji: '🍎', letters: ['O', 'L', 'M', 'A'], scrambled: ['L', 'A', 'O', 'M'] },
    { word: 'BALIQ', emoji: '🐟', letters: ['B', 'A', 'L', 'I', 'Q'], scrambled: ['I', 'B', 'Q', 'A', 'L'] },
    { word: 'GUL', emoji: '🌸', letters: ['G', 'U', 'L'], scrambled: ['U', 'G', 'L'] },
    { word: 'NON', emoji: '🍞', letters: ['N', 'O', 'N'], scrambled: ['O', 'N', 'N'] },
    { word: 'QUYOSH', emoji: '☀️', letters: ['Q', 'U', 'Y', 'O', 'S', 'H'], scrambled: ['S', 'Q', 'H', 'U', 'O', 'Y'] },
  ];
  const [assembledLetters, setAssembledLetters] = useState([]);
  const [spellingFinished, setSpellingFinished] = useState(false);

  // Completed letters set for active child
  const completedLetters = activeChild?.completedLessons?.alphabet || [];

  const handleSelectLetter = (item) => {
    setSelectedLetter(item);
    audio.playPop();
  };

  const handleTracingComplete = (letterItem) => {
    onLessonComplete({
      subject: 'alifbo',
      topic: `Harf Yozish: ${letterItem.upper}`,
      score: 1,
      total: 1,
      xpEarned: 25,
      completedId: letterItem.upper,
    });
    setMode('explore');
  };

  // Listening Quiz Logic
  const listeningQuestions = [
    {
      prompt: "Qaysi so'z [A] harfi bilan boshlanadi?",
      targetLetter: 'A',
      options: [
        { word: 'Olma', emoji: '🍎', correct: true },
        { word: 'Baliq', emoji: '🐟', correct: false },
        { word: 'Daraxt', emoji: '🌳', correct: false },
      ]
    },
    {
      prompt: "Qaysi so'z [B] harfi bilan boshlanadi?",
      targetLetter: 'B',
      options: [
        { word: 'Mushuk', emoji: '🐱', correct: false },
        { word: 'Baliq', emoji: '🐟', correct: true },
        { word: 'Echki', emoji: '🐐', correct: false },
      ]
    },
    {
      prompt: "Qaysi so'z [Q] harfi bilan boshlanadi?",
      targetLetter: 'Q',
      options: [
        { word: 'Non', emoji: '🍞', correct: false },
        { word: 'Fil', emoji: '🐘', correct: false },
        { word: 'Quyosh', emoji: '☀️', correct: true },
      ]
    },
    {
      prompt: "Qaysi so'z [Gʻ] harfi bilan boshlanadi?",
      targetLetter: 'Gʻ',
      options: [
        { word: 'Gʻoz', emoji: '🪿', correct: true },
        { word: 'Lola', emoji: '🌷', correct: false },
        { word: 'Shar', emoji: '🎈', correct: false },
      ]
    },
    {
      prompt: "Qaysi so'z [Sh] harfi bilan boshlanadi?",
      targetLetter: 'Sh',
      options: [
        { word: 'Kitob', emoji: '📚', correct: false },
        { word: 'Shar', emoji: '🎈', correct: true },
        { word: 'Sabzi', emoji: '🥕', correct: false },
      ]
    }
  ];

  const handleQuizAnswer = (opt) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(opt);

    if (opt.correct) {
      audio.playCorrect();
      setQuizScore(prev => prev + 1);
    } else {
      audio.playWrong();
    }

    setTimeout(() => {
      if (quizIndex + 1 < listeningQuestions.length) {
        setQuizIndex(prev => prev + 1);
        setSelectedQuizOption(null);
      } else {
        setQuizFinished(true);
        audio.playLevelUp();
        try { confetti({ particleCount: 80, spread: 80 }); } catch (e) {}
        onLessonComplete({
          subject: 'alifbo',
          topic: 'Topqir Quloq (Eshitish viktorinasi)',
          score: quizScore + (opt.correct ? 1 : 0),
          total: listeningQuestions.length,
          xpEarned: 45,
          completedId: 'listening_quiz',
        });
      }
    }, 1200);
  };

  // Spelling Block Logic
  const currentSpelling = spellingPool[spellingWordIndex];

  const handlePickSpellingLetter = (char) => {
    audio.playPop();
    const updated = [...assembledLetters, char];
    setAssembledLetters(updated);

    // Check if word is complete
    if (updated.length === currentSpelling.letters.length) {
      const spelledWord = updated.join('');
      if (spelledWord === currentSpelling.word) {
        audio.playCorrect();
        try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}

        setTimeout(() => {
          if (spellingWordIndex + 1 < spellingPool.length) {
            setSpellingWordIndex(prev => prev + 1);
            setAssembledLetters([]);
          } else {
            setSpellingFinished(true);
            audio.playLevelUp();
            onLessonComplete({
              subject: 'alifbo',
              topic: 'So\'z Terish Konstruktori',
              score: 5,
              total: 5,
              xpEarned: 50,
              completedId: 'spelling_game',
            });
          }
        }, 1500);
      } else {
        audio.playWrong();
        setTimeout(() => setAssembledLetters([]), 1000);
      }
    }
  };

  // If Tracing Mode is active
  if (mode === 'tracing') {
    return (
      <div className="py-4 px-2 sm:px-4 max-w-5xl mx-auto">
        <LetterTracingCanvas
          letterItem={selectedLetter}
          onBack={() => setMode('explore')}
          onComplete={handleTracingComplete}
        />
      </div>
    );
  }

  return (
    <div className="py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 animate-pop-in">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-50 p-4 rounded-3xl border-3 border-clay-dark shadow-clay-sm">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playPop();
              onBack();
            }}
            className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft size={16} />
            <span>Xaritaga Qaytish</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌲🔤</span>
              <h1 className="text-xl sm:text-2xl font-black text-clay-dark">Alifbo O'rmoni</h1>
            </div>
            <p className="text-xs text-clay/80 font-bold hidden sm:block">
              50 ta O'zbek alifbosi, bo'g'inlar, so'zlar va o'qish darslari
            </p>
          </div>
        </div>

        {/* Game Mode Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-paper-200 p-1.5 border-2 border-clay-dark rounded-2xl">
          <button
            onClick={() => {
              audio.playPop();
              setMode('explore');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              mode === 'explore'
                ? 'bg-sunny text-clay-dark border-clay-dark shadow-clay-sm scale-105'
                : 'border-transparent text-clay/70 hover:text-clay-dark'
            }`}
          >
            <BookOpen size={14} />
            <span>Harflar (1-29)</span>
          </button>

          <button
            onClick={() => {
              audio.playPop();
              setMode('reading');
              setSelectedReadingLesson(null);
              setReadingQuizAnswer(null);
              setReadingQuizDone(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              mode === 'reading'
                ? 'bg-sunny text-clay-dark border-clay-dark shadow-clay-sm scale-105'
                : 'border-transparent text-clay/70 hover:text-clay-dark'
            }`}
          >
            <Sparkles size={14} />
            <span>Bo'g'in & O'qish (30-50)</span>
          </button>

          <button
            onClick={() => {
              audio.playPop();
              setMode('listening');
              setQuizIndex(0);
              setQuizScore(0);
              setQuizFinished(false);
              setSelectedQuizOption(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              mode === 'listening'
                ? 'bg-sunny text-clay-dark border-clay-dark shadow-clay-sm scale-105'
                : 'border-transparent text-clay/70 hover:text-clay-dark'
            }`}
          >
            <Headphones size={14} />
            <span>Topqir Quloq</span>
          </button>

          <button
            onClick={() => {
              audio.playPop();
              setMode('spelling');
              setSpellingWordIndex(0);
              setAssembledLetters([]);
              setSpellingFinished(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              mode === 'spelling'
                ? 'bg-sunny text-clay-dark border-clay-dark shadow-clay-sm scale-105'
                : 'border-transparent text-clay/70 hover:text-clay-dark'
            }`}
          >
            <Puzzle size={14} />
            <span>So'z Terish</span>
          </button>
        </div>

      </div>

      {/* MODE 1: EXPLORE & LETTERS SPOTLIGHT */}
      {mode === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 29 Letters Grid (7 cols on desktop, responsive) */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border-3 border-clay-dark shadow-clay-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-clay-dark flex items-center gap-2">
                <span>Harfni Tanlang:</span>
                <span className="text-xs bg-paper-200 px-2 py-0.5 rounded-full border border-clay-dark/20 text-clay/80">
                  {completedLetters.length}/29 o'rganildi
                </span>
              </h2>
              <span className="text-xs text-clay/70 font-bold hidden sm:inline">
                Harfni bosib ovozini eshiting 🔊
              </span>
            </div>

            {/* 29 Letters Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
              {UZBEK_ALPHABET.map((item, idx) => {
                const isSelected = selectedLetter.id === item.id;
                const isCompleted = completedLetters.includes(item.id);
                const prevLetter = idx > 0 ? UZBEK_ALPHABET[idx - 1] : null;
                // Letter 1 ('A') is always unlocked. Next letters unlock step by step upon completing previous letter.
                const isUnlocked = idx === 0 || isCompleted || (prevLetter && completedLetters.includes(prevLetter.id));

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        audio.playWrong();
                        audio.speakUzbek("Bu harf hali qulflangan! Avval oldingi harfni o'rganing va chizing.");
                        return;
                      }
                      handleSelectLetter(item);
                    }}
                    className={`relative p-2 rounded-2xl border-2.5 border-clay-dark transition-all flex flex-col items-center justify-center ${
                      !isUnlocked
                        ? 'bg-paper-200/60 opacity-60 cursor-not-allowed border-dashed'
                        : isSelected
                        ? 'bg-sunny text-clay-dark shadow-clay scale-105 ring-2 ring-terracotta transform -translate-y-1'
                        : 'bg-paper-50 hover:bg-paper-100 shadow-clay-sm transform hover:-translate-y-1'
                    }`}
                  >
                    <div className="text-lg sm:text-xl font-black leading-none">
                      {item.upper} <span className="text-sm opacity-80">{item.lower}</span>
                    </div>
                    <div className="text-base sm:text-lg mt-1">
                      {isUnlocked ? item.emoji : '🔒'}
                    </div>
                    
                    {/* Status badge: Checkmark if completed, Lock if locked */}
                    {isCompleted ? (
                      <div className="absolute -top-1 -right-1 bg-sage text-white rounded-full p-0.5 border border-clay-dark">
                        <CheckCircle2 size={10} />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="absolute -top-1 -right-1 bg-paper-300 text-clay-dark rounded-full p-0.5 border border-clay-dark/40">
                        <Lock size={10} />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Letter Spotlight & Big Action Card */}
          <div className="lg:col-span-5 bg-paper-50 p-5 sm:p-6 rounded-3xl border-4 border-clay-dark shadow-clay space-y-5">
            
            {/* Spotlight Header */}
            <div className="bg-white p-5 rounded-2xl border-3 border-clay-dark shadow-clay-sm text-center relative overflow-hidden">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl border-3 border-clay-dark flex items-center justify-center text-4xl sm:text-5xl shadow-clay-sm mb-3"
                style={{ backgroundColor: selectedLetter.color || '#E26D5C' }}
              >
                <span className="text-white drop-shadow-md">
                  {selectedLetter.upper} {selectedLetter.lower}
                </span>
              </div>

              <div className="text-3xl mb-1">{selectedLetter.emoji}</div>
              <h3 className="text-2xl sm:text-3xl font-black text-clay-dark">
                {selectedLetter.word}
              </h3>
              <p className="text-xs font-bold text-terracotta mt-0.5">
                Harf nomi: <strong className="text-clay-dark bg-sunny/30 px-2 py-0.5 rounded-md border border-clay-dark/30">{selectedLetter.letterName || selectedLetter.upper}</strong> • Kategoriya: {selectedLetter.category}
              </p>

              {/* Example Sentence in Uzbek */}
              <div className="mt-3 bg-paper-100 border-2 border-clay-dark/30 rounded-xl p-2.5 text-xs font-bold text-clay-dark/90 italic">
                "{selectedLetter.exampleSentence}"
              </div>

              {/* Audio Listen Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => {
                    audio.playPop();
                    audio.speakLetter(selectedLetter.upper);
                  }}
                  className="clay-btn bg-sunny hover:bg-sunny-dark text-clay-dark py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
                  title="Harf nomini eshitish"
                >
                  <Volume2 size={15} />
                  <span>Harf: [{selectedLetter.letterName || selectedLetter.upper}]</span>
                </button>

                <button
                  onClick={() => {
                    audio.playPop();
                    audio.speakUzbek(`${selectedLetter.word}. ${selectedLetter.exampleSentence}`);
                  }}
                  className="clay-btn bg-paper-200 hover:bg-paper-300 text-clay-dark py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
                  title="So'z va namunaviy gapni eshitish"
                >
                  <Volume2 size={15} />
                  <span>So'z & Gap</span>
                </button>
              </div>
            </div>

            {/* Related Words Pill List */}
            <div>
              <h4 className="text-xs font-black text-clay-dark mb-2">
                "{selectedLetter.upper}" harfi bilan boshlanuvchi so'zlar:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedLetter.words?.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      audio.playPop();
                      audio.speakUzbek(w);
                    }}
                    className="bg-white hover:bg-paper-200 border-2 border-clay-dark px-3 py-1.5 rounded-xl shadow-clay-sm text-xs font-bold text-clay-dark flex items-center gap-1.5 transition-all"
                  >
                    <span>{w}</span>
                    <Volume2 size={12} className="text-terracotta" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tracing Activity CTA */}
            <button
              onClick={() => {
                audio.playPop();
                setMode('tracing');
              }}
              className="w-full clay-btn bg-sage hover:bg-sage-dark text-white py-3.5 text-base font-black flex items-center justify-center gap-2 shadow-clay"
            >
              <Edit3 size={20} />
              <span>"{selectedLetter.upper}" Harfini Yozishni Mashq Qilish</span>
            </button>

          </div>

        </div>
      )}

      {/* MODE: READING & SYLLABLES (LESSONS 30-50) */}
      {mode === 'reading' && (
        <div className="space-y-6">
          {!selectedReadingLesson ? (
            /* Shelf of Lessons 30-50 */
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-black text-clay-dark">Bo'g'inlar va O'qish Darslari</h2>
                <p className="text-xs text-clay/80 font-semibold mt-1">
                  21 ta bosqichma-bosqich o'qish darsi: bo'g'inlardan so'zlar, so'zlardan to'liq gaplar tuzishni birga o'rganamiz!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {READING_LESSONS.map((rLesson, idx) => {
                  const isDone = completedLetters.includes(rLesson.id);
                  const prevLesson = idx > 0 ? READING_LESSONS[idx - 1] : null;
                  const isUnlocked = idx === 0 || isDone || (prevLesson && completedLetters.includes(prevLesson.id));

                  return (
                    <div
                      key={rLesson.id}
                      onClick={() => {
                        if (!isUnlocked) {
                          audio.playWrong();
                          audio.speakUzbek("Bu dars hali qulflangan! Avvalgi darsni muvaffaqiyatli yakunlang.");
                          return;
                        }
                        audio.playPop();
                        setSelectedReadingLesson(rLesson);
                        setReadingQuizAnswer(null);
                        setReadingQuizDone(false);
                      }}
                      className={`group p-5 rounded-3xl border-3 border-clay-dark shadow-clay transition-all flex flex-col justify-between ${
                        !isUnlocked
                          ? 'bg-paper-200/80 opacity-75 cursor-not-allowed border-dashed'
                          : 'bg-white hover:bg-paper-50 cursor-pointer transform hover:-translate-y-1.5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-14 h-14 rounded-2xl border-2 border-clay-dark flex items-center justify-center text-3xl shadow-clay-sm transition-transform group-hover:rotate-6"
                            style={{ backgroundColor: isUnlocked ? rLesson.color : '#D8D4CC' }}
                          >
                            {isUnlocked ? rLesson.icon : '🔒'}
                          </div>

                          {isDone ? (
                            <span className="flex items-center gap-1 bg-sage text-white text-xs font-black px-2.5 py-1 rounded-xl border-2 border-clay-dark">
                              <CheckCircle2 size={13} />
                              <span>O'rganildi</span>
                            </span>
                          ) : !isUnlocked ? (
                            <span className="flex items-center gap-1 bg-paper-300 text-clay-dark/70 text-xs font-black px-2.5 py-1 rounded-xl border border-clay-dark/30">
                              <Lock size={12} />
                              <span>Qulflangan</span>
                            </span>
                          ) : (
                            <span className="text-xs bg-sunny-soft text-clay-dark font-black px-2.5 py-1 rounded-xl border border-clay-dark/30">
                              +{rLesson.quiz.rewardXp} XP
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] font-black uppercase text-terracotta tracking-wider">
                          {rLesson.lessonNumber}-dars • {rLesson.category}
                        </div>
                        <h3 className="text-base font-black text-clay-dark mt-0.5 mb-1 group-hover:text-terracotta transition-colors">
                          {rLesson.title}
                        </h3>
                        <p className="text-xs text-clay/70 font-semibold line-clamp-2">
                          {isUnlocked ? rLesson.explanation : `Oldingi "${prevLesson?.title || 'dars'}"ni yakunlab, ushbu darsni oching.`}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t-2 border-paper-200 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-clay/60">
                          {rLesson.items.length} ta amaliy mashq
                        </span>
                        {isUnlocked && (
                          <button className="clay-btn bg-sage text-white text-xs px-3 py-1 font-black flex items-center gap-1">
                            <Play size={12} />
                            <span>{isDone ? "Qayta O'qish" : "Boshlash"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Reading Lesson View */
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Back to reading shelf */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    audio.playPop();
                    setSelectedReadingLesson(null);
                  }}
                  className="clay-btn bg-paper-200 text-clay-dark text-xs px-3 py-2 flex items-center gap-1.5 font-bold"
                >
                  <ArrowLeft size={16} />
                  <span>Darslar Tokchasiga Qaytish</span>
                </button>

                <span className="text-xs font-black bg-sunny-soft text-clay-dark px-3 py-1 rounded-xl border border-clay-dark/30">
                  {selectedReadingLesson.lessonNumber}-dars: {selectedReadingLesson.category}
                </span>
              </div>

              {/* Lesson Main Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-clay-dark shadow-clay space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4 bg-paper-50 p-4 rounded-2xl border-2 border-clay-dark">
                  <div
                    className="w-16 h-16 rounded-2xl border-3 border-clay-dark flex items-center justify-center text-3xl shadow-clay-sm"
                    style={{ backgroundColor: selectedReadingLesson.color }}
                  >
                    {selectedReadingLesson.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-black text-clay-dark">
                      {selectedReadingLesson.title}
                    </h2>
                    <p className="text-xs font-bold text-clay/70 mt-0.5">
                      Kategoriya: <strong className="text-terracotta">{selectedReadingLesson.category}</strong> • Mukofot: +{selectedReadingLesson.quiz.rewardXp} XP
                    </p>
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-gradient-to-r from-sunny-soft via-paper-50 to-sage-soft p-4 rounded-2xl border-2 border-clay-dark space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-clay-dark uppercase flex items-center gap-1.5">
                      <span>💡 Dars Tushuntirishi:</span>
                    </span>
                    <button
                      onClick={() => {
                        audio.playPop();
                        audio.speakUzbek(`${selectedReadingLesson.title}. ${selectedReadingLesson.explanation}`);
                      }}
                      className="p-1.5 bg-sunny text-clay-dark rounded-xl border border-clay-dark shadow-clay-sm text-xs font-bold flex items-center gap-1"
                      title="Ovozda eshitish"
                    >
                      <Volume2 size={14} />
                      <span>Eshitish</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-clay-dark leading-relaxed">
                    {selectedReadingLesson.explanation}
                  </p>
                </div>

                {/* Step-by-Step Example Card */}
                {selectedReadingLesson.stepByStep && (
                  <div className="bg-paper-100 p-4 rounded-2xl border-2 border-clay-dark/40 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-black text-terracotta flex items-center gap-1">
                        <span>📝 Qadamma-qadam namuna:</span>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-clay-dark">
                        {selectedReadingLesson.stepByStep}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        audio.playPop();
                        audio.speakUzbek(`Namunani tinglang: ${selectedReadingLesson.stepByStep}`);
                      }}
                      className="p-1.5 bg-paper-200 hover:bg-paper-300 text-clay-dark rounded-xl border border-clay-dark shadow-clay-sm text-xs font-bold flex items-center gap-1 flex-shrink-0"
                      title="Namunani ovozda eshitish"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}

                {/* Interactive Practice Cards Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-clay-dark flex items-center justify-between">
                    <span>O'qish va Talaffuz Mashqlari:</span>
                    <span className="text-xs text-clay/70 font-semibold">(Har birini bosib ovozini tinglang 🔊)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReadingLesson.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-paper-50 hover:bg-paper-100 p-3.5 rounded-2xl border-2 border-clay-dark shadow-clay-sm flex items-center justify-between gap-3 transition-all"
                      >
                        <div>
                          <div className="text-lg sm:text-xl font-black text-clay-dark">
                            {it.text}
                          </div>
                          <div className="text-xs font-bold text-terracotta">
                            {it.helper}
                          </div>
                          {it.example && (
                            <div className="text-[11px] font-semibold text-clay/70 mt-0.5">
                              Masalan: {it.example}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            audio.playPop();
                            audio.speakUzbek(it.audioText || it.text);
                          }}
                          className="p-2.5 bg-sunny hover:bg-sunny-dark text-clay-dark rounded-xl border-2 border-clay-dark shadow-clay-sm hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                          title="Talaffuzni eshitish"
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comprehension Quiz Card */}
                <div className="bg-paper-100 p-5 rounded-2xl border-3 border-clay-dark space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-terracotta uppercase tracking-wide">
                      Bilim Sinovi & Qabul:
                    </span>
                    <button
                      onClick={() => {
                        audio.playPop();
                        audio.speakUzbek(selectedReadingLesson.quiz.prompt);
                      }}
                      className="p-1 bg-sunny text-clay-dark rounded-lg border border-clay-dark text-xs font-bold flex items-center gap-1"
                      title="Savolni eshitish"
                    >
                      <Volume2 size={13} />
                      <span className="text-[11px]">Savolni eshitish</span>
                    </button>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-clay-dark text-center">
                    {selectedReadingLesson.quiz.prompt}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedReadingLesson.quiz.options.map((opt, optIdx) => {
                      const isSelected = readingQuizAnswer === optIdx;
                      let btnBg = 'bg-white hover:bg-paper-200 text-clay-dark';
                      if (isSelected) {
                        btnBg = opt.correct ? 'bg-sage text-white' : 'bg-terracotta text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={readingQuizDone}
                          onClick={() => {
                            if (readingQuizAnswer !== null) return;
                            setReadingQuizAnswer(optIdx);

                            if (opt.correct) {
                              audio.playCorrect();
                              try {
                                confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                              } catch (e) {}
                              setReadingQuizDone(true);
                              onLessonComplete({
                                subject: 'alifbo',
                                topic: selectedReadingLesson.title,
                                score: 1,
                                total: 1,
                                xpEarned: selectedReadingLesson.quiz.rewardXp,
                                completedId: selectedReadingLesson.id
                              });
                            } else {
                              audio.playWrong();
                              setTimeout(() => setReadingQuizAnswer(null), 1200);
                            }
                          }}
                          className={`clay-btn ${btnBg} py-3 px-4 font-black text-sm border-2 transition-all text-center`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {readingQuizDone && (
                    <div className="bg-sage-soft p-4 rounded-xl border-2 border-sage text-center space-y-3 animate-pop-in">
                      <div className="text-sm font-black text-sage-dark flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>Ajoyib! Dars muvaffaqiyatli yakunlandi! +{selectedReadingLesson.quiz.rewardXp} XP</span>
                      </div>
                      <div className="flex justify-center gap-2">
                        {(() => {
                          const currIdx = READING_LESSONS.findIndex(r => r.id === selectedReadingLesson.id);
                          const nextLesson = currIdx + 1 < READING_LESSONS.length ? READING_LESSONS[currIdx + 1] : null;

                          return nextLesson ? (
                            <button
                              onClick={() => {
                                audio.playPop();
                                setSelectedReadingLesson(nextLesson);
                                setReadingQuizAnswer(null);
                                setReadingQuizDone(false);
                              }}
                              className="clay-btn bg-sage text-white text-xs px-4 py-2 font-black flex items-center gap-1.5"
                            >
                              <span>Keyingi Darsga O'tish ({nextLesson.lessonNumber}-dars)</span>
                              <Play size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                audio.playPop();
                                setSelectedReadingLesson(null);
                              }}
                              className="clay-btn bg-sage text-white text-xs px-4 py-2 font-black"
                            >
                              Barcha Darslarga Qaytish
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: LISTENING & PHONICS QUIZ (TOPQIR QULOQ) */}
      {mode === 'listening' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-4 border-clay-dark shadow-clay space-y-6">
          
          {!quizFinished ? (
            <>
              {/* Quiz Progress & Question */}
              <div className="flex items-center justify-between border-b-2 border-paper-200 pb-3">
                <span className="text-xs font-black text-terracotta bg-terracotta-soft px-3 py-1 rounded-xl border border-terracotta/30">
                  Savol {quizIndex + 1} / {listeningQuestions.length}
                </span>
                <span className="text-xs font-bold text-clay/70">
                  To'g'ri javoblar: {quizScore}
                </span>
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-clay-dark">
                  {listeningQuestions[quizIndex].prompt}
                </h3>
                
                <button
                  onClick={() => {
                    audio.playPop();
                    audio.speakLetter(listeningQuestions[quizIndex].targetLetter);
                  }}
                  className="clay-btn bg-sunny text-clay-dark px-4 py-2 text-xs font-black inline-flex items-center gap-2"
                >
                  <Volume2 size={16} />
                  <span>Harf tovushini qayta eshitish</span>
                </button>
              </div>

              {/* Quiz 3 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {listeningQuestions[quizIndex].options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === opt;
                  let btnBg = 'bg-paper-50 hover:bg-paper-100';
                  if (isSelected) {
                    btnBg = opt.correct ? 'bg-sage text-white' : 'bg-terracotta text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`clay-btn ${btnBg} p-5 flex flex-col items-center justify-center gap-2 border-3 text-center transition-all`}
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <span className="text-base font-black text-clay-dark">{opt.word}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-6 space-y-4">
              <div className="text-6xl animate-bounce-gentle">🏆</div>
              <h3 className="text-3xl font-black text-clay-dark">Barakalla, Bilimdon!</h3>
              <p className="text-sm font-bold text-clay/80">
                Topqir Quloq viktorinasida {quizScore} / {listeningQuestions.length} to'g'ri javob berdingiz!
              </p>
              <div className="text-lg font-black text-sunny-dark bg-sunny-soft py-2 px-4 rounded-2xl border-2 border-clay-dark inline-block">
                +45 XP Qozonildi! ⭐
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    audio.playPop();
                    setMode('explore');
                  }}
                  className="clay-btn bg-sage text-white py-3 px-8 text-base font-black"
                >
                  Alifboga Qaytish
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODE 3: SPELLING WORD BUILDER */}
      {mode === 'spelling' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-4 border-clay-dark shadow-clay space-y-6">
          
          {!spellingFinished ? (
            <>
              {/* Word Card Target */}
              <div className="text-center space-y-2">
                <div className="text-5xl">{currentSpelling.emoji}</div>
                <h3 className="text-xs font-extrabold text-clay/70 uppercase tracking-widest">
                  So'zni to'g'ri harflar bilan tering:
                </h3>
              </div>

              {/* Assembled Slots */}
              <div className="flex justify-center gap-2 py-4">
                {currentSpelling.letters.map((_, idx) => {
                  const filledChar = assembledLetters[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 border-clay-dark flex items-center justify-center text-2xl sm:text-3xl font-black shadow-clay-sm transition-all ${
                        filledChar ? 'bg-sunny text-clay-dark scale-105' : 'bg-paper-100 text-clay/30 border-dashed'
                      }`}
                    >
                      {filledChar || '_'}
                    </div>
                  );
                })}
              </div>

              {/* Scrambled Letter Tiles to Pick */}
              <div className="bg-paper-100 p-4 rounded-2xl border-2 border-clay-dark space-y-3">
                <div className="text-xs font-bold text-clay/80 text-center">
                  Harf bloklarini tartib bilan bosing:
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentSpelling.scrambled.map((char, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePickSpellingLetter(char)}
                      className="w-12 h-12 sm:w-14 sm:h-14 clay-btn bg-white hover:bg-paper-200 text-xl sm:text-2xl font-black text-clay-dark"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset current letters */}
              <div className="text-center">
                <button
                  onClick={() => {
                    audio.playPop();
                    setAssembledLetters([]);
                  }}
                  className="clay-btn bg-paper-200 text-clay-dark text-xs px-3 py-1.5 flex items-center gap-1 mx-auto font-bold"
                >
                  <RotateCcw size={14} />
                  <span>Qaytadan terish</span>
                </button>
              </div>
            </>
          ) : (
            /* Spelling Completed */
            <div className="text-center py-6 space-y-4">
              <div className="text-6xl animate-bounce-gentle">🧩🌟</div>
              <h3 className="text-3xl font-black text-clay-dark">Barcha so'zlar tuzildi!</h3>
              <p className="text-sm font-bold text-clay/80">
                Siz so'zlarni xatosiz to'g'ri terib chiqdingiz. +50 XP!
              </p>
              <button
                onClick={() => {
                  audio.playPop();
                  setMode('explore');
                }}
                className="clay-btn bg-sage text-white py-3 px-8 text-base font-black"
              >
                Alifboga Qaytish
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
