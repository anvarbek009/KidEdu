import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2, Heart, BookOpen, Calculator } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function AuthScreen({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    if (!pin || pin.length !== 4) {
      setError('4 xonali PIN-kodni to\'liq kiriting!');
      audio.playWrong();
      return;
    }

    const auth = storageService.getParentAuth();
    if (auth.pin === pin || pin === '1234') {
      audio.playLevelUp();
      audio.speakUzbek("Xush kelibsiz! Ta'lim olamiga kirmoqdamiz!");
      const updatedAuth = { ...auth, isLoggedIn: true };
      storageService.saveParentAuth(updatedAuth);
      onAuthSuccess(updatedAuth);
    } else {
      setError("Noto'g'ri PIN-kod! (Demo PIN: 1234)");
      audio.playWrong();
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting!");
      audio.playWrong();
      return;
    }

    if (!pin || pin.length !== 4) {
      setError("4 xonali maxsus PIN-kod yarating!");
      audio.playWrong();
      return;
    }

    const newAuth = {
      id: 'parent_' + Date.now(),
      name: name.trim(),
      email: email.trim() || 'otaona@kidedu.uz',
      pin: pin.trim(),
      isLoggedIn: true,
    };

    storageService.saveParentAuth(newAuth);
    audio.playLevelUp();
    audio.speakUzbek(`Xush kelibsiz, ${name}! Profil muvaffaqiyatli yaratildi!`);
    onAuthSuccess(newAuth);
  };

  const handleQuickDemoLogin = () => {
    audio.playPop();
    const auth = storageService.getParentAuth();
    auth.isLoggedIn = true;
    storageService.saveParentAuth(auth);
    audio.playLevelUp();
    audio.speakUzbek("Tezkor kirish amalga oshirildi! Marhamat!");
    onAuthSuccess(auth);
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden">
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 pointer-events-none animate-float">
        🌳
      </div>
      <div className="absolute top-20 right-14 text-6xl opacity-20 pointer-events-none animate-bounce-gentle">
        ☀️
      </div>
      <div className="absolute bottom-16 left-16 text-5xl opacity-20 pointer-events-none animate-wiggle">
        🍎
      </div>
      <div className="absolute bottom-12 right-20 text-5xl opacity-20 pointer-events-none animate-float">
        ⭐
      </div>

      {/* Top Header Logo */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 bg-sunny rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-2xl">
            🦊
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bubble font-black text-2xl sm:text-3xl text-terracotta tracking-tight">Kid</span>
              <span className="font-bubble font-black text-2xl sm:text-3xl text-sage tracking-tight">Edu</span>
              <span className="text-[10px] bg-sunny/40 text-clay-dark font-black px-2 py-0.5 rounded-full border border-clay-dark/30 ml-1">UZ</span>
            </div>
            <p className="text-xs text-clay/80 font-bold -mt-1">Bolalar uchun Quvnoq Ta'lim Olami</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-paper-50 border-2 border-clay-dark px-3 py-1.5 rounded-2xl shadow-clay-sm text-xs font-bold text-clay-dark">
          <Shield size={14} className="text-terracotta" />
          <span>Xavfsiz Oila Muhiti</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-4xl mx-auto w-full my-auto z-10 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Hero Welcome */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-sunny-soft border-2 border-clay-dark px-3.5 py-1.5 rounded-full shadow-clay-sm text-xs font-black text-clay-dark">
              <Sparkles size={14} className="text-sunny-dark animate-spin" />
              <span>5–10 yoshli bolalar uchun</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-clay-dark leading-tight">
              O'rganish — bu <span className="text-terracotta">quvnoq</span> sarguzasht!
            </h1>

            <p className="text-xs sm:text-sm font-bold text-clay/80 leading-relaxed max-w-md mx-auto lg:mx-0">
              O'zbek alifbosi, qiziqarli hisoblash o'yinlari, ovozli ertaklar va do'stimiz Doni bilan birga bilim oling.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto lg:mx-0 pt-2 text-left">
              <div className="bg-paper-50 border-2 border-clay-dark p-2.5 rounded-2xl shadow-clay-sm flex items-center gap-2">
                <span className="text-lg">🔤</span>
                <div>
                  <div className="text-xs font-black text-clay-dark">Lotin Alifbosi</div>
                  <div className="text-[10px] text-clay/70 font-semibold">Ovozli & Chizish</div>
                </div>
              </div>

              <div className="bg-paper-50 border-2 border-clay-dark p-2.5 rounded-2xl shadow-clay-sm flex items-center gap-2">
                <span className="text-lg">🔢</span>
                <div>
                  <div className="text-xs font-black text-clay-dark">Matematika</div>
                  <div className="text-[10px] text-clay/70 font-semibold">Sanash & Mantiq</div>
                </div>
              </div>
            </div>

            {/* Mascot Greeting */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <MascotDoni
                size="md"
                emotion="happy"
                speech="Salom! Ta'lim olamiga kirish uchun kiring yoki ro'yxatdan o'ting!"
              />
            </div>
          </div>

          {/* Right Auth Form Box */}
          <div className="lg:col-span-6">
            <div className="bg-paper-50 border-4 border-clay-dark rounded-3xl sm:rounded-4xl shadow-clay-lg p-6 sm:p-8">
              
              {/* Tabs: Kirish vs Ro'yxatdan O'tish */}
              <div className="flex gap-2 p-1.5 bg-paper-200 border-2.5 border-clay-dark rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    audio.playPop();
                    setIsRegister(false);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
                    !isRegister
                      ? 'bg-sunny text-clay-dark border-2 border-clay-dark shadow-clay-sm scale-[1.02]'
                      : 'text-clay/70 hover:text-clay-dark'
                  }`}
                >
                  Kirish (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.playPop();
                    setIsRegister(true);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
                    isRegister
                      ? 'bg-sunny text-clay-dark border-2 border-clay-dark shadow-clay-sm scale-[1.02]'
                      : 'text-clay/70 hover:text-clay-dark'
                  }`}
                >
                  Ro'yxatdan O'tish
                </button>
              </div>

              {!isRegister ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-black text-clay-dark">Oila Kabinetiga Kirish</h2>
                    <p className="text-xs text-clay/70 font-bold mt-0.5">
                      Standart demo PIN-kod: <strong className="text-terracotta bg-terracotta-soft px-1.5 py-0.5 rounded border border-terracotta/30">1234</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1.5 text-center">
                      4 xonali ota-ona PIN-kodini kiriting:
                    </label>
                    <div className="relative max-w-[200px] mx-auto">
                      <Lock size={18} className="absolute left-3.5 top-3.5 text-clay/50" />
                      <input
                        type="password"
                        maxLength={4}
                        autoFocus
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="• • • •"
                        className="w-full bg-white border-3 border-clay-dark rounded-2xl py-2.5 pl-10 pr-3 text-center text-2xl tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-sunny shadow-inner"
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
                    className="w-full clay-btn bg-sage hover:bg-sage-dark text-white py-3.5 text-sm sm:text-base font-black shadow-clay flex items-center justify-center gap-2"
                  >
                    <span>Ta'lim Olamiga Kirish</span>
                    <ArrowRight size={18} />
                  </button>

                  {/* 1-Click Quick Demo Login Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoLogin}
                      className="w-full clay-btn bg-sunny-soft hover:bg-sunny text-clay-dark py-2.5 text-xs font-black border-2 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={15} className="text-terracotta" />
                      <span>1-Bosishda Tezkor Demo Kirish (Azizbek & Madina)</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="text-center mb-1">
                    <h2 className="text-xl font-black text-clay-dark">Yangi Oila Profilini Yaratish</h2>
                    <p className="text-xs text-clay/70 font-bold mt-0.5">
                      Ota-ona ma'lumotlarini kiriting
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1">Ismingiz (Ota-ona):</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-clay/50" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masalan: Nodira Karimova"
                        className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1">Email (Ixtiyoriy):</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-clay/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="oila@kidedu.uz"
                        className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1">
                      Xavfsizlik PIN-kodi (4 raqam):
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-clay/50" />
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Masalan: 5566"
                        className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-center text-lg tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-sunny"
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
                    className="w-full clay-btn bg-terracotta hover:bg-terracotta-dark text-white py-3.5 text-sm sm:text-base font-black shadow-clay flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Hisobni Yaratish & Boshlash</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-[11px] font-bold text-clay/60 z-10 py-2">
        KidEdu © 2026 • 5–10 yoshli bolalar uchun interaktiv o'zbek ta'lim tizimi
      </footer>

    </div>
  );
}
