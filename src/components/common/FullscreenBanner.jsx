import React from 'react';
import { Minimize2, Sparkles, Shield } from 'lucide-react';
import { audio } from '../../services/audioService';

export default function FullscreenBanner({
  isFullscreen,
  onExitFullscreen,
  activeChild
}) {
  if (!isFullscreen) return null;

  return (
    <div className="bg-sunny border-b-3 border-clay-dark px-4 py-1.5 flex items-center justify-between text-clay-dark text-xs font-black select-none z-50 animate-pop-in">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="animate-spin text-terracotta" />
        <span>To'liq Ekran O'rganish Rejimi (Chalg'imasdan o'rganing!)</span>
      </div>

      <button
        onClick={() => {
          audio.playPop();
          onExitFullscreen();
        }}
        className="clay-btn bg-white hover:bg-paper-100 text-clay-dark text-xs px-2.5 py-1 flex items-center gap-1 font-bold shadow-clay-sm"
      >
        <Minimize2 size={13} />
        <span>Chiqish</span>
      </button>
    </div>
  );
}
