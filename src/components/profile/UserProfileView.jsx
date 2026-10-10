import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Flame, 
  Award, 
  ShoppingBag, 
  BookOpen, 
  Calculator, 
  ArrowLeft,
  Users,
  CheckCircle2,
  Calendar,
  BarChart3,
  TrendingUp,
  History,
  Target
} from 'lucide-react';
import { storageService, FIFTEEN_DAYS_MS } from '../../services/storageService';
import { audio } from '../../services/audioService';

export default function UserProfileView({
  activeChild,
  currentUser,
  childrenList,
  onBack,
  onLogout,
  onOpenProfileSelector,
  onOpenBadges,
  onOpenShop
}) {
  const sessionInfo = storageService.getSessionInfo();
  const lastActiveDateStr = sessionInfo.lastActive 
    ? new Date(sessionInfo.lastActive).toLocaleString('uz-UZ')
    : new Date().toLocaleString('uz-UZ');
    
  // Calculate days remaining
  const msRemaining = Math.max(0, (sessionInfo.expiresAt || (Date.now() + FIFTEEN_DAYS_MS)) - Date.now());
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  // XP & Level calculations
  const currentLevel = activeChild?.level || 1;
  const currentXp = activeChild?.xp || 0;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 50;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 50;
  const progressInLevel = Math.min(100, Math.max(0, ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel || 50)) * 100));

  // Progress counts
  const mathDone = activeChild?.completedLessons?.math?.length || 0;
  const alphabetDone = activeChild?.completedLessons?.alphabet?.length || 0;
  const storiesDone = activeChild?.completedLessons?.stories?.length || 0;
  const totalCompleted = mathDone + alphabetDone + storiesDone;

  // Learning analytics from logs
  const logs = storageService.getLogs(activeChild?.id);
  const totalLogs = logs.length;
  const totalScore = logs.reduce((acc, l) => acc + (l.score || 0), 0);
  const totalPossible = logs.reduce((acc, l) => acc + (l.total || 0), 0);
  const accuracyRate = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : (totalLogs > 0 ? 95 : 100);

  const totalDurationSeconds = logs.reduce((acc, l) => acc + (l.durationSeconds || 120), 0);
  const totalMinutes = Math.max(5, Math.round(totalDurationSeconds / 60));

  return (
    <div className="py-4 px-3 sm:px-6 max-w-5xl mx-auto space-y-6 animate-pop-in select-none">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-50 p-4 rounded-3xl border-3 border-clay-dark shadow-clay-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playPop();
              onBack();
            }}
            className="clay-btn bg-paper-200 text-clay-dark text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5 font-bold min-h-[44px]"
          >
            <ArrowLeft size={16} />
            <span>Xaritaga Qaytish</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👤✨</span>
              <h1 className="text-xl sm:text-2xl font-black text-clay-dark">Mening Profilim</h1>
            </div>
            <p className="text-xs text-clay/80 font-bold hidden sm:block">
              Ta'lim yutuqlari, barcha statistikalar va hisob ma'lumotlari
            </p>
          </div>
        </div>

        {/* Back to map button on right */}
        <button
          onClick={() => {
            audio.playPop();
            onBack();
          }}
          className="clay-btn bg-sunny text-clay-dark px-3.5 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 min-h-[44px]"
        >
          <span>Darslarga O'tish</span>
          <Sparkles size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Child Card & Profile Info */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Active Child Hero Card */}
          <div className="bg-white border-4 border-clay-dark rounded-3xl p-6 shadow-clay space-y-5 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 text-7xl opacity-10 select-none pointer-events-none">
              🌟
            </div>

            <div className="w-24 h-24 mx-auto rounded-3xl bg-sunny border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-5xl">
              {activeChild?.avatar || '🦊'}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black text-clay-dark">{activeChild?.name || 'Bilimdon'}</h2>
                <span className="text-xs bg-skywood/30 text-clay-dark font-black px-2 py-0.5 rounded-full border border-clay-dark/20">
                  {activeChild?.ageGroup || '7-8'} yosh
                </span>
              </div>
              <p className="text-xs text-clay/70 font-bold mt-1">
                Hamroh do'st: <strong>{activeChild?.mascotName || 'Doni'}</strong>
              </p>
            </div>

            {/* Level & XP bar */}
            <div className="bg-paper-100 p-3.5 rounded-2xl border-2 border-clay-dark space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-clay-dark">
                <span className="text-terracotta">{currentLevel}-daraja</span>
                <span>{currentXp} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-paper-300 rounded-full border border-clay-dark/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sunny to-terracotta rounded-full transition-all duration-500"
                  style={{ width: `${progressInLevel}%` }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-sunny-soft p-3 rounded-2xl border-2 border-clay-dark shadow-clay-sm flex items-center gap-2.5">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-[10px] text-clay/70 font-black">Yulduzli Tangalar</div>
                  <div className="text-lg font-black text-clay-dark">{activeChild?.coins || 0}</div>
                </div>
              </div>

              <div className="bg-terracotta-soft p-3 rounded-2xl border-2 border-clay-dark shadow-clay-sm flex items-center gap-2.5">
                <Flame size={24} className="text-terracotta fill-terracotta animate-pulse" />
                <div>
                  <div className="text-[10px] text-clay/70 font-black">Kunlik Ketma-ketlik</div>
                  <div className="text-lg font-black text-terracotta-dark">{activeChild?.streak || 1} kun</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  audio.playPop();
                  onOpenProfileSelector();
                }}
                className="flex-1 clay-btn bg-paper-200 hover:bg-paper-300 text-clay-dark text-xs py-2.5 font-black flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Users size={14} />
                <span>Profilni Almashtirish</span>
              </button>
              
              <button
                onClick={() => {
                  audio.playPop();
                  onOpenShop();
                }}
                className="clay-btn bg-sunny hover:bg-sunny-dark text-clay-dark text-xs px-3.5 py-2.5 font-black flex items-center gap-1 min-h-[44px]"
              >
                <ShoppingBag size={14} />
                <span>Do'kon</span>
              </button>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="bg-paper-50 border-3 border-clay-dark rounded-3xl p-5 shadow-clay-sm space-y-3">
            <h3 className="text-sm font-black text-clay-dark flex items-center gap-2">
              <User size={16} className="text-terracotta" />
              <span>Hisob Ma'lumotlari</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-clay-dark/20">
                <span className="font-bold text-clay/70">Ism:</span>
                <span className="font-black text-clay-dark">{currentUser?.name || activeChild?.name || 'Foydalanuvchi'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-clay-dark/20">
                <span className="font-bold text-clay/70">Email:</span>
                <span className="font-black text-clay-dark">{currentUser?.email || 'kidedu@foydalanuvchi.uz'}</span>
              </div>
            </div>
          </div>

          {/* 15-Day Inactivity Session Card */}
          <div className="bg-gradient-to-r from-sunny-soft via-paper-50 to-sage-soft border-3 border-clay-dark rounded-3xl p-4 sm:p-5 shadow-clay-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sage text-white rounded-xl border border-clay-dark shadow-clay-sm">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-clay-dark">Xavfsiz Sessiya (15 Kun)</h3>
                  <p className="text-[11px] text-clay/70 font-semibold">
                    15 kunlik nofaollikdan so'ng avtomatik tugaydi
                  </p>
                </div>
              </div>

              <span className="bg-sage text-white text-[11px] font-black px-2.5 py-1 rounded-xl border border-clay-dark">
                Faol
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white/80 p-2.5 rounded-xl border border-clay-dark/20">
                <div className="text-[10px] text-clay/70 font-bold">So'nggi faollik:</div>
                <div className="font-black text-clay-dark mt-0.5">{lastActiveDateStr}</div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-clay-dark/20">
                <div className="text-[10px] text-clay/70 font-bold">Qolgan muddat:</div>
                <div className="font-black text-terracotta mt-0.5">{daysRemaining} kun</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: All Learning Statistics, Subject Breakdown & History Logs */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Main Learning Statistics Cards */}
          <div className="bg-white border-4 border-clay-dark rounded-3xl p-5 sm:p-6 shadow-clay space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-clay-dark flex items-center gap-2">
                <BarChart3 size={20} className="text-terracotta" />
                <span>Barcha Ta'lim Statistikasi</span>
              </h3>
              <span className="text-xs font-black bg-sunny-soft px-3 py-1 rounded-xl border border-clay-dark/30">
                Jami: {totalCompleted} ta dars
              </span>
            </div>

            {/* 4 Summary Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark text-center">
                <div className="text-2xl font-black text-terracotta">{accuracyRate}%</div>
                <div className="text-[10px] font-bold text-clay/70 mt-0.5">To'g'rilik Foizi</div>
              </div>

              <div className="bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark text-center">
                <div className="text-2xl font-black text-sage">{totalMinutes} daq</div>
                <div className="text-[10px] font-bold text-clay/70 mt-0.5">O'rganish Vaqti</div>
              </div>

              <div className="bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark text-center">
                <div className="text-2xl font-black text-skywood-dark">{totalLogs} ta</div>
                <div className="text-[10px] font-bold text-clay/70 mt-0.5">Mashg'ulotlar</div>
              </div>

              <div className="bg-paper-100 p-3 rounded-2xl border-2 border-clay-dark text-center">
                <div className="text-2xl font-black text-plum">{currentXp} XP</div>
                <div className="text-[10px] font-bold text-clay/70 mt-0.5">Umumiy Ball</div>
              </div>
            </div>

            {/* Subject Breakdown Details */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-clay-dark uppercase tracking-wider">
                Fanlar Bo'yicha Progress:
              </h4>

              {/* Math */}
              <div className="bg-paper-50 p-3.5 rounded-2xl border-2 border-clay-dark space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-1.5">
                    <span>🏰🔢</span>
                    <span>Matematika (Raqamlar Qasri)</span>
                  </div>
                  <span className="text-terracotta">{mathDone} ta dars yakunlandi</span>
                </div>
                <div className="w-full h-2.5 bg-paper-200 rounded-full border border-clay-dark/30 overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, (mathDone / 50) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Alphabet */}
              <div className="bg-paper-50 p-3.5 rounded-2xl border-2 border-clay-dark space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-1.5">
                    <span>🌲🔤</span>
                    <span>Alifbo & O'qish (Alifbo O'rmoni)</span>
                  </div>
                  <span className="text-sage">{alphabetDone} ta dars yakunlandi</span>
                </div>
                <div className="w-full h-2.5 bg-paper-200 rounded-full border border-clay-dark/30 overflow-hidden">
                  <div
                    className="h-full bg-sage rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, (alphabetDone / 50) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Stories */}
              <div className="bg-paper-50 p-3.5 rounded-2xl border-2 border-clay-dark space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-1.5">
                    <span>📖✨</span>
                    <span>Sehrli Kitobxonlik (Ertaklar)</span>
                  </div>
                  <span className="text-plum">{storiesDone} ta ertak o'qildi</span>
                </div>
                <div className="w-full h-2.5 bg-paper-200 rounded-full border border-clay-dark/30 overflow-hidden">
                  <div
                    className="h-full bg-plum rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, (storiesDone / 50) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badges Showcase */}
          <div className="bg-white border-3 border-clay-dark rounded-3xl p-5 sm:p-6 shadow-clay space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-clay-dark flex items-center gap-2">
                <Award size={18} className="text-terracotta" />
                <span>Yutuqlar va Medallar</span>
              </h3>
              <button
                onClick={() => {
                  audio.playPop();
                  onOpenBadges();
                }}
                className="text-xs text-terracotta font-black underline hover:text-terracotta-dark"
              >
                Barchasini ko'rish
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(activeChild?.unlockedBadges || ['first_step']).map((badgeKey) => (
                <div
                  key={badgeKey}
                  className="bg-paper-50 border-2 border-clay-dark px-3 py-1.5 rounded-2xl shadow-clay-sm flex items-center gap-1.5 text-xs font-black text-clay-dark"
                >
                  <span>🏅</span>
                  <span className="capitalize">{badgeKey.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Activity Logs History */}
          <div className="bg-white border-3 border-clay-dark rounded-3xl p-5 sm:p-6 shadow-clay space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-clay-dark flex items-center gap-2">
                <History size={18} className="text-skywood-dark" />
                <span>So'nggi Mashg'ulotlar Tarixi</span>
              </h3>
              <span className="text-xs text-clay/60 font-bold">{logs.length} ta yozuv</span>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {logs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 bg-paper-50 rounded-xl border border-clay-dark/20 text-xs"
                  >
                    <div>
                      <div className="font-black text-clay-dark">{log.topic}</div>
                      <div className="text-[10px] text-clay/60 capitalize font-bold">
                        {log.subject} • {new Date(log.timestamp).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-sage text-white font-black px-2 py-0.5 rounded-lg text-[10px]">
                        +{log.xpEarned} XP
                      </span>
                      <div className="text-[10px] font-bold text-clay/70 mt-0.5">
                        Natija: {log.score}/{log.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-clay/60 font-bold text-center py-4">
                Hali mashg'ulotlar boshlanmagan. Birinchi darsni boshlang va bu yerda natijalaringiz aks etadi!
              </p>
            )}
          </div>

          {/* THE SINGLE LOGOUT BUTTON AT THE VERY BOTTOM OF PROFILE PAGE */}
          <div className="bg-paper-50 border-4 border-clay-dark rounded-3xl p-5 sm:p-6 shadow-clay flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-black text-clay-dark">Hisobdan Chiqish</h4>
              <p className="text-xs text-clay/70 font-bold mt-0.5">
                Barcha yutuqlaringiz, tangalaringiz va darslar progressi xavfsiz saqlanadi.
              </p>
            </div>

            <button
              onClick={() => {
                audio.playWrong();
                if (window.confirm("Haqiqatan ham hisobdan chiqmoqchimisiz?")) {
                  onLogout();
                }
              }}
              className="clay-btn bg-terracotta hover:bg-terracotta-dark text-white px-8 py-3.5 font-black text-sm flex items-center justify-center gap-2 shadow-clay min-w-[180px] min-h-[48px]"
            >
              <LogOut size={18} />
              <span>Chiqish (Logout)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
