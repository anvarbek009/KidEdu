import React, { useState } from 'react';
import { X, Plus, Check, User, Sparkles, Smile } from 'lucide-react';
import { audio } from '../../services/audioService';

const AVATAR_OPTIONS = ['🦊', '🐰', '🦁', '🦉', '🐻', '🐼', '🐯', '🦄', '🚀', '⭐'];
const MASCOT_OPTIONS = [
  { id: 'Doni', name: 'Doni (Aqlli Tulki)', icon: '🦊' },
  { id: 'Quyonvoy', name: 'Quyonvoy (Chaqqon Quyon)', icon: '🐰' },
  { id: 'Sherxon', name: 'Sherxon (Jasur Sher)', icon: '🦁' },
  { id: 'Boyqush', name: 'Dono (Bilimdon Qush)', icon: '🦉' },
];

export default function ChildProfileSelector({
  isOpen,
  onClose,
  childrenList,
  activeChildId,
  onSelectChild,
  onAddChild
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('7-8');
  const [avatar, setAvatar] = useState('🦊');
  const [mascotName, setMascotName] = useState('Doni');
  const [dailyLimit, setDailyLimit] = useState(30);

  if (!isOpen) return null;

  const handleCreateChild = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    audio.playLevelUp();
    onAddChild({
      name: name.trim(),
      ageGroup,
      avatar,
      mascotName,
      dailyTimeLimitMinutes: dailyLimit,
    });

    setIsAddingNew(false);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay-dark/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-lg bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg p-6 text-clay-dark max-h-[90vh] overflow-y-auto">
        
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

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-3xl">🎒</span>
          <h2 className="text-2xl font-black text-clay-dark mt-1">Kim O'rganmoqda?</h2>
          <p className="text-xs text-clay/80 font-semibold">
            O'zingizning profilingizni tanlang yoki yangi profil qo'shing!
          </p>
        </div>

        {!isAddingNew ? (
          /* Profile List Grid */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {childrenList.map((child) => {
                const isActive = child.id === activeChildId;
                return (
                  <div
                    key={child.id}
                    onClick={() => {
                      audio.playPop();
                      onSelectChild(child.id);
                      onClose();
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-3 border-clay-dark transition-all transform hover:-translate-y-1 ${
                      isActive
                        ? 'bg-sunny-soft border-terracotta shadow-clay scale-[1.02]'
                        : 'bg-white hover:bg-paper-100 shadow-clay-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl bg-paper-200 p-2 rounded-2xl border-2 border-clay-dark/30">
                        {child.avatar || '🦊'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-base text-clay-dark truncate">{child.name}</h3>
                          {isActive && (
                            <span className="bg-sage text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              Faol
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-terracotta">
                          {child.ageGroup} yosh • {child.level}-daraja
                        </p>
                        <p className="text-[11px] text-clay/70 font-semibold">
                          ⭐ {child.xp} XP • {child.streak} kun streak
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Child Button */}
            <button
              onClick={() => {
                audio.playPop();
                setIsAddingNew(true);
              }}
              className="w-full clay-btn bg-sage text-white py-3 text-sm flex items-center justify-center gap-2 shadow-clay"
            >
              <Plus size={18} />
              <span>Yangi Bola Profilini Qo'shish</span>
            </button>
          </div>
        ) : (
          /* Create New Child Form */
          <form onSubmit={handleCreateChild} className="space-y-4">
            
            {/* Child Name */}
            <div>
              <label className="text-xs font-bold text-clay-dark block mb-1">Bolaning ismi:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Sardorbek yoki Laylo"
                className="w-full bg-white border-2.5 border-clay-dark rounded-xl py-2 px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sunny"
              />
            </div>

            {/* Age Group Selection */}
            <div>
              <label className="text-xs font-bold text-clay-dark block mb-1.5">Yosh guruhi (Moslashuvchan darslar):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '5-6', label: '5-6 yosh', sub: 'Kichkintoylar' },
                  { id: '7-8', label: '7-8 yosh', sub: 'Bilimdonlar' },
                  { id: '9-10', label: '9-10 yosh', sub: 'Chempionlar' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      audio.playPop();
                      setAgeGroup(tier.id);
                    }}
                    className={`py-2 px-1 rounded-xl border-2 border-clay-dark text-center transition-all ${
                      ageGroup === tier.id
                        ? 'bg-sunny text-clay-dark shadow-clay-sm font-black'
                        : 'bg-white text-clay/70 font-bold hover:bg-paper-100'
                    }`}
                  >
                    <div className="text-xs">{tier.label}</div>
                    <div className="text-[10px] opacity-80">{tier.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="text-xs font-bold text-clay-dark block mb-1.5">Sevimli belgi (Avatar):</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      audio.playPop();
                      setAvatar(av);
                    }}
                    className={`w-10 h-10 text-xl rounded-xl border-2 border-clay-dark flex items-center justify-center transition-all ${
                      avatar === av ? 'bg-terracotta text-white scale-110 shadow-clay-sm' : 'bg-white hover:bg-paper-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot Companion Selection */}
            <div>
              <label className="text-xs font-bold text-clay-dark block mb-1.5">Sayohat Do'sti (Maskot):</label>
              <div className="grid grid-cols-2 gap-2">
                {MASCOT_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      audio.playPop();
                      setMascotName(m.id);
                    }}
                    className={`p-2 rounded-xl border-2 border-clay-dark flex items-center gap-2 text-left transition-all ${
                      mascotName === m.id ? 'bg-skywood text-clay-dark font-black shadow-clay-sm' : 'bg-white text-clay/80 font-bold'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  audio.playPop();
                  setIsAddingNew(false);
                }}
                className="flex-1 py-2.5 bg-paper-200 text-clay-dark font-bold text-xs rounded-xl border-2 border-clay-dark"
              >
                Orqaga
              </button>
              <button
                type="submit"
                className="flex-1 clay-btn bg-terracotta text-white py-2.5 text-xs font-black shadow-clay"
              >
                Profilni Saqlash
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
