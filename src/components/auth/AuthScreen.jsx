import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Baby
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function AuthScreen({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAgeGroup, setChildAgeGroup] = useState('7-8');
  const [childAvatar, setChildAvatar] = useState('🦊');

  const avatarOptions = [
    { emoji: '🦊', label: 'Tulki Doni' },
    { emoji: '🐰', label: 'Quyonvoy' },
    { emoji: '🐻', label: 'Ayiqcha' },
    { emoji: '🦁', label: 'Shercha' },
    { emoji: '🐼', label: 'Panda' },
  ];

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail) {
      setError('Iltimos, email manzilingizni kiriting!');
      audio.playWrong();
      return;
    }

    if (!trimmedPass) {
      setError('Iltimos, parolingizni kiriting!');
      audio.playWrong();
      return;
    }

    if (trimmedPass.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
      audio.playWrong();
      return;
    }

    setIsLoading(true);
    try {
      const result = await storageService.login({
        email: trimmedEmail,
        password: trimmedPass
      });

      audio.playLevelUp();
      onAuthSuccess(result);
    } catch (err) {
      setError(err.message || "Noto'g'ri email yoki parol!");
      audio.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting!");
      audio.playWrong();
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError("To'g'ri email manzilini kiriting!");
      audio.playWrong();
      return;
    }

    if (!password || password.trim().length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
      audio.playWrong();
      return;
    }

    if (!childName.trim()) {
      setError("Farzandingiz ismini kiriting!");
      audio.playWrong();
      return;
    }

    setIsLoading(true);
    try {
      const result = await storageService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        childName: childName.trim(),
        childAgeGroup,
        childAvatar,
        childMascot: childAvatar === '🦊' ? 'Doni' : childAvatar === '🐰' ? 'Quyonvoy' : 'Bilimdon'
      });

      audio.playLevelUp();
      onAuthSuccess(result);
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi!");
      audio.playWrong();
    } finally {
      setIsLoading(false);
    }
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
          <span>Xavfsiz Ta'lim Muhiti</span>
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
                  <div className="text-[10px] text-clay/70 font-semibold">50 ta Qiziqarli Dars</div>
                </div>
              </div>
            </div>

            {/* Mascot Greeting */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <MascotDoni
                size="md"
                emotion="happy"
                speech="Salom! Ta'lim olamiga kirish uchun kiring yoki yangi hisob oching!"
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
                    <h2 className="text-xl font-black text-clay-dark">Hisobga Kirish</h2>
                    <p className="text-xs text-clay/70 font-bold mt-0.5">
                      Email va parolingizni kiritib shaxsiy profilingizga kiring
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1">
                      Email manzil:
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-clay/50" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@misol.uz"
                        className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-clay-dark block mb-1">
                      Parol (kamida 8 ta belgi):
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-clay/50" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny shadow-inner"
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
                    disabled={isLoading}
                    className="w-full clay-btn bg-sage hover:bg-sage-dark text-white py-3.5 text-sm sm:text-base font-black shadow-clay flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Ta'lim Olamiga Kirish</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="text-center mb-1">
                    <h2 className="text-xl font-black text-clay-dark">Yangi Hisob Ochish</h2>
                    <p className="text-xs text-clay/70 font-bold mt-0.5">
                      0 tanga va 1-darsdan yangi alohida profil bilan boshlaysiz!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-black text-clay-dark block mb-1">Ism:</label>
                      <div className="relative">
                        <User size={14} className="absolute left-2.5 top-2.5 text-clay/50" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nodira Karimova"
                          className="w-full bg-white border-2 border-clay-dark rounded-xl py-1.5 pl-8 pr-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-clay-dark block mb-1">Email:</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-2.5 top-2.5 text-clay/50" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nodira@gmail.com"
                          className="w-full bg-white border-2 border-clay-dark rounded-xl py-1.5 pl-8 pr-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-black text-clay-dark block mb-1">Farzand Ismi:</label>
                      <div className="relative">
                        <Baby size={14} className="absolute left-2.5 top-2.5 text-clay/50" />
                        <input
                          type="text"
                          required
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="Ali"
                          className="w-full bg-white border-2 border-clay-dark rounded-xl py-1.5 pl-8 pr-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-clay-dark block mb-1">
                        Parol (kamida 8 ta):
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-2.5 top-2.5 text-clay/50" />
                        <input
                          type="password"
                          minLength={8}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Kamida 8 belgi"
                          className="w-full bg-white border-2 border-clay-dark rounded-xl py-1.5 pl-8 pr-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Age Group Selection */}
                  <div>
                    <label className="text-[11px] font-black text-clay-dark block mb-1">Yosh Guruhi:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['5-6', '7-8', '9-10'].map((age) => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setChildAgeGroup(age)}
                          className={`py-1 text-xs font-black rounded-xl border-2 transition-all ${
                            childAgeGroup === age
                              ? 'bg-sunny text-clay-dark border-clay-dark shadow-clay-sm'
                              : 'bg-white text-clay/70 border-clay-dark/30'
                          }`}
                        >
                          {age} yosh
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mascot Avatar Selection */}
                  <div>
                    <label className="text-[11px] font-black text-clay-dark block mb-1">Qahramon Tanlang:</label>
                    <div className="flex justify-between gap-1">
                      {avatarOptions.map((av) => (
                        <button
                          key={av.emoji}
                          type="button"
                          onClick={() => setChildAvatar(av.emoji)}
                          className={`flex-1 p-1 text-xl rounded-xl border-2 transition-all ${
                            childAvatar === av.emoji
                              ? 'bg-sunny border-clay-dark shadow-clay-sm scale-110'
                              : 'bg-white border-clay-dark/30 hover:bg-paper-100'
                          }`}
                          title={av.label}
                        >
                          {av.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-bold text-terracotta-dark text-center animate-wiggle">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full clay-btn bg-terracotta hover:bg-terracotta-dark text-white py-3 text-sm sm:text-base font-black shadow-clay flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Hisobni Yaratish & Boshlash (0 Tanga)</span>
                      </>
                    )}
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
