import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Check } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { audio } from '../../services/audioService';

export default function ParentAuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4) {
      setError('PIN-kod 4 ta raqamdan iborat bo\'lishi shart!');
      audio.playWrong();
      return;
    }

    if (isRegister) {
      const newAuth = {
        id: 'parent_' + Date.now(),
        name: name || 'Ota-ona',
        email: email || 'otaona@kidedu.uz',
        pin: pin,
        isLoggedIn: true,
      };
      storageService.saveParentAuth(newAuth);
      audio.playCorrect();
      onLoginSuccess(newAuth);
      onClose();
    } else {
      const existing = storageService.getParentAuth();
      if (existing.pin === pin || pin === '1234') {
        audio.playCorrect();
        existing.isLoggedIn = true;
        storageService.saveParentAuth(existing);
        onLoginSuccess(existing);
        onClose();
      } else {
        setError('Noto\'g\'ri PIN-kod! (Standart demo PIN: 1234)');
        audio.playWrong();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay-dark/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-md bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg p-6 text-clay-dark">
        
        <button
          onClick={() => {
            audio.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-paper-200 hover:bg-paper-300 border-2 border-clay-dark rounded-xl shadow-clay-sm transition-all text-clay-dark"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-terracotta text-white rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-2xl">
            🛡️
          </div>
          <h2 className="text-2xl font-black text-clay-dark">
            {isRegister ? 'Ota-Ona Ro\'yxatdan O\'tish' : 'Ota-Ona Kirish'}
          </h2>
          <p className="text-xs text-clay/80 mt-1 font-semibold">
            Farzandingiz ta'limini boshqarish va xavfsizlik
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-clay-dark block mb-1">Ismingiz:</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-clay/50" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Dilnoza Karimova"
                    className="w-full bg-white border-2 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-clay-dark block mb-1">Email manzilingiz:</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-clay/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="otaona@misol.uz"
                    className="w-full bg-white border-2 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-clay-dark block mb-1">
              4 xonali PIN-kod {isRegister ? '(Yaratish)' : '(Standart demo: 1234)'}:
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-clay/50" />
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                className="w-full bg-white border-2 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-center text-xl tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-sunny"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-terracotta-dark text-center animate-wiggle">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full clay-btn bg-sage text-white py-3 text-sm font-black shadow-clay"
          >
            {isRegister ? 'Hisob Yaratish' : 'Kirish'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              audio.playPop();
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-terracotta font-bold underline hover:text-terracotta-dark"
          >
            {isRegister ? 'Menda hisob bor (Kirish)' : 'Yangi ota-ona hisobini yaratish'}
          </button>
        </div>

      </div>
    </div>
  );
}
