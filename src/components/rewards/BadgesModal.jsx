import React from 'react';
import { X, Award, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { BADGES } from '../../data/badgesData';
import { audio } from '../../services/audioService';

export default function BadgesModal({
  isOpen,
  onClose,
  activeChild
}) {
  if (!isOpen) return null;

  const unlockedIds = activeChild?.unlockedBadges || ['first_step'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay-dark/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-2xl bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-paper-200 border-b-3 border-clay-dark p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-plum text-white rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-clay-dark">
                Yutuqlar & Medallar Xazinasi
              </h2>
              <p className="text-xs text-clay/80 font-bold">
                {unlockedIds.length} / {BADGES.length} ta yutuq ochilgan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playPop();
              onClose();
            }}
            className="p-2 bg-paper-100 hover:bg-white border-2 border-clay-dark rounded-xl shadow-clay-sm transition-all text-clay-dark"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  audio.playPop();
                  if (isUnlocked) {
                    audio.speakUzbek(`${badge.title}. ${badge.description}`);
                  } else {
                    audio.speakUzbek(`Qulfni ochish sharti: ${badge.requirement}`);
                  }
                }}
                className={`cursor-pointer p-4 rounded-2xl border-3 border-clay-dark transition-all flex items-start gap-3 transform hover:-translate-y-1 ${
                  isUnlocked
                    ? 'bg-white shadow-clay'
                    : 'bg-paper-200/70 opacity-60 border-dashed shadow-sm'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl border-2.5 border-clay-dark flex items-center justify-center text-3xl shadow-clay-sm shrink-0 ${
                    isUnlocked ? '' : 'grayscale'
                  }`}
                  style={{ backgroundColor: isUnlocked ? badge.color : '#DFCDB4' }}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-black text-clay-dark truncate">
                      {badge.title}
                    </h3>
                    {isUnlocked ? (
                      <span className="text-sage">
                        <CheckCircle size={15} />
                      </span>
                    ) : (
                      <span className="text-clay/50">
                        <Lock size={13} />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-clay/70 font-semibold mt-0.5 leading-snug">
                    {badge.description}
                  </p>

                  <div className="mt-2 text-[10px] font-bold text-terracotta bg-paper-100 px-2 py-0.5 rounded-md inline-block border border-clay-dark/20">
                    {badge.requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
