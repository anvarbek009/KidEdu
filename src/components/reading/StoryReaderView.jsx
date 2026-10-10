import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SHORT_STORIES } from '../../data/storiesData';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function StoryReaderView({
  activeChild,
  onBack,
  onLessonComplete
}) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const startStory = (story) => {
    audio.playPop();
    setSelectedStory(story);
    setCurrentPage(0);
    setShowQuiz(false);
    setQuizAnswer(null);
    setQuizDone(false);

    // Speak initial page text
    if (story.pages[0]) {
      setTimeout(() => {
        audio.speakUzbek(story.pages[0].text);
      }, 300);
    }
  };

  const handleNextPage = () => {
    audio.playPop();
    if (currentPage + 1 < selectedStory.pages.length) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      audio.speakUzbek(selectedStory.pages[nextPage].text);
    } else {
      setShowQuiz(true);
      audio.speakUzbek(selectedStory.quiz.question);
    }
  };

  const handlePrevPage = () => {
    audio.playPop();
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      audio.speakUzbek(selectedStory.pages[prevPage].text);
    }
  };

  const handleQuizOption = (index) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);

    const isCorrect = index === selectedStory.quiz.correctIndex;

    if (isCorrect) {
      audio.playCorrect();
      audio.speakUzbek("To'g'ri! Siz ertakni juda diqqat bilan o'qidingiz!");
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) { }
    } else {
      audio.playWrong();
      audio.speakUzbek("Qaytadan o'ylab ko'ring!");
    }

    setTimeout(() => {
      setQuizDone(true);
      onLessonComplete({
        subject: 'o\'qish',
        topic: `Ertak: ${selectedStory.title}`,
        score: isCorrect ? 1 : 0,
        total: 1,
        xpEarned: selectedStory.quiz.xpReward || 40,
        completedId: selectedStory.id,
      });
    }, 1200);
  };

  return (
    <div className="py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 animate-pop-in">

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-50 p-4 rounded-3xl border-3 border-clay-dark shadow-clay-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playPop();
              if (selectedStory) {
                setSelectedStory(null);
              } else {
                onBack();
              }
            }}
            className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft size={16} />
            <span>{selectedStory ? 'Ertaklarga Qaytish' : 'Xaritaga Qaytish'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖✨</span>
              <h1 className="text-xl sm:text-2xl font-black text-clay-dark">Sehrli Kitobxonlik</h1>
            </div>
            <p className="text-xs text-clay/80 font-bold hidden sm:block">
              O'zbek xalq va zamonaviy bolalar ertaklari, ovozli o'qish va savollar
            </p>
          </div>
        </div>

        {selectedStory && !showQuiz && (
          <div className="bg-paper-200 px-3 py-1.5 rounded-2xl border-2 border-clay-dark text-xs font-bold text-clay-dark">
            Sahifa: <span className="font-black text-terracotta">{currentPage + 1} / {selectedStory.pages.length}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: STORYBOOK SHELF SELECTION */}
      {!selectedStory ? (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-clay-dark">Ertaklar Tokchasi</h2>
            <p className="text-xs text-clay/80 font-semibold mt-1">
              Birgalikda o'qiymiz, yangi so'zlarni o'rganamiz va qahramonlar bilan do'stlashamiz!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHORT_STORIES.map((story) => {
              const isDone = activeChild?.completedLessons?.stories?.includes(story.id);

              return (
                <div
                  key={story.id}
                  onClick={() => startStory(story)}
                  className="group cursor-pointer bg-white hover:bg-paper-50 p-6 rounded-3xl border-3 border-clay-dark shadow-clay transition-all transform hover:-translate-y-2 flex flex-col justify-between"
                  style={{ borderTopColor: story.themeColor, borderTopWidth: '8px' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark group-hover:rotate-6 transition-transform">
                        {story.icon}
                      </span>

                      {isDone ? (
                        <span className="flex items-center gap-1 bg-sage text-white text-xs font-black px-2.5 py-1 rounded-xl border-2 border-clay-dark">
                          <CheckCircle size={13} />
                          <span>O'qilgan</span>
                        </span>
                      ) : (
                        <span className="text-xs bg-sunny-soft text-clay-dark font-black px-2.5 py-1 rounded-xl border border-clay-dark/30">
                          +{story.quiz.xpReward} XP
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-clay-dark mb-1 group-hover:text-terracotta transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-clay/70 font-semibold leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t-2 border-paper-200 flex items-center justify-between">
                    <span className="text-xs bg-skywood/30 text-clay-dark font-bold px-2 py-0.5 rounded-lg">
                      {story.ageGroup} yosh
                    </span>
                    <button className="clay-btn bg-sage text-white text-xs px-3 py-1.5 font-black flex items-center gap-1">
                      <BookOpen size={13} />
                      <span>O'qish</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <MascotDoni
              emotion="proud"
              size="md"
              speech="Ertak o'qish orqali so'z boyligingiz oshadi va harflarni ravon o'qiysiz!"
            />
          </div>
        </div>
      ) : !showQuiz ? (
        /* VIEW 2: ACTIVE STORYBOOK READING PAGE */
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Illustrated Book Page */}
          <div className="bg-[#FFFDF9] p-6 sm:p-10 rounded-3xl border-4 border-clay-dark shadow-clay-lg relative space-y-6 paper-pattern">

            {/* Big Story Scene Illustration */}
            <div className="bg-paper-100 p-4 sm:p-6 rounded-2xl border-3 border-clay-dark text-center shadow-inner flex justify-center items-center overflow-hidden min-h-[220px]">
              {selectedStory.pages[currentPage].image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={selectedStory.pages[currentPage].image}
                    alt={selectedStory.pages[currentPage].illustration}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl border-3 border-clay-dark shadow-clay transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="text-5xl sm:text-6xl tracking-widest animate-bounce-gentle">
                  {selectedStory.pages[currentPage].illustration}
                </div>
              )}
            </div>

            {/* Story Text with Word Highlights */}
            <div className="space-y-4 text-center">
              <p className="text-lg sm:text-2xl font-black text-clay-dark leading-relaxed sm:leading-loose">
                {selectedStory.pages[currentPage].text.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[.,?!"]/g, '');
                  const isHighlight = selectedStory.pages[currentPage].highlightWords.includes(cleanWord);

                  return (
                    <span
                      key={i}
                      onClick={() => {
                        audio.playPop();
                        audio.speakUzbek(cleanWord);
                      }}
                      className={`inline-block mx-1 cursor-pointer transition-all hover:scale-110 active:scale-95 ${isHighlight
                          ? 'bg-sunny/40 text-terracotta-dark font-black px-1.5 py-0.5 rounded-lg border-b-2 border-terracotta'
                          : 'hover:text-terracotta'
                        }`}
                      title="So'zni eshitish uchun bosing"
                    >
                      {word}
                    </span>
                  );
                })}
              </p>

              {/* Audio Listen Button */}
              <button
                onClick={() => {
                  audio.playPop();
                  audio.speakUzbek(selectedStory.pages[currentPage].text);
                }}
                className="clay-btn bg-sunny text-clay-dark px-4 py-2 text-xs font-black inline-flex items-center gap-2 shadow-clay-sm"
              >
                <Volume2 size={16} />
                <span>Sahifani To'liq Eshitish</span>
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-clay-dark/20">
              <button
                disabled={currentPage === 0}
                onClick={handlePrevPage}
                className="clay-btn bg-paper-200 disabled:opacity-40 text-clay-dark px-4 py-2.5 text-xs font-black flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span>Oldingi</span>
              </button>

              <span className="text-xs font-black text-clay/70">
                {currentPage + 1} - bet
              </span>

              <button
                onClick={handleNextPage}
                className="clay-btn bg-sage text-white px-5 py-2.5 text-xs font-black flex items-center gap-1 shadow-clay"
              >
                <span>{currentPage + 1 === selectedStory.pages.length ? 'Savolga O\'tish' : 'Keyingi'}</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* VIEW 3: COMPREHENSION QUIZ AT THE END OF STORY */
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-4 border-clay-dark shadow-clay space-y-6 animate-pop-in">

          {!quizDone ? (
            <>
              <div className="text-center space-y-2">
                <span className="text-4xl">🤔✨</span>
                <h3 className="text-xl sm:text-2xl font-black text-clay-dark">
                  Ertak bo'yicha Savol:
                </h3>
                <p className="text-base sm:text-lg font-black text-terracotta bg-paper-100 p-4 rounded-2xl border-2 border-clay-dark">
                  "{selectedStory.quiz.question}"
                </p>
              </div>

              <div className="space-y-3">
                {selectedStory.quiz.options.map((option, idx) => {
                  const isSelected = quizAnswer === idx;
                  const isCorrect = idx === selectedStory.quiz.correctIndex;

                  let btnStyle = 'bg-paper-50 hover:bg-paper-100 text-clay-dark';
                  if (isSelected) {
                    btnStyle = isCorrect ? 'bg-sage text-white' : 'bg-terracotta text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizOption(idx)}
                      className={`w-full clay-btn ${btnStyle} p-4 text-left font-black text-sm sm:text-base border-3 transition-all flex items-center justify-between`}
                    >
                      <span>{option}</span>
                      <Volume2
                        size={16}
                        className="opacity-60"
                        onClick={(e) => {
                          e.stopPropagation();
                          audio.speakUzbek(option);
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="text-6xl animate-bounce-gentle">📖🌟</div>
              <h3 className="text-3xl font-black text-clay-dark">Ertak yakunlandi!</h3>
              <p className="text-sm font-bold text-clay/80">
                Siz "{selectedStory.title}" ertagini a'lo darajada o'qib chiqdingiz!
              </p>
              <div className="text-lg font-black text-sunny-dark bg-sunny-soft py-2 px-4 rounded-2xl border-2 border-clay-dark inline-block">
                +{selectedStory.quiz.xpReward} XP Qozonildi! ⭐
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    audio.playPop();
                    setSelectedStory(null);
                  }}
                  className="clay-btn bg-sage text-white py-3 px-8 text-base font-black"
                >
                  Boshqa Ertakni Tanlash
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
