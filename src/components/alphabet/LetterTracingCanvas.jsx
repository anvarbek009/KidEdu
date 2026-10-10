import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../../services/audioService';

export default function LetterTracingCanvas({
  letterItem,
  onComplete,
  onBack
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokePointsCount, setStrokePointsCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const letter = letterItem?.upper || 'A';
  const lowerLetter = letterItem?.lower || 'a';

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    clearCanvas();
  }, [letterItem]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / 2;
    const height = canvas.height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw background guideline lines (like a school notebook)
    ctx.strokeStyle = '#EBDDC7';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    // Top line
    ctx.beginPath();
    ctx.moveTo(20, height * 0.2);
    ctx.lineTo(width - 20, height * 0.2);
    ctx.stroke();

    // Middle dashed line
    ctx.strokeStyle = '#DFCDB4';
    ctx.beginPath();
    ctx.moveTo(20, height * 0.5);
    ctx.lineTo(width - 20, height * 0.5);
    ctx.stroke();

    // Baseline
    ctx.strokeStyle = '#C4AF92';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, height * 0.8);
    ctx.lineTo(width - 20, height * 0.8);
    ctx.stroke();

    // Draw Dotted Trace Letter Outline
    ctx.font = `bold ${Math.round(height * 0.65)}px "Fredoka", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#EBE1D3';
    ctx.fillText(`${letter} ${lowerLetter}`, width / 2, height * 0.5);

    ctx.strokeStyle = '#A88D70';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(`${letter} ${lowerLetter}`, width / 2, height * 0.5);
    ctx.setLineDash([]);

    setHasDrawn(false);
    setStrokePointsCount(0);
  };

  const getCanvasPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);

    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#E26D5C'; // Warm Terracotta crayon stroke
    ctx.lineWidth = 14;

    setStrokePointsCount(prev => prev + 1);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setStrokePointsCount(prev => prev + 1);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    audio.playPop();
  };

  const handleCheck = () => {
    if (strokePointsCount < 15) {
      audio.playWrong();
      return;
    }

    audio.playLevelUp();
    
    // Confetti blast
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      if (onComplete) onComplete(letterItem);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-pop-in">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 bg-paper-50 p-3 sm:p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm">
        <button
          onClick={() => {
            audio.playPop();
            onBack();
          }}
          className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1.5 font-bold"
        >
          <ArrowLeft size={16} />
          <span>Orqaga</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">{letterItem?.emoji || '🍎'}</span>
          <span className="text-base sm:text-lg font-black text-clay-dark">
            {letterItem?.word} ({letter} {lowerLetter})
          </span>
          <button
            onClick={() => {
              audio.speakLetter(letter);
              setTimeout(() => audio.speakUzbek(letterItem?.word), 700);
            }}
            className="p-1.5 bg-sunny-soft text-sunny-dark hover:bg-sunny rounded-xl border-2 border-clay-dark shadow-clay-sm transition-all"
            title="Ovozni eshitish"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            audio.playPop();
            clearCanvas();
          }}
          className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1 font-bold"
          title="Tozalash"
        >
          <RotateCcw size={15} />
          <span className="hidden sm:inline">Tozalash</span>
        </button>
      </div>

      {/* Interactive Tracing Blackboard/Card */}
      <div className="relative bg-[#FFFDF8] border-4 border-clay-dark rounded-3xl shadow-clay-lg p-2 sm:p-4 touch-none select-none">
        
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-72 sm:h-96 rounded-2xl cursor-crosshair bg-[#FAF6EC] border-2 border-dashed border-clay-dark/30"
        />

        {/* Hand pointer hint when user hasn't drawn yet */}
        {!hasDrawn && (
          <div className="absolute bottom-6 right-6 pointer-events-none bg-paper-50/90 border-2 border-clay-dark px-3 py-1.5 rounded-xl shadow-clay-sm flex items-center gap-2 animate-bounce-gentle">
            <span className="text-xl">✍️</span>
            <span className="text-xs font-black text-clay-dark">Barmoq yoki sichqoncha bilan ustidan chizing!</span>
          </div>
        )}

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 bg-sunny/90 rounded-3xl flex flex-col items-center justify-center p-6 text-clay-dark animate-pop-in z-20">
            <div className="text-6xl mb-2 animate-wiggle">🌟</div>
            <h3 className="text-3xl font-black text-clay-dark mb-1">Ajoyib! Barakalla!</h3>
            <p className="text-sm font-bold text-clay/90">"{letter}" harfi muvaffaqiyatli yozildi! +25 XP</p>
          </div>
        )}

      </div>

      {/* Bottom Action Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          className="flex-1 clay-btn bg-sage text-white py-3.5 text-base sm:text-lg font-black shadow-clay flex items-center justify-center gap-2"
        >
          <Check size={22} />
          <span>Yozib Bo'ldim (Tekshirish)</span>
        </button>
      </div>

    </div>
  );
}
