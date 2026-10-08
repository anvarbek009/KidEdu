import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Shield, 
  Users, 
  ShoppingBag,
  Award,
  Home
} from 'lucide-react';
import { audio } from '../../services/audioService';

export default function HeaderNav({
  activeChild,
  onOpenParentGate,
  onOpenProfileSelector,
  onOpenBadges,
  onOpenShop,
  onGoHome,
  isFullscreen,
  onToggleFullscreen,
  currentView
}) {
  const [soundOn, setSoundOn] = useState(true);

  const toggleAudio = () => {
    const nextSound = audio.toggleSound();
    audio.toggleVoice();
    setSoundOn(nextSound);
    if (nextSound) audio.playPop();
  };

  // Calculate XP progress to next level
  const currentXp = activeChild?.xp || 0;
  const currentLevel = activeChild?.level || 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 50;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 50;
  const progressInLevel = Math.min(100, Math.max(0, ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel || 50)) * 100));

  return (
    <header className="sticky top-0 z-40 bg-paper-50/95 backdrop-blur-md border-b-3 border-clay-dark px-3 py-2.5 sm:px-6 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audio.playPop();
              onGoHome();
            }}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            title="Bosh sahifaga qaytish"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sunny rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-xl sm:text-2xl group-hover:scale-105 group-hover:-rotate-3 transition-transform">
              🦊
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bubble font-black text-xl sm:text-2xl text-terracotta tracking-tight">Kid</span>
                <span className="font-bubble font-black text-xl sm:text-2xl text-sage tracking-tight">Edu</span>
                <span className="text-[10px] bg-sunny/40 text-clay-dark font-bold px-1.5 py-0.5 rounded-full border border-clay-dark/30 hidden sm:inline-block">UZ</span>
              </div>
              <p className="text-[11px] text-clay/80 font-bold -mt-1 hidden sm:block">Quvnoq Ta'lim Olami</p>
            </div>
          </button>

          {currentView !== 'world' && (
            <button
              onClick={() => {
                audio.playPop();
                onGoHome();
              }}
              className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <Home size={16} />
              <span className="hidden md:inline">Xarita</span>
            </button>
          )}
        </div>

        {/* Child Profile Status & Gamification Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Active Child Profile Card */}
          <button
            onClick={() => {
              audio.playPop();
              onOpenProfileSelector();
            }}
            className="flex items-center gap-2 bg-paper-100 hover:bg-paper-200 border-2.5 border-clay-dark px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl shadow-clay-sm transition-all text-left"
            title="Profilni almashtirish"
          >
            <div className="text-xl sm:text-2xl">{activeChild?.avatar || '🦊'}</div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-clay-dark leading-tight">{activeChild?.name || 'Bola'}</span>
                <span className="text-[10px] bg-skywood/30 text-clay-dark font-bold px-1.5 py-0.2 rounded-md border border-clay-dark/20">
                  {activeChild?.ageGroup || '7-8'} yosh
                </span>
              </div>
              
              {/* Level & XP bar */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-extrabold text-terracotta">{currentLevel}-daraja</span>
                <div className="w-16 sm:w-20 h-2 bg-paper-300 rounded-full border border-clay-dark/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sunny to-terracotta rounded-full transition-all duration-500"
                    style={{ width: `${progressInLevel}%` }}
                  />
                </div>
              </div>
            </div>
            <Users size={14} className="text-clay/60 hidden md:block ml-1" />
          </button>

          {/* Gamification Counters: Streak & Star Coins */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Daily Streak Flame */}
            <div 
              className="flex items-center gap-1 bg-terracotta-soft border-2 border-clay-dark px-2 py-1 rounded-xl shadow-clay-sm cursor-help"
              title={`${activeChild?.streak || 1} kunlik faol dars ketma-ketligi!`}
            >
              <Flame size={16} className="text-terracotta fill-terracotta animate-pulse" />
              <span className="font-extrabold text-xs sm:text-sm text-terracotta-dark">{activeChild?.streak || 1}</span>
            </div>

            {/* Star Coins */}
            <button
              onClick={() => {
                audio.playPop();
                onOpenShop();
              }}
              className="flex items-center gap-1 bg-sunny-soft hover:bg-sunny/40 border-2 border-clay-dark px-2 py-1 rounded-xl shadow-clay-sm transition-all"
              title="Yulduzli Tangalar va Kiyimlar Do'koni"
            >
              <span className="text-sm">⭐</span>
              <span className="font-extrabold text-xs sm:text-sm text-clay-dark">{activeChild?.coins || 0}</span>
              <ShoppingBag size={13} className="text-clay-dark ml-0.5 hidden sm:inline" />
            </button>

            {/* Badges Gallery Quick Button */}
            <button
              onClick={() => {
                audio.playPop();
                onOpenBadges();
              }}
              className="p-1.5 bg-plum-soft hover:bg-plum/30 border-2 border-clay-dark rounded-xl shadow-clay-sm text-plum-dark transition-all hidden sm:flex items-center justify-center"
              title="Yutuqlar va medallar xazinasi"
            >
              <Award size={18} />
            </button>
          </div>

          {/* Controls: Sound, Fullscreen, Parent Gate */}
          <div className="flex items-center gap-1 sm:gap-2 border-l-2 border-clay-dark/20 pl-1.5 sm:pl-3">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 sm:p-2 rounded-xl border-2 border-clay-dark shadow-clay-sm transition-all ${
                soundOn ? 'bg-sage-soft text-sage-dark' : 'bg-paper-200 text-clay/50'
              }`}
              title={soundOn ? "Ovozni o'chirish" : "Ovozni yoqish"}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Fullscreen Mode Toggle */}
            <button
              onClick={() => {
                audio.playPop();
                onToggleFullscreen();
              }}
              className={`p-1.5 sm:p-2 rounded-xl border-2 border-clay-dark shadow-clay-sm transition-all ${
                isFullscreen ? 'bg-sunny text-clay-dark' : 'bg-paper-200 text-clay-dark'
              }`}
              title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran (O'rganish rejimi)"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Parent Gate / Dashboard Lock Button */}
            <button
              onClick={() => {
                audio.playPop();
                onOpenParentGate();
              }}
              className="clay-btn bg-terracotta text-white text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5"
              title="Ota-ona kabineti (Himoyalangan)"
            >
              <Shield size={15} />
              <span className="hidden md:inline font-bold">Ota-ona</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}
