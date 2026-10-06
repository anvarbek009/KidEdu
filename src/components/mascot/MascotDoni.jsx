import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { audio } from '../../services/audioService';

export default function MascotDoni({
  emotion = 'happy', // happy, cheering, thinking, proud, wave
  size = 'md', // sm, md, lg, xl
  speech = '',
  costume = { hat: null, accessory: null },
  onMascotClick = null,
  showSpeechBubble = true
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [bounce, setBounce] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28 md:w-32 md:h-32',
    lg: 'w-36 h-36 md:w-44 md:h-44',
    xl: 'w-48 h-48 md:w-60 md:h-60',
  };

  const handleSpeak = (e) => {
    e?.stopPropagation();
    setBounce(true);
    setTimeout(() => setBounce(false), 600);
    audio.playPop();
    const phrase = speech || "Salom! Men Doniman. Keling, birga o'rganamiz!";
    audio.speakUzbek(phrase);
    if (onMascotClick) onMascotClick();
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech Bubble */}
      {showSpeechBubble && speech && (
        <div
          onClick={handleSpeak}
          className="cursor-pointer group relative mb-2 bg-[#FFFDF9] border-3 border-clay-dark px-4 py-2 rounded-2xl shadow-clay-sm max-w-[220px] md:max-w-[280px] text-center transform transition-all duration-200 hover:scale-105 active:scale-95 animate-pop-in"
        >
          <p className="text-clay-dark font-bold text-xs md:text-sm leading-snug">
            {speech}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-terracotta font-semibold">
            <Volume2 size={12} className="group-hover:animate-bounce" />
            <span>Ovozni eshitish</span>
          </div>
          {/* Speech bubble tail pointing down */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-clay-dark"></div>
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-t-[7px] border-t-[#FFFDF9]"></div>
        </div>
      )}

      {/* Mascot Avatar SVG Container */}
      <div
        onClick={handleSpeak}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative cursor-pointer transition-transform duration-200 ${
          bounce ? 'scale-110 -rotate-3' : isHovered ? 'scale-105 rotate-1' : 'scale-100'
        } ${sizeClasses[size]}`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* Definitions for gradients & hand-drawn filters */}
          <defs>
            <linearGradient id="foxOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FA824C" />
              <stop offset="100%" stopColor="#E26D5C" />
            </linearGradient>
            <linearGradient id="foxBelly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF7ED" />
              <stop offset="100%" stopColor="#FED7AA" />
            </linearGradient>
            <linearGradient id="capeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6AA8C8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Super Cape Costume (if equipped) */}
          {costume?.accessory === 'super_cape' && (
            <path
              d="M30 65 Q10 95 20 110 Q60 115 100 110 Q110 95 90 65 Z"
              fill="url(#capeGrad)"
              stroke="#3D2817"
              strokeWidth="2.5"
            />
          )}

          {/* Bushy Tail */}
          <path
            d="M85 75 Q115 65 112 40 Q105 25 90 45 Q75 60 85 75 Z"
            fill="url(#foxOrange)"
            stroke="#3D2817"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M102 32 Q112 40 98 50 Q105 40 102 32 Z"
            fill="#FFF7ED"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Mascot Body */}
          <ellipse
            cx="60"
            cy="80"
            rx="30"
            ry="28"
            fill="url(#foxOrange)"
            stroke="#3D2817"
            strokeWidth="3"
          />

          {/* White Chest Patch */}
          <path
            d="M48 68 Q60 88 72 68 Q60 100 48 68 Z"
            fill="url(#foxBelly)"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Left Ear */}
          <path
            d="M32 46 L24 16 Q36 20 46 36 Z"
            fill="url(#foxOrange)"
            stroke="#3D2817"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M30 40 L27 22 Q34 25 40 34 Z"
            fill="#FED7AA"
          />

          {/* Right Ear */}
          <path
            d="M88 46 L96 16 Q84 20 74 36 Z"
            fill="url(#foxOrange)"
            stroke="#3D2817"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M90 40 L93 22 Q86 25 80 34 Z"
            fill="#FED7AA"
          />

          {/* Head */}
          <path
            d="M25 52 Q60 28 95 52 Q100 75 60 90 Q20 75 25 52 Z"
            fill="url(#foxOrange)"
            stroke="#3D2817"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Cheeks & White Muzzle */}
          <path
            d="M30 60 Q60 88 90 60 Q80 82 60 86 Q40 82 30 60 Z"
            fill="url(#foxBelly)"
            stroke="#3D2817"
            strokeWidth="2.5"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="62" rx="5" ry="3.5" fill="#F49082" opacity="0.8" />
          <ellipse cx="84" cy="62" rx="5" ry="3.5" fill="#F49082" opacity="0.8" />

          {/* Eyes & Expressions */}
          {emotion === 'cheering' || emotion === 'proud' ? (
            // Joyful curved eyes (happy arcs)
            <g stroke="#3D2817" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M42 50 Q48 44 54 50" />
              <path d="M66 50 Q72 44 78 50" />
            </g>
          ) : emotion === 'thinking' ? (
            // Thinking eyes (looking up-right)
            <g>
              <circle cx="48" cy="48" r="5" fill="#3D2817" />
              <circle cx="46" cy="46" r="1.5" fill="#FFF" />
              <circle cx="74" cy="46" r="5" fill="#3D2817" />
              <circle cx="72" cy="44" r="1.5" fill="#FFF" />
            </g>
          ) : (
            // Standard big sparkling happy eyes
            <g>
              <ellipse cx="46" cy="50" rx="6" ry="7" fill="#3D2817" />
              <circle cx="44" cy="47" r="2.5" fill="#FFFFFF" />
              <circle cx="48" cy="53" r="1" fill="#FFFFFF" />

              <ellipse cx="74" cy="50" rx="6" ry="7" fill="#3D2817" />
              <circle cx="72" cy="47" r="2.5" fill="#FFFFFF" />
              <circle cx="76" cy="53" r="1" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Nose */}
          <path
            d="M57 65 Q60 62 63 65 Q60 70 57 65 Z"
            fill="#3D2817"
          />

          {/* Smile / Mouth */}
          <path
            d="M54 71 Q60 77 66 71"
            fill="none"
            stroke="#3D2817"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Paws */}
          <ellipse cx="44" cy="94" rx="7" ry="5" fill="#FFF7ED" stroke="#3D2817" strokeWidth="2.5" />
          <ellipse cx="76" cy="94" rx="7" ry="5" fill="#FFF7ED" stroke="#3D2817" strokeWidth="2.5" />

          {/* Equipped Hat Costume */}
          {costume?.hat === 'straw_hat' && (
            <g id="straw-hat">
              <ellipse cx="60" cy="33" rx="36" ry="8" fill="#F3B749" stroke="#3D2817" strokeWidth="2.5" />
              <path d="M42 33 Q43 14 60 14 Q77 14 78 33 Z" fill="#F3B749" stroke="#3D2817" strokeWidth="2.5" />
              <path d="M43 28 Q60 29 77 28" stroke="#E26D5C" strokeWidth="3" fill="none" />
            </g>
          )}

          {costume?.hat === 'wizard_hat' && (
            <g id="wizard-hat">
              <ellipse cx="60" cy="34" rx="34" ry="7" fill="#7A5B80" stroke="#3D2817" strokeWidth="2.5" />
              <path d="M40 33 L60 4 L80 33 Z" fill="#9A7AA0" stroke="#3D2817" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="60" cy="5" r="3.5" fill="#F3B749" stroke="#3D2817" strokeWidth="1.5" />
              <text x="56" y="24" fontSize="10" fill="#F3B749">★</text>
            </g>
          )}

          {costume?.hat === 'party_hat' && (
            <g id="party-hat">
              <path d="M45 34 L60 8 L75 34 Z" fill="#E26D5C" stroke="#3D2817" strokeWidth="2.5" />
              <circle cx="60" cy="8" r="3.5" fill="#F3B749" stroke="#3D2817" strokeWidth="1.5" />
              <path d="M50 25 L70 25" stroke="#FFF" strokeWidth="2" strokeDasharray="2,2" />
            </g>
          )}

          {/* Equipped Glasses */}
          {costume?.accessory === 'smart_glasses' && (
            <g id="glasses">
              <circle cx="46" cy="50" r="9" fill="rgba(255,255,255,0.4)" stroke="#3D2817" strokeWidth="2.5" />
              <circle cx="74" cy="50" r="9" fill="rgba(255,255,255,0.4)" stroke="#3D2817" strokeWidth="2.5" />
              <line x1="55" y1="50" x2="65" y2="50" stroke="#3D2817" strokeWidth="2.5" />
            </g>
          )}

          {/* Equipped Explorer Bag */}
          {costume?.accessory === 'explorer_bag' && (
            <g id="explorer-bag">
              <rect x="74" y="80" width="16" height="14" rx="3" fill="#A07855" stroke="#3D2817" strokeWidth="2" />
              <path d="M56 70 Q70 80 76 84" stroke="#3D2817" strokeWidth="2" fill="none" />
              <circle cx="82" cy="86" r="1.5" fill="#F3B749" />
            </g>
          )}
        </svg>

        {/* Playful Floating Sparkle icon */}
        <div className="absolute -top-1 -right-1 text-sunny animate-sparkle">
          <Sparkles size={16} />
        </div>
      </div>
    </div>
  );
}
