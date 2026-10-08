import React, { useState, useEffect } from 'react';
import { Shield, X, Lock, KeyRound, CheckCircle } from 'lucide-react';
import { audio } from '../../services/audioService';

export default function ParentGateModal({
  isOpen,
  onClose,
  onSuccess,
  parentPin = '1234'
}) {
  const [gateType, setGateType] = useState('math'); // 'math' or 'pin'
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(8);
  const [userAnswer, setUserAnswer] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate random math challenge on open
  useEffect(() => {
    if (isOpen) {
      const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const b = Math.floor(Math.random() * 6) + 3; // 3 to 8
      setNumA(a);
      setNumB(b);
      setUserAnswer('');
      setEnteredPin('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const expectedMath = numA * numB;

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === expectedMath) {
      audio.playCorrect();
      onSuccess();
    } else {
      audio.playWrong();
      setErrorMsg('Noto\'g\'ri javob. Qayta urinib ko\'ring!');
      setUserAnswer('');
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (enteredPin.trim() === parentPin || enteredPin.trim() === '1234') {
      audio.playCorrect();
      onSuccess();
    } else {
      audio.playWrong();
      setErrorMsg('Noto\'g\'ri PIN-kod! (Standart: 1234)');
      setEnteredPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay-dark/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-md bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg p-6 text-clay-dark">
        
        {/* Close Button */}
        <button
          onClick={() => {
            audio.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-paper-200 hover:bg-paper-300 border-2 border-clay-dark rounded-xl shadow-clay-sm transition-all text-clay-dark"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-terracotta text-white rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-black text-clay-dark">Ota-Ona Himoya Qulfi</h2>
          <p className="text-xs text-clay/80 mt-1 font-semibold">
            Kattalar uchun xavfsizlik nazorati. Iltimos, o'zingizni tasdiqlang.
          </p>
        </div>

        {/* Tabs: Math Equation vs PIN */}
        <div className="flex gap-2 mb-5 p-1 bg-paper-200 border-2 border-clay-dark rounded-2xl">
          <button
            type="button"
            onClick={() => {
              audio.playPop();
              setGateType('math');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              gateType === 'math' ? 'bg-sunny text-clay-dark border-2 border-clay-dark shadow-clay-sm' : 'text-clay/70 hover:text-clay-dark'
            }`}
          >
            Matematik Savol
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playPop();
              setGateType('pin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              gateType === 'pin' ? 'bg-sunny text-clay-dark border-2 border-clay-dark shadow-clay-sm' : 'text-clay/70 hover:text-clay-dark'
            }`}
          >
            PIN-kod Kiritish
          </button>
        </div>

        {/* Math Challenge Form */}
        {gateType === 'math' ? (
          <form onSubmit={handleMathSubmit} className="space-y-4">
            <div className="bg-paper-100 border-3 border-clay-dark rounded-2xl p-4 text-center">
              <span className="text-xs text-clay/70 font-bold block mb-1">Quyidagi amalni hisoblang:</span>
              <div className="text-3xl font-black text-terracotta tracking-wider">
                {numA} × {numB} = ?
              </div>
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Natijani kiriting"
              autoFocus
              className="w-full text-center text-xl font-bold bg-white border-3 border-clay-dark rounded-2xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-sunny shadow-inner"
            />

            {errorMsg && (
              <p className="text-xs font-bold text-terracotta-dark text-center animate-wiggle">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full clay-btn bg-sage text-white py-3 text-base shadow-clay"
            >
              Kabinetga Kirish
            </button>
          </form>
        ) : (
          /* PIN Input Form */
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="text-center">
              <label className="text-xs font-bold text-clay/80 block mb-2">
                4 xonali ota-ona PIN-kodini kiriting (Standart: 1234)
              </label>
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="• • • •"
                autoFocus
                className="w-40 mx-auto text-center text-3xl tracking-widest font-black bg-white border-3 border-clay-dark rounded-2xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sunny shadow-inner"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-terracotta-dark text-center animate-wiggle">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full clay-btn bg-sage text-white py-3 text-base shadow-clay"
            >
              Tasdiqlash
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
