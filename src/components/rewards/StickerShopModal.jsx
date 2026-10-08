import React from 'react';
import { X, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { COSTUME_ITEMS } from '../../data/badgesData';
import { storageService } from '../../services/storageService';
import { audio } from '../../services/audioService';
import MascotDoni from '../mascot/MascotDoni';

export default function StickerShopModal({
  isOpen,
  onClose,
  activeChild,
  onUpdateChild
}) {
  if (!isOpen) return null;

  const currentCoins = activeChild?.coins || 0;
  const inventory = activeChild?.inventory || [];
  const equipped = activeChild?.equippedCostume || { hat: null, accessory: null };

  const handleBuyItem = (item) => {
    if (currentCoins < item.price) {
      audio.playWrong();
      audio.speakUzbek("Yulduzli tangalaringiz yetarli emas. Darslarni bajarib tanga to'plang!");
      return;
    }

    audio.playLevelUp();
    audio.speakUzbek(`Tabriklaymiz! "${item.name}" xarid qilindi!`);

    const newCoins = currentCoins - item.price;
    const newInventory = [...inventory, item.id];
    
    // Auto equip
    const newEquipped = { ...equipped };
    if (item.type === 'hat') newEquipped.hat = item.id;
    if (item.type === 'accessory') newEquipped.accessory = item.id;

    const updated = storageService.updateActiveChild({
      coins: newCoins,
      inventory: newInventory,
      equippedCostume: newEquipped
    });

    onUpdateChild(updated);
  };

  const handleToggleEquip = (item) => {
    audio.playPop();
    const newEquipped = { ...equipped };

    if (item.type === 'hat') {
      newEquipped.hat = newEquipped.hat === item.id ? null : item.id;
    } else if (item.type === 'accessory') {
      newEquipped.accessory = newEquipped.accessory === item.id ? null : item.id;
    }

    const updated = storageService.updateActiveChild({
      equippedCostume: newEquipped
    });

    onUpdateChild(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay-dark/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-2xl bg-paper-50 border-4 border-clay-dark rounded-3xl shadow-clay-lg flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-paper-200 border-b-3 border-clay-dark p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sunny text-clay-dark rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-center text-2xl">
              🛍️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-clay-dark">
                Doni Kiyimlar Do'koni
              </h2>
              <div className="flex items-center gap-1 text-xs font-bold text-clay-dark">
                <span>Mavjud tangalar:</span>
                <span className="bg-sunny text-clay-dark px-2 py-0.5 rounded-lg border border-clay-dark text-xs font-black">
                  ⭐ {currentCoins}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playPop();
              onClose();
            }}
            className="p-2 bg-paper-100 hover:bg-white border-2 border-clay-dark rounded-xl shadow-clay-sm transition-all text-clay-dark"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content: Preview Mascot + Items */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Mascot Live Dressing Preview */}
          <div className="bg-white p-4 rounded-3xl border-3 border-clay-dark shadow-clay-sm flex flex-col sm:flex-row items-center justify-center gap-6">
            <MascotDoni
              size="lg"
              emotion="happy"
              costume={equipped}
              speech="Yangi kiyimlarim qanday yarashyapti?"
            />

            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-clay-dark">Kiyingan buyumlar:</h3>
              <p className="text-xs text-clay/70 font-semibold mt-1">
                Shlyapa: <span className="font-bold text-terracotta">{equipped.hat || 'Yo\'q'}</span>
              </p>
              <p className="text-xs text-clay/70 font-semibold">
                Aksessuar: <span className="font-bold text-terracotta">{equipped.accessory || 'Yo\'q'}</span>
              </p>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {COSTUME_ITEMS.map((item) => {
              const isOwned = inventory.includes(item.id);
              const isEquipped = (item.type === 'hat' && equipped.hat === item.id) ||
                                (item.type === 'accessory' && equipped.accessory === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border-3 border-clay-dark shadow-clay-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl bg-paper-100 p-2.5 rounded-2xl border-2 border-clay-dark">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-clay-dark">{item.name}</h4>
                      <p className="text-[11px] text-clay/70 font-semibold">{item.description}</p>
                      
                      {!isOwned && (
                        <div className="mt-1 text-xs font-black text-sunny-dark">
                          ⭐ {item.price} tanga
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {isOwned ? (
                      <button
                        onClick={() => handleToggleEquip(item)}
                        className={`clay-btn text-xs px-3 py-1.5 font-bold ${
                          isEquipped
                            ? 'bg-sage text-white'
                            : 'bg-paper-200 text-clay-dark hover:bg-paper-300'
                        }`}
                      >
                        {isEquipped ? 'Kiyilgan ✓' : 'Kiyish'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={currentCoins < item.price}
                        className={`clay-btn text-xs px-3 py-1.5 font-bold ${
                          currentCoins >= item.price
                            ? 'bg-sunny text-clay-dark'
                            : 'bg-paper-200 opacity-50 text-clay/50 cursor-not-allowed'
                        }`}
                      >
                        Sotib olish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
