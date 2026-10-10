import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  Trophy, 
  Flame, 
  RotateCcw,
  Zap,
  Play,
  Lock,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MATH_TOPICS, generateMathQuestions } from '../../data/mathData';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function MathAdventureView({
  activeChild,
  onBack,
  onLessonComplete
}) {
  const ageGroup = activeChild?.ageGroup || '7-8';
  const availableTopics = MATH_TOPICS[ageGroup] || MATH_TOPICS['7-8'];

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [tappedCounters, setTappedCounters] = useState({});

  const startTopicLesson = (topic) => {
    audio.playPop();
    setSelectedTopic(topic);
    const generated = generateMathQuestions(topic.id, ageGroup);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowHint(false);
    setIsFinished(false);
    setCombo(0);
    setTappedCounters({});

    // Voice is NOT played automatically - only when user presses speaker button
  };

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (option) => {
    if (selectedOption !== null) return; // Prevent double clicking
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      audio.playCorrect();
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch (err) {}
    } else {
      audio.playWrong();
      setCombo(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setSelectedOption(null);
        setShowHint(false);
        setTappedCounters({});
      } else {
        // Finished Lesson!
        setIsFinished(true);
        audio.playLevelUp();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch (e) {}

        const finalScore = score + (isCorrect ? 1 : 0);
        const xpAmount = Math.max(20, finalScore * 12);

        onLessonComplete({
          subject: 'matematika',
          topic: selectedTopic.title,
          score: finalScore,
          total: questions.length,
          xpEarned: xpAmount,
          completedId: selectedTopic.id,
        });
      }
    }, 1300);
  };

  const handleTapCounter = (key) => {
    audio.playPop();
    setTappedCounters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 animate-pop-in">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-50 p-4 rounded-3xl border-3 border-clay-dark shadow-clay-sm">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playPop();
              if (selectedTopic && !isFinished) {
                setSelectedTopic(null);
              } else {
                onBack();
              }
            }}
            className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft size={16} />
            <span>{selectedTopic && !isFinished ? 'Mavzularga Qaytish' : 'Xaritaga Qaytish'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏰🔢</span>
              <h1 className="text-xl sm:text-2xl font-black text-clay-dark">Raqamlar Qasri</h1>
            </div>
            <p className="text-xs text-clay/80 font-bold hidden sm:block">
              {ageGroup} yosh uchun qiziqarli matematika va hisoblash sarguzashtlari
            </p>
          </div>
        </div>

        {selectedTopic && !isFinished && (
          <div className="flex items-center gap-2 bg-paper-200 px-3 py-1.5 rounded-2xl border-2 border-clay-dark">
            <span className="text-xs font-bold text-clay/70">Savol:</span>
            <span className="text-sm font-black text-terracotta">
              {currentIndex + 1} / {questions.length}
            </span>
            {combo > 1 && (
              <div className="flex items-center gap-1 bg-terracotta text-white text-xs font-black px-2 py-0.5 rounded-lg ml-2 animate-bounce-gentle">
                <Flame size={12} />
                <span>{combo}x Combo!</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* VIEW 1: TOPIC SELECTION CARDS (When no topic is active) */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-clay-dark">Mavzuni Tanlang</h2>
            <p className="text-xs text-clay/80 font-semibold mt-1">
              Har bir darsni muvaffaqiyatli yakunlab, yulduzlar va XP qozoning!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {availableTopics.map((t, idx) => {
              const isDone = activeChild?.completedLessons?.math?.includes(t.id);
              const prevTopic = idx > 0 ? availableTopics[idx - 1] : null;
              // Lesson 1 is always unlocked. Next lessons unlock step by step upon completing previous lesson.
              const isUnlocked = idx === 0 || isDone || (prevTopic && activeChild?.completedLessons?.math?.includes(prevTopic.id));

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    if (!isUnlocked) {
                      audio.playWrong();
                      audio.speakUzbek("Bu dars hali qulflangan! Avvalgi darsni muvaffaqiyatli yakunlang.");
                      return;
                    }
                    startTopicLesson(t);
                  }}
                  className={`group p-6 rounded-3xl border-3 border-clay-dark shadow-clay transition-all flex flex-col justify-between ${
                    !isUnlocked 
                      ? 'bg-paper-200/80 opacity-75 cursor-not-allowed border-dashed'
                      : 'bg-white hover:bg-paper-50 cursor-pointer transform hover:-translate-y-1.5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl border-3 border-clay-dark flex items-center justify-center text-3xl shadow-clay-sm transition-transform ${
                          isUnlocked ? 'group-hover:rotate-6' : 'grayscale opacity-70'
                        }`}
                        style={{ backgroundColor: isUnlocked ? t.color : '#D8D4CC' }}
                      >
                        {isUnlocked ? t.icon : '🔒'}
                      </div>

                      {isDone ? (
                        <span className="flex items-center gap-1 bg-sage text-white text-xs font-black px-2.5 py-1 rounded-xl border-2 border-clay-dark">
                          <CheckCircle size={13} />
                          <span>Bajarilgan</span>
                        </span>
                      ) : !isUnlocked ? (
                        <span className="flex items-center gap-1 bg-paper-300 text-clay-dark/70 text-xs font-black px-2.5 py-1 rounded-xl border border-clay-dark/30">
                          <Lock size={12} />
                          <span>Qulflangan</span>
                        </span>
                      ) : (
                        <span className="text-xs bg-sunny-soft text-clay-dark font-black px-2.5 py-1 rounded-xl border border-clay-dark/30">
                          +{t.questionsCount * 12} XP
                        </span>
                      )}
                    </div>

                    <h3 className={`text-lg font-black mb-1 transition-colors ${
                      isUnlocked ? 'text-clay-dark group-hover:text-terracotta' : 'text-clay/60'
                    }`}>
                      {t.title}
                    </h3>
                    <p className="text-xs text-clay/70 font-semibold leading-relaxed">
                      {isUnlocked ? t.subtitle : `Oldingi "${prevTopic?.title || 'dars'}"ni yakunlab, ushbu bosqichni oching.`}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t-2 border-paper-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-clay/60">
                      {t.questionsCount} ta savol
                    </span>
                    {isUnlocked ? (
                      <button className="clay-btn bg-sage text-white text-xs px-3 py-1.5 font-black flex items-center gap-1">
                        <Play size={13} />
                        <span>{isDone ? "Qayta O'ynash" : "Boshlash"}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-clay/60 bg-paper-300/80 px-2.5 py-1 rounded-xl border border-clay-dark/20">
                        <Lock size={12} />
                        <span>Kuting</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Friendly Mascot Tip */}
          <div className="mt-8 flex justify-center">
            <MascotDoni
              emotion="cheering"
              size="md"
              speech="Matematika — bu eng sehrli o'yin! Istagan mavzungizni tanlang va birga hisoblaymiz!"
            />
          </div>
        </div>
      ) : !isFinished && currentQ ? (
        /* VIEW 2: ACTIVE QUESTION ARENA */
        <div className="max-w-3xl mx-auto space-y-5">
          
          {/* Lesson Explanation & Step-by-Step Example Banner */}
          {selectedTopic && (selectedTopic.explanation || selectedTopic.stepByStep) && (
            <div className="bg-gradient-to-r from-sunny-soft via-paper-50 to-sage-soft border-3 border-clay-dark rounded-3xl p-4 sm:p-5 shadow-clay-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-sunny text-clay-dark rounded-xl border border-clay-dark shadow-clay-sm text-lg">
                    📖
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-clay-dark flex items-center gap-2">
                      <span>Dars Tushuntirishi & Namunasi</span>
                      <span className="text-[11px] font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-clay-dark/20 text-terracotta">
                        {selectedTopic.title}
                      </span>
                    </h3>
                    <p className="text-xs text-clay/70 font-semibold hidden sm:block">
                      Masalani yechishdan oldin qoidani va namunani o'rganib oling!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      audio.playPop();
                      audio.speakUzbek(`${selectedTopic.title}. ${selectedTopic.explanation}. Masalan: ${selectedTopic.stepByStep}`);
                    }}
                    className="p-2 bg-sunny text-clay-dark hover:bg-sunny-dark rounded-xl border border-clay-dark shadow-clay-sm text-xs font-bold flex items-center gap-1 transition-all"
                    title="Tushuntirishni ovozda eshitish"
                  >
                    <Volume2 size={15} />
                    <span className="hidden sm:inline">Eshitish</span>
                  </button>

                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="p-2 bg-white text-clay-dark rounded-xl border border-clay-dark shadow-clay-sm text-xs font-bold flex items-center gap-1"
                    title={showExplanation ? "Yashirish" : "Ko'rsatish"}
                  >
                    {showExplanation ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>

              {showExplanation && (
                <div className="space-y-2.5 pt-1 animate-pop-in">
                  <div className="bg-white/90 p-3 rounded-2xl border border-clay-dark/30 text-xs sm:text-sm font-bold text-clay-dark leading-relaxed">
                    💡 {selectedTopic.explanation}
                  </div>

                  {selectedTopic.stepByStep && (
                    <div className="bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark/40 flex items-start gap-2 text-xs sm:text-sm font-black text-terracotta-dark">
                      <span className="text-base">📝</span>
                      <div>
                        <span className="text-clay/75 font-bold mr-1.5">Qadamma-qadam namuna:</span>
                        <span>{selectedTopic.stepByStep}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Question Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-clay-dark shadow-clay relative space-y-6">
            
            {/* Audio prompt button & Prompt Title */}
            <div className="flex items-center justify-between gap-3 bg-paper-100 p-4 rounded-2xl border-2 border-clay-dark">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    audio.playPop();
                    audio.speakUzbek(currentQ.prompt);
                  }}
                  className="p-2.5 bg-sunny text-clay-dark rounded-xl border-2 border-clay-dark shadow-clay-sm hover:scale-105 active:scale-95 transition-all"
                  title="Savolni ovozda eshitish"
                >
                  <Volume2 size={20} />
                </button>
                <h3 className="text-lg sm:text-xl font-black text-clay-dark">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Hint button */}
              <button
                onClick={() => {
                  audio.playPop();
                  setShowHint(!showHint);
                }}
                className="p-2 bg-paper-200 hover:bg-paper-300 text-clay-dark rounded-xl border-2 border-clay-dark shadow-clay-sm text-xs font-bold flex items-center gap-1"
                title="Yordam / Maslahat"
              >
                <HelpCircle size={15} />
                <span className="hidden sm:inline">Maslahat</span>
              </button>
            </div>

            {/* Hint Box (if toggled) */}
            {showHint && currentQ.hint && (
              <div className="bg-sunny-soft p-3 rounded-xl border-2 border-clay-dark text-xs font-bold text-clay-dark animate-pop-in flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span>{currentQ.hint}</span>
              </div>
            )}

            {/* Visual Item Counting Arena (For Visual Counting & Simple Add) */}
            {currentQ.visualItems && (
              <div className="bg-paper-50 p-6 rounded-2xl border-3 border-clay-dark text-center">
                <div className="text-xs font-bold text-clay/60 mb-3">
                  (Barmog'ingiz bilan bosib sanang!)
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
                  {currentQ.visualItems.map((item, idx) => {
                    const isTapped = tappedCounters[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTapCounter(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl rounded-2xl border-2.5 border-clay-dark flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 ${
                          isTapped ? 'bg-sunny shadow-clay-sm rotate-6 scale-105' : 'bg-white shadow-sm'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Left vs Right Comparison Visuals */}
            {currentQ.leftItems && currentQ.rightItems && (
              <div className="grid grid-cols-2 gap-4 bg-paper-50 p-4 sm:p-6 rounded-2xl border-3 border-clay-dark text-center">
                <div className="bg-white p-3 rounded-xl border-2 border-clay-dark space-y-2">
                  <div className="text-xs font-black text-clay/70">Chap Tomon</div>
                  <div className="flex flex-wrap justify-center gap-2 text-2xl sm:text-3xl">
                    {currentQ.leftItems.map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border-2 border-clay-dark space-y-2">
                  <div className="text-xs font-black text-clay/70">O'ng Tomon</div>
                  <div className="flex flex-wrap justify-center gap-2 text-2xl sm:text-3xl">
                    {currentQ.rightItems.map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Big Math Equation Spotlight (For older children arithmetic) */}
            {currentQ.equation && (
              <div className="bg-paper-100 p-6 rounded-2xl border-3 border-clay-dark text-center">
                <div className="text-4xl sm:text-5xl font-black text-terracotta tracking-wider">
                  {currentQ.equation} = <span className="text-clay/40">?</span>
                </div>
              </div>
            )}

            {/* Multiple Choice Answer Buttons */}
            <div>
              <div className="text-xs font-black text-clay/70 mb-2 text-center uppercase tracking-wider">
                To'g'ri javobni tanlang:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctAnswer;
                  
                  let btnStyle = 'bg-paper-100 hover:bg-paper-200 text-clay-dark';
                  if (isSelected) {
                    btnStyle = isCorrect ? 'bg-sage text-white' : 'bg-terracotta text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`clay-btn ${btnStyle} py-4 sm:py-5 text-xl sm:text-2xl font-black transition-all transform hover:-translate-y-1`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Mascot encouraging quote */}
          <div className="flex justify-center">
            <MascotDoni
              emotion={combo > 1 ? 'cheering' : 'happy'}
              size="sm"
              speech={combo > 1 ? "Ofarin! To'g'ri ketyapsan!" : "Shoshilmasdan o'ylab ko'r!"}
            />
          </div>

        </div>
      ) : (
        /* VIEW 3: LESSON COMPLETED CELEBRATION */
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border-4 border-clay-dark shadow-clay text-center space-y-5 animate-pop-in">
          <div className="text-6xl animate-bounce-gentle">🎉🏆</div>
          <h3 className="text-3xl font-black text-clay-dark">Dars Yakunlandi!</h3>
          
          <div className="bg-paper-100 p-4 rounded-2xl border-2 border-clay-dark space-y-2">
            <p className="text-sm font-bold text-clay/80">
              Natija: <span className="text-terracotta font-black text-lg">{score} / {questions.length}</span> to'g'ri javob
            </p>
            <div className="text-xl font-black text-sunny-dark bg-sunny-soft py-2 px-4 rounded-xl border-2 border-clay-dark inline-block">
              +{Math.max(20, score * 12)} XP Qozonildi! ⭐
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => startTopicLesson(selectedTopic)}
              className="clay-btn bg-paper-200 text-clay-dark py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Qaytadan O'ynash</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setSelectedTopic(null);
              }}
              className="clay-btn bg-sage text-white py-3 text-base font-black"
            >
              Boshqa Mavzuni Tanlash
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
