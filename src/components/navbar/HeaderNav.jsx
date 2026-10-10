import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag,
  Award,
  Home,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Menu,
  X
} from 'lucide-react';
import { audio } from '../../services/audioService';

export default function HeaderNav({
  activeChild,
  onOpenProfile,
  onOpenBadges,
  onOpenShop,
  onGoHome,
  isFullscreen,
  onToggleFullscreen,
  currentView
}) {
  const [soundOn, setSoundOn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-paper-50/95 backdrop-blur-md border-b-3 border-clay-dark px-3 py-2.5 sm:px-6 sm:py-3 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audio.playPop();
              setIsMobileMenuOpen(false);
              onGoHome();
            }}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none min-h-[44px]"
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
                setIsMobileMenuOpen(false);
                onGoHome();
              }}
              className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 min-h-[44px]"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Xarita</span>
            </button>
          )}
        </div>

        {/* Center/Right: Single Child Profile & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* THE SINGLE PROFILE CARD: Displays child's avatar, name, age, level & XP */}
          <button
            onClick={() => {
              audio.playPop();
              setIsMobileMenuOpen(false);
              onOpenProfile();
            }}
            className={`flex items-center gap-2 border-2.5 border-clay-dark px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl shadow-clay-sm transition-all text-left min-h-[44px] cursor-pointer ${
              currentView === 'profile'
                ? 'bg-sunny/40 ring-3 ring-terracotta shadow-clay'
                : 'bg-paper-100 hover:bg-paper-200'
            }`}
            title="Mening Profilim sahifasini ochish"
          >
            <div className="text-2xl sm:text-3xl">{activeChild?.avatar || '🦊'}</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm text-clay-dark leading-tight">
                  {activeChild?.name || 'Bilimdon'}
                </span>
                <span className="text-[10px] bg-skywood/30 text-clay-dark font-bold px-1.5 py-0.2 rounded-md border border-clay-dark/20">
                  {activeChild?.ageGroup || '7-8'} yosh
                </span>
              </div>
              
              {/* Level & XP progress bar */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-extrabold text-terracotta">{currentLevel}-daraja</span>
                <div className="w-16 sm:w-24 h-2 bg-paper-300 rounded-full border border-clay-dark/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sunny to-terracotta rounded-full transition-all duration-500"
                    style={{ width: `${progressInLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </button>

          {/* Desktop Controls (Hidden on small mobile screens) */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Daily Streak Flame */}
            <div 
              className="flex items-center gap-1 bg-terracotta-soft border-2 border-clay-dark px-2.5 py-1.5 rounded-xl shadow-clay-sm min-h-[44px]"
              title={`${activeChild?.streak || 1} kunlik faol dars ketma-ketligi!`}
            >
              <Flame size={16} className="text-terracotta fill-terracotta animate-pulse" />
              <span className="font-extrabold text-xs sm:text-sm text-terracotta-dark">{activeChild?.streak || 1}</span>
            </div>

            {/* Star Coins & Shop */}
            <button
              onClick={() => {
                audio.playPop();
                onOpenShop();
              }}
              className="flex items-center gap-1 bg-sunny-soft hover:bg-sunny/40 border-2 border-clay-dark px-2.5 py-1.5 rounded-xl shadow-clay-sm transition-all min-h-[44px]"
              title="KidEdu Kiyimlar Do'koni"
            >
              <span className="text-base">⭐</span>
              <span className="font-extrabold text-xs sm:text-sm text-clay-dark">{activeChild?.coins || 0}</span>
              <ShoppingBag size={14} className="text-clay-dark ml-0.5" />
            </button>

            {/* Badges Gallery Quick Button */}
            <button
              onClick={() => {
                audio.playPop();
                onOpenBadges();
              }}
              className="p-2.5 bg-plum-soft hover:bg-plum/30 border-2 border-clay-dark rounded-xl shadow-clay-sm text-plum-dark transition-all flex items-center justify-center min-h-[44px] min-w-[44px]"
              title="Yutuqlar va medallar"
            >
              <Award size={18} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl border-2 border-clay-dark shadow-clay-sm transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
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
              className={`p-2.5 rounded-xl border-2 border-clay-dark shadow-clay-sm transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isFullscreen ? 'bg-sunny text-clay-dark' : 'bg-paper-200 text-clay-dark'
              }`}
              title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => {
                audio.playPop();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2.5 bg-paper-100 hover:bg-paper-200 border-2.5 border-clay-dark rounded-2xl shadow-clay-sm text-clay-dark flex items-center justify-center min-h-[44px] min-w-[44px]"
              title="Menyu"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3 p-4 bg-paper-100 border-3 border-clay-dark rounded-3xl shadow-clay space-y-3 animate-pop-in">
          <div className="grid grid-cols-2 gap-2 text-xs font-black">
            
            {/* Coins / Shop */}
            <button
              onClick={() => {
                audio.playPop();
                setIsMobileMenuOpen(false);
                onOpenShop();
              }}
              className="flex items-center justify-between p-3 bg-sunny-soft border-2 border-clay-dark rounded-2xl shadow-clay-sm min-h-[48px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⭐</span>
                <span>Do'kon</span>
              </div>
              <span className="bg-sunny px-2 py-0.5 rounded-lg border border-clay-dark">
                {activeChild?.coins || 0}
              </span>
            </button>

            {/* Badges */}
            <button
              onClick={() => {
                audio.playPop();
                setIsMobileMenuOpen(false);
                onOpenBadges();
              }}
              className="flex items-center justify-center gap-2 p-3 bg-plum-soft border-2 border-clay-dark rounded-2xl shadow-clay-sm text-plum-dark min-h-[48px]"
            >
              <Award size={18} />
              <span>Yutuqlar</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                toggleAudio();
              }}
              className={`flex items-center justify-center gap-2 p-3 border-2 border-clay-dark rounded-2xl shadow-clay-sm min-h-[48px] ${
                soundOn ? 'bg-sage-soft text-sage-dark' : 'bg-paper-200 text-clay/50'
              }`}
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>{soundOn ? "Ovoz: Yoqilgan" : "Ovoz: O'chiq"}</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => {
                audio.playPop();
                onToggleFullscreen();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-3 bg-paper-200 border-2 border-clay-dark rounded-2xl shadow-clay-sm min-h-[48px]"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              <span>{isFullscreen ? "Kichraytirish" : "To'liq Ekran"}</span>
            </button>
          </div>

          {currentView !== 'world' && (
            <button
              onClick={() => {
                audio.playPop();
                setIsMobileMenuOpen(false);
                onGoHome();
              }}
              className="w-full py-3 bg-sunny text-clay-dark border-2 border-clay-dark rounded-2xl shadow-clay-sm font-black flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Home size={18} />
              <span>Bosh Xaritaga Qaytish</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
