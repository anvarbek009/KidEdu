import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Clock, 
  Target, 
  Flame, 
  BookOpen, 
  Calculator, 
  Award, 
  Users, 
  Settings, 
  RotateCcw, 
  Download, 
  Edit3, 
  Check, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { audio } from '../../services/audioService';

export default function ParentDashboard({
  isOpen,
  onClose,
  childrenList,
  activeChildId,
  onSelectChild,
  onDataUpdated,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'children', 'settings'
  const [editingChild, setEditingChild] = useState(null);
  const [pinChangeVal, setPinChangeVal] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  if (!isOpen) return null;

  const currentChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];
  const logs = storageService.getLogs(currentChild?.id);

  // Compute analytics
  const totalLogs = logs.length;
  const totalScore = logs.reduce((acc, l) => acc + (l.score || 0), 0);
  const totalPossible = logs.reduce((acc, l) => acc + (l.total || 0), 0);
  const accuracyRate = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;

  const totalDurationSeconds = logs.reduce((acc, l) => acc + (l.durationSeconds || 120), 0);
  const totalMinutes = Math.round(totalDurationSeconds / 60);

  // Subject breakdown
  const mathLogs = logs.filter(l => l.subject === 'matematika');
  const mathScore = mathLogs.reduce((acc, l) => acc + (l.score || 0), 0);
  const mathPossible = mathLogs.reduce((acc, l) => acc + (l.total || 0), 0);
  const mathAcc = mathPossible > 0 ? Math.round((mathScore / mathPossible) * 100) : 92;

  const readLogs = logs.filter(l => l.subject === 'alifbo' || l.subject === 'o\'qish');
  const readScore = readLogs.reduce((acc, l) => acc + (l.score || 0), 0);
  const readPossible = readLogs.reduce((acc, l) => acc + (l.total || 0), 0);
  const readAcc = readPossible > 0 ? Math.round((readScore / readPossible) * 100) : 95;

  const handleUpdateChildSettings = (childId, updates) => {
    storageService.updateActiveChild(updates);
    audio.playPop();
    setEditingChild(null);
    onDataUpdated();
  };

  const handleExportData = () => {
    const data = {
      children: storageService.getChildren(),
      logs: storageService.getLogs(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KidEdu_Progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    audio.playCorrect();
  };

  const handleResetData = () => {
    if (window.confirm("Barcha dars ma'lumotlari va taraqqiyotni qayta o'rnatishni (reset) xohlaysizmi?")) {
      storageService.resetAllData();
      audio.playPop();
      onDataUpdated();
      onClose();
    }
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (pinChangeVal.length === 4) {
      const auth = storageService.getParentAuth();
      auth.pin = pinChangeVal;
      storageService.saveParentAuth(auth);
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 2500);
      setPinChangeVal('');
      audio.playCorrect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay-dark/70 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-4xl bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-paper-200 border-b-3 border-clay-dark p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta text-white rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-clay-dark leading-tight">
                Ota-Ona Nazorati & Tahlil
              </h2>
              <p className="text-xs text-clay/80 font-bold">
                Bolaning o'zlashtirish darajasi va xavfsizlik sozlamalari
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playPop();
              onClose();
            }}
            className="p-2 bg-paper-100 hover:bg-white border-2 border-clay-dark rounded-xl shadow-clay-sm transition-all text-clay-dark"
          >
            <X size={20} />
          </button>
        </div>

        {/* Child Selector Tabs Bar */}
        <div className="bg-paper-100 px-4 sm:px-6 py-2.5 border-b-2 border-clay-dark/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-clay/80">Faol bola:</span>
            <div className="flex gap-1.5">
              {childrenList.map(child => (
                <button
                  key={child.id}
                  onClick={() => {
                    audio.playPop();
                    onSelectChild(child.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-clay-dark transition-all flex items-center gap-1.5 ${
                    child.id === currentChild?.id
                      ? 'bg-sunny text-clay-dark shadow-clay-sm scale-105'
                      : 'bg-white text-clay/70 hover:bg-paper-200'
                  }`}
                >
                  <span>{child.avatar}</span>
                  <span>{child.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-1.5 bg-paper-200 p-1 border-2 border-clay-dark rounded-2xl">
            <button
              onClick={() => {
                audio.playPop();
                setActiveTab('analytics');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                activeTab === 'analytics' ? 'bg-sage text-white shadow-clay-sm' : 'text-clay/70 hover:text-clay-dark'
              }`}
            >
              <BarChart3 size={14} />
              <span>Natijalar</span>
            </button>
            <button
              onClick={() => {
                audio.playPop();
                setActiveTab('children');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                activeTab === 'children' ? 'bg-sage text-white shadow-clay-sm' : 'text-clay/70 hover:text-clay-dark'
              }`}
            >
              <Users size={14} />
              <span>Profil Sozlamalari</span>
            </button>
            <button
              onClick={() => {
                audio.playPop();
                setActiveTab('settings');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                activeTab === 'settings' ? 'bg-sage text-white shadow-clay-sm' : 'text-clay/70 hover:text-clay-dark'
              }`}
            >
              <Settings size={14} />
              <span>Tizim</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ANALYTICS & STATS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Top 4 Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-skywood-soft text-skywood-dark rounded-xl border-2 border-clay-dark flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div className="text-2xl font-black text-clay-dark">{totalMinutes} daqiqa</div>
                  <div className="text-[11px] font-bold text-clay/70 mt-0.5">O'rganish Vaqti</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-sage-soft text-sage-dark rounded-xl border-2 border-clay-dark flex items-center justify-center">
                    <Target size={20} />
                  </div>
                  <div className="text-2xl font-black text-sage-dark">{accuracyRate}%</div>
                  <div className="text-[11px] font-bold text-clay/70 mt-0.5">O'rtacha Aniqlik</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-terracotta-soft text-terracotta rounded-xl border-2 border-clay-dark flex items-center justify-center">
                    <Flame size={20} />
                  </div>
                  <div className="text-2xl font-black text-terracotta-dark">{currentChild?.streak || 1} kun</div>
                  <div className="text-[11px] font-bold text-clay/70 mt-0.5">Darslar Ketma-ketligi</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-sunny-soft text-sunny-dark rounded-xl border-2 border-clay-dark flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div className="text-2xl font-black text-sunny-dark">{currentChild?.xp || 0} XP</div>
                  <div className="text-[11px] font-bold text-clay/70 mt-0.5">{currentChild?.level || 1}-Daraja</div>
                </div>

              </div>

              {/* Subject Breakdown Progress Bars */}
              <div className="bg-white p-5 rounded-2xl border-3 border-clay-dark shadow-clay-sm">
                <h3 className="text-base font-black text-clay-dark mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-terracotta" />
                  Fanlar bo'yicha o'zlashtirish darajasi
                </h3>

                <div className="space-y-4">
                  {/* Math Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-clay-dark">
                        <Calculator size={15} className="text-terracotta" />
                        Matematika (Hisoblash va Mantiq)
                      </span>
                      <span className="text-terracotta font-black">{mathAcc}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-paper-200 rounded-full border-2 border-clay-dark overflow-hidden">
                      <div
                        className="h-full bg-terracotta rounded-full transition-all duration-500"
                        style={{ width: `${mathAcc}%` }}
                      />
                    </div>
                  </div>

                  {/* Alphabet / Reading Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-clay-dark">
                        <BookOpen size={15} className="text-sage" />
                        Alifbo va Savodxonlik (O'qish & Yozish)
                      </span>
                      <span className="text-sage font-black">{readAcc}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-paper-200 rounded-full border-2 border-clay-dark overflow-hidden">
                      <div
                        className="h-full bg-sage rounded-full transition-all duration-500"
                        style={{ width: `${readAcc}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations / Insights for Parents */}
              <div className="bg-sunny-soft border-3 border-clay-dark rounded-2xl p-4 flex items-start gap-3">
                <div className="text-2xl mt-0.5">💡</div>
                <div>
                  <h4 className="text-sm font-black text-clay-dark">Pedagogik Tavsiya:</h4>
                  <p className="text-xs font-semibold text-clay-dark/90 mt-0.5 leading-relaxed">
                    {currentChild?.name} matematikada ajoyib natijalar ko'rsatmoqda! Harf yozish mashqlarini ko'proq barmoq bilan chizish bo'limida takrorlash uning savodxonligini yanada mustahkamlaydi.
                  </p>
                </div>
              </div>

              {/* Recent Activity Log Table */}
              <div className="bg-white p-5 rounded-2xl border-3 border-clay-dark shadow-clay-sm">
                <h3 className="text-base font-black text-clay-dark mb-3">So'nggi Darslar Tarixi</h3>
                {logs.length === 0 ? (
                  <p className="text-xs text-clay/70 font-semibold py-4 text-center">Hali darslar bajarilmagan.</p>
                ) : (
                  <div className="divide-y-2 divide-paper-200">
                    {logs.slice(0, 6).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {log.subject === 'matematika' ? '🔢' : log.subject === 'alifbo' ? '🔤' : '📖'}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-clay-dark">{log.topic}</div>
                            <div className="text-[10px] text-clay/60 font-semibold">
                              {new Date(log.timestamp).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {Math.round((log.durationSeconds || 120) / 60)} daqiqa
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-block bg-sage-soft text-sage-dark border border-sage/40 px-2 py-0.5 rounded-md text-xs font-black">
                            {log.score}/{log.total} ({Math.round((log.score / log.total) * 100)}%)
                          </span>
                          <div className="text-[10px] text-sunny-dark font-extrabold mt-0.5">
                            +{log.xpEarned} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: CHILD PROFILE SETTINGS */}
          {activeTab === 'children' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-clay-dark">Bolalar Profillarini Boshqarish</h3>

              {childrenList.map((child) => (
                <div key={child.id} className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl bg-paper-200 p-2 rounded-2xl border-2 border-clay-dark/20">
                      {child.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-clay-dark">{child.name}</h4>
                        <span className="text-xs bg-sunny/40 text-clay-dark font-bold px-2 py-0.5 rounded-md border border-clay-dark/20">
                          {child.ageGroup} yosh
                        </span>
                      </div>
                      <p className="text-xs text-clay/70 font-semibold">
                        Kunlik limit: {child.dailyTimeLimitMinutes || 30} daqiqa • {child.xp} XP to'plangan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingChild(child)}
                      className="clay-btn bg-paper-200 hover:bg-paper-300 text-clay-dark text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <Edit3 size={13} />
                      <span>Tahrirlash</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Edit Modal In-place */}
              {editingChild && (
                <div className="bg-paper-100 p-4 rounded-2xl border-3 border-clay-dark shadow-clay mt-4 space-y-3">
                  <h4 className="text-sm font-black text-clay-dark">
                    "{editingChild.name}" profilini tahrirlash:
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-clay-dark block mb-1">Ism:</label>
                      <input
                        type="text"
                        value={editingChild.name}
                        onChange={(e) => setEditingChild({ ...editingChild, name: e.target.value })}
                        className="w-full bg-white border-2 border-clay-dark rounded-xl p-2 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-clay-dark block mb-1">Yosh guruhi:</label>
                      <select
                        value={editingChild.ageGroup}
                        onChange={(e) => setEditingChild({ ...editingChild, ageGroup: e.target.value })}
                        className="w-full bg-white border-2 border-clay-dark rounded-xl p-2 text-xs font-bold"
                      >
                        <option value="5-6">5-6 yosh (Kichkintoylar)</option>
                        <option value="7-8">7-8 yosh (Bilimdonlar)</option>
                        <option value="9-10">9-10 yosh (Chempionlar)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-clay-dark block mb-1">
                      Kunlik o'rganish vaqti chegarasi (Daqiqa):
                    </label>
                    <div className="flex gap-2">
                      {[15, 30, 45, 60, 0].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setEditingChild({ ...editingChild, dailyTimeLimitMinutes: mins })}
                          className={`py-1.5 px-2.5 text-xs font-bold rounded-xl border-2 border-clay-dark transition-all ${
                            editingChild.dailyTimeLimitMinutes === mins
                              ? 'bg-sunny text-clay-dark shadow-clay-sm'
                              : 'bg-white text-clay/70'
                          }`}
                        >
                          {mins === 0 ? 'Cheksiz' : `${mins} daq`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingChild(null)}
                      className="py-1.5 px-3 bg-paper-200 text-xs font-bold rounded-xl border-2 border-clay-dark"
                    >
                      Bekor qilish
                    </button>
                    <button
                      onClick={() => handleUpdateChildSettings(editingChild.id, editingChild)}
                      className="clay-btn bg-sage text-white text-xs px-4 py-1.5 font-bold"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & DATA CONTROL */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Change PIN Box */}
              <div className="bg-white p-5 rounded-2xl border-3 border-clay-dark shadow-clay-sm">
                <h3 className="text-sm font-black text-clay-dark mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-sage" />
                  Ota-Ona PIN-kodini O'zgartirish
                </h3>
                <p className="text-xs text-clay/70 font-semibold mb-3">
                  Bolalar ruxsatsiz sozlamalarga kirmasligi uchun 4 xonali yangi PIN kiriting.
                </p>

                <form onSubmit={handleSavePin} className="flex items-center gap-3">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinChangeVal}
                    onChange={(e) => setPinChangeVal(e.target.value)}
                    placeholder="Yangi PIN (4 raqam)"
                    className="w-44 bg-paper-100 border-2.5 border-clay-dark rounded-xl p-2 text-center text-sm font-bold"
                  />
                  <button
                    type="submit"
                    disabled={pinChangeVal.length !== 4}
                    className="clay-btn bg-terracotta disabled:opacity-50 text-white text-xs px-4 py-2 font-bold"
                  >
                    PINni Yangilash
                  </button>
                </form>
                {pinSuccess && (
                  <p className="text-xs font-bold text-sage-dark mt-2 flex items-center gap-1">
                    <Check size={14} /> PIN-kod muvaffaqiyatli saqlandi!
                  </p>
                )}
              </div>

              {/* Export & Reset Data */}
              <div className="bg-white p-5 rounded-2xl border-3 border-clay-dark shadow-clay-sm space-y-4">
                <h3 className="text-sm font-black text-clay-dark">Ma'lumotlar & Zaxira Nusxasi</h3>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportData}
                    className="clay-btn bg-skywood text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
                  >
                    <Download size={16} />
                    <span>Natijalarni Yuklab Olish (JSON)</span>
                  </button>

                  <button
                    onClick={handleResetData}
                    className="clay-btn bg-paper-200 text-terracotta-dark text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
                  >
                    <RotateCcw size={16} />
                    <span>Barcha Ma'lumotlarni Qayta O'rnatish</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        audio.playPop();
                        onLogout();
                        onClose();
                      }}
                      className="clay-btn bg-terracotta text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
                    >
                      <ShieldCheck size={16} />
                      <span>Profildan Chiqish (Log out)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
