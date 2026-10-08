import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  ShoppingBag,
  BookOpen,
  Calculator,
  CheckCircle,
  Play,
  Star
} from 'lucide-react';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function StorybookWorldMap({
  activeChild,
  onNavigateTo,
  onOpenBadges,
  onOpenShop
}) {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    {
      id: 'alphabet',
      title: 'Alifbo O\'rmoni',
      subtitle: '29 ta harf, tovushlar va yozish mashqlari',
      icon: '🌲🔤',
      image: '/assets/scenes/forest_letters.jpg',
      color: '#6EA888',
      bgCard: '#EBF4EF',
      badge: 'Alifbo & Tovushlar',
      mascotQuote: 'Alifbo o\'rmonida yangi harflarni birga kashf qilamiz!',
      completedCount: activeChild?.completedLessons?.alphabet?.length || 0,
      totalCount: 29,
    },
    {
      id: 'math',
      title: 'Raqamlar Qasri',
      subtitle: `${activeChild?.ageGroup || '7-8'} yosh uchun mantiqiy hisoblash va o'yinlar`,
      icon: '🏰🔢',
      color: '#E26D5C',
      bgCard: '#FDECE9',
      badge: 'Matematika & Mantiq',
      mascotQuote: 'Qasrdagi sehrli raqamlar jumboqlarini yechamiz!',
      completedCount: activeChild?.completedLessons?.math?.length || 0,
      totalCount: 3,
    },
    {
      id: 'stories',
      title: 'Sehrli Kitobxonlik',
      subtitle: 'Ovozli o\'zbek ertaklari va qiziqarli hikoyalar',
      icon: '📖✨',
      color: '#6AA8C8',
      bgCard: '#EAF4F9',
      badge: 'Ertaklar & O\'qish',
      mascotQuote: 'Ajoyib ertaklar bizni yangi olamlarga yetaklaydi!',
      completedCount: activeChild?.completedLessons?.stories?.length || 0,
      totalCount: 3,
    },
    {
      id: 'badges',
      title: 'Yutuqlar Xazinasi',
      subtitle: 'To\'plangan medallar va maxsus kuboklar',
      icon: '🏆🌟',
      color: '#9A7AA0',
      bgCard: '#F4EEF6',
      badge: 'Mukofotlar',
      isModal: true,
      onClick: onOpenBadges,
      completedCount: activeChild?.unlockedBadges?.length || 1,
      totalCount: 10,
    },
    {
      id: 'shop',
      title: 'Doni Kiyimlar Do\'koni',
      subtitle: 'Yulduzli tangalar bilan Doniga kiyimlar oling',
      icon: '🛍️🎩',
      color: '#F3B749',
      bgCard: '#FEF6E4',
      badge: 'Do\'kon & Tangalar',
      isModal: true,
      onClick: onOpenShop,
      completedCount: activeChild?.inventory?.length || 0,
      totalCount: 6,
    }
  ];

  const handleZoneClick = (zone) => {
    audio.playPop();
    if (zone.isModal) {
      if (zone.onClick) zone.onClick();
    } else {
      onNavigateTo(zone.id);
    }
  };

  return (
    <div className="py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-pop-in">

      {/* Playful Storybook World Welcome Banner */}
      <div className="relative bg-gradient-to-r from-sunny/30 via-paper-100 to-sage/30 rounded-3xl sm:rounded-5xl border-4 border-clay-dark shadow-clay p-5 sm:p-8 overflow-hidden">

        {/* Floating Background Doodles */}
        <div className="absolute -top-4 -right-4 text-7xl opacity-20 select-none pointer-events-none animate-float">
          ☀️
        </div>
        <div className="absolute bottom-2 left-6 text-4xl opacity-20 select-none pointer-events-none animate-bounce-gentle">
          🦋
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-sunny-soft border-2 border-clay-dark px-3 py-1 rounded-full shadow-clay-sm">
              <Sparkles size={14} className="text-sunny-dark animate-spin" />
              <span className="text-xs font-black text-clay-dark">
                Xush kelibsiz, {activeChild?.name || 'Bilimdon'}!
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-clay-dark leading-tight">
              Quvnoq Bilimlar Sarguzashtiga Tayyormisiz?
            </h1>

            <p className="text-xs sm:text-sm font-bold text-clay/80 leading-relaxed">
              O'zbek alifbosi, qiziqarli matematika va sehrli ertaklar olamiga sayohat qiling!
            </p>

            {/* Daily Mission Pill */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="bg-white border-2 border-clay-dark px-3 py-1.5 rounded-2xl shadow-clay-sm text-xs font-bold text-clay-dark flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span>Bugungi maqsad: <strong>2 ta dars</strong> yakunlang!</span>
              </div>
              <div className="bg-terracotta-soft text-terracotta-dark border-2 border-clay-dark px-3 py-1.5 rounded-2xl shadow-clay-sm text-xs font-black flex items-center gap-1">
                <Flame size={14} className="text-terracotta fill-terracotta" />
                <span>{activeChild?.streak || 1} kunlik Streak!</span>
              </div>
            </div>
          </div>

          {/* Animated Mascot Companion */}
          <div className="shrink-0">
            <MascotDoni
              size="lg"
              emotion="cheering"
              costume={activeChild?.equippedCostume}
              speech={`Salom ${activeChild?.name}! Qaysi orolchaga boramiz?`}
            />
          </div>

        </div>
      </div>

      {/* Storybook Adventure World Map Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h2 className="text-xl sm:text-2xl font-black text-clay-dark">
              Sarguzasht Xaritasi
            </h2>
          </div>
          <span className="text-xs font-bold text-clay/70 hidden sm:inline">
            O'rganishni boshlash uchun orolchani tanlang!
          </span>
        </div>

        {/* 5 Distinct Themed Learning Islands */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {zones.map((zone) => {
            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className="group cursor-pointer rounded-3xl sm:rounded-4xl border-4 border-clay-dark shadow-clay transition-all duration-200 transform hover:-translate-y-2 hover:shadow-clay-lg flex flex-col justify-between p-6 relative overflow-hidden"
                style={{ backgroundColor: zone.bgCard }}
              >
                {/* Wobbly decorative blob background */}
                <div
                  className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-30 pointer-events-none transition-transform group-hover:scale-125"
                  style={{ backgroundColor: zone.color }}
                />

                <div>
                  {/* Card Header: Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl border-3 border-clay-dark flex items-center justify-center text-3xl shadow-clay-sm group-hover:scale-110 group-hover:-rotate-6 transition-all overflow-hidden"
                      style={{ backgroundColor: zone.color }}
                    >
                      {zone.image ? (
                        <img
                          src={zone.image}
                          alt={zone.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        zone.icon
                      )}
                    </div>

                    <span className="text-xs font-black bg-white/90 text-clay-dark px-3 py-1 rounded-xl border-2 border-clay-dark shadow-clay-sm">
                      {zone.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-black text-clay-dark mb-1 group-hover:text-terracotta transition-colors">
                    {zone.title}
                  </h3>

                  <p className="text-xs font-bold text-clay/70 leading-relaxed mb-4">
                    {zone.subtitle}
                  </p>
                </div>

                {/* Progress bar / Action Button */}
                <div className="pt-4 border-t-2 border-clay-dark/20 flex items-center justify-between gap-3">
                  <div className="text-xs font-bold text-clay-dark">
                    <span>{zone.completedCount}</span>
                    <span className="text-clay/60"> / {zone.totalCount}</span>
                  </div>

                  <button
                    className="clay-btn bg-sage hover:bg-sage-dark text-white text-xs px-4 py-2 font-black flex items-center gap-1.5 shadow-clay-sm"
                  >
                    <Play size={13} />
                    <span>Kirish</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
