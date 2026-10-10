import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from './services/storageService';
import { audio } from './services/audioService';

// Auth Screen (Displayed first before child dashboard)
import AuthScreen from './components/auth/AuthScreen';

// Navigation & Views
import HeaderNav from './components/navbar/HeaderNav';
import FullscreenBanner from './components/common/FullscreenBanner';
import StorybookWorldMap from './components/world/StorybookWorldMap';
import MathAdventureView from './components/math/MathAdventureView';
import AlphabetForestView from './components/alphabet/AlphabetForestView';
import StoryReaderView from './components/reading/StoryReaderView';
import UserProfileView from './components/profile/UserProfileView';
import ChildProfileSelector from './components/auth/ChildProfileSelector';
import BadgesModal from './components/rewards/BadgesModal';
import StickerShopModal from './components/rewards/StickerShopModal';

export default function App() {
  // Authentication State: First screen is login/register unless already authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => storageService.isUserAuthenticated());

  // Application State
  const [childrenList, setChildrenList] = useState([]);
  const [activeChildId, setActiveChildId] = useState('');
  const [activeChild, setActiveChild] = useState(null);
  const [currentView, setCurrentView] = useState('world'); // 'world', 'math', 'alphabet', 'stories', 'profile'

  // Modals State
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time tracking
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  const refreshChildData = useCallback(() => {
    const freshChildren = storageService.getChildren();
    const activeId = storageService.getActiveChildId();
    setChildrenList(freshChildren);
    setActiveChildId(activeId);
    const current = freshChildren.find(c => c.id === activeId) || freshChildren[0] || null;
    setActiveChild(current);
  }, []);

  // Check 15-day inactivity session rule & sync on mount
  useEffect(() => {
    async function verifySession() {
      if (storageService.isUserAuthenticated()) {
        try {
          const session = await storageService.checkServerSession();
          if (session && session.user) {
            setIsAuthenticated(true);
            refreshChildData();
          } else {
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.warn('Session verification notice:', err);
          setIsAuthenticated(storageService.isUserAuthenticated());
          refreshChildData();
        }
      } else {
        setIsAuthenticated(false);
      }
    }

    verifySession();

    // User activity listener to keep sliding 15-day activity updated
    const handleUserActivity = () => {
      if (storageService.isUserAuthenticated()) {
        storageService.updateSessionActivity();
      }
    };
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Periodic 15-day inactivity checker (every 30 seconds)
    const intervalId = setInterval(() => {
      if (storageService.isUserAuthenticated()) {
        const stillValid = storageService.isUserAuthenticated();
        if (!stillValid) {
          setIsAuthenticated(false);
          audio.playWrong();
          alert("Sessiyangiz 15 kunlik nofaollikdan so'ng tugadi. Qaytadan kiring.");
        }
      }
    }, 30000);

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(intervalId);
    };
  }, [refreshChildData]);

  // Auth Success Handler
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    refreshChildData();
    setCurrentView('world');
  };

  // Logout Handler (Clears backend session and local cache, returns to AuthScreen)
  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
    setIsProfileSelectorOpen(false);
    setCurrentView('world');
    audio.playPop();
  };

  // Switch Active Child
  const handleSelectChild = (childId) => {
    storageService.setActiveChildId(childId);
    setActiveChildId(childId);
    const child = childrenList.find(c => c.id === childId);
    setActiveChild(child);
  };

  // Add New Child Profile
  const handleAddChild = async (childData) => {
    await storageService.addChild(childData);
    refreshChildData();
    setIsProfileSelectorOpen(false);
  };

  // Handle Lesson Completion
  const handleLessonComplete = ({ subject, topic, score, total, xpEarned, completedId }) => {
    const result = storageService.addXpAndCoins(xpEarned, Math.ceil(xpEarned / 5), subject);
    
    // Update completed list
    const currentChildData = storageService.getActiveChild();
    const completedLessons = { ...currentChildData.completedLessons };

    if (subject === 'matematika' && completedId) {
      if (!completedLessons.math.includes(completedId)) {
        completedLessons.math.push(completedId);
      }
    } else if (subject === 'alifbo' && completedId) {
      if (!completedLessons.alphabet.includes(completedId)) {
        completedLessons.alphabet.push(completedId);
      }
    } else if (subject === 'o\'qish' && completedId) {
      if (!completedLessons.stories.includes(completedId)) {
        completedLessons.stories.push(completedId);
      }
    }

    // Check unlockable badges
    const unlockedBadges = [...(currentChildData.unlockedBadges || ['first_step'])];
    if (result.newXp >= 100 && !unlockedBadges.includes('math_star_1')) {
      unlockedBadges.push('math_star_1');
    }
    if (completedLessons.alphabet.length >= 5 && !unlockedBadges.includes('abc_starter')) {
      unlockedBadges.push('abc_starter');
    }
    if (result.streak >= 3 && !unlockedBadges.includes('streak_3')) {
      unlockedBadges.push('streak_3');
    }

    storageService.updateActiveChild({
      completedLessons,
      unlockedBadges
    });

    // Log the activity to database
    const durationSec = Math.max(60, Math.round((Date.now() - sessionStartTime) / 1000));
    storageService.logActivity({
      childId: activeChildId,
      subject,
      topic,
      score,
      total,
      xpEarned,
      durationSeconds: durationSec
    });

    setSessionStartTime(Date.now());
    refreshChildData();
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 1. If not authenticated, ALWAYS show Login / Register screen first
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Determine if child is currently inside a lesson (distraction-free mode)
  const isLessonMode = currentView === 'math' || currentView === 'alphabet' || currentView === 'stories';

  // 2. Child Learning Dashboard & Storybook Game World
  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-between selection:bg-sunny selection:text-clay-dark antialiased">
      
      {/* Fullscreen Notification Banner */}
      <FullscreenBanner
        isFullscreen={isFullscreen}
        onExitFullscreen={handleToggleFullscreen}
        activeChild={activeChild}
      />

      {/* Main Header Navigation: HIDDEN during lessons for a distraction-free experience */}
      {!isLessonMode && (
        <HeaderNav
          activeChild={activeChild}
          currentView={currentView}
          onGoHome={() => setCurrentView('world')}
          onOpenProfile={() => setCurrentView('profile')}
          onOpenBadges={() => setIsBadgesModalOpen(true)}
          onOpenShop={() => setIsShopModalOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Main Dynamic View Content */}
      <main className={`flex-1 ${isLessonMode ? 'pt-2' : ''}`}>
        {currentView === 'world' && (
          <StorybookWorldMap
            activeChild={activeChild}
            onNavigateTo={(viewKey) => setCurrentView(viewKey)}
            onOpenBadges={() => setIsBadgesModalOpen(true)}
            onOpenShop={() => setIsShopModalOpen(true)}
          />
        )}

        {currentView === 'profile' && (
          <UserProfileView
            activeChild={activeChild}
            currentUser={storageService.getCurrentUser()}
            childrenList={childrenList}
            onBack={() => setCurrentView('world')}
            onLogout={handleLogout}
            onOpenProfileSelector={() => setIsProfileSelectorOpen(true)}
            onOpenBadges={() => setIsBadgesModalOpen(true)}
            onOpenShop={() => setIsShopModalOpen(true)}
          />
        )}

        {currentView === 'math' && (
          <MathAdventureView
            activeChild={activeChild}
            onBack={() => setCurrentView('world')}
            onLessonComplete={handleLessonComplete}
          />
        )}

        {currentView === 'alphabet' && (
          <AlphabetForestView
            activeChild={activeChild}
            onBack={() => setCurrentView('world')}
            onLessonComplete={handleLessonComplete}
          />
        )}

        {currentView === 'stories' && (
          <StoryReaderView
            activeChild={activeChild}
            onBack={() => setCurrentView('world')}
            onLessonComplete={handleLessonComplete}
          />
        )}
      </main>

      {/* Playful Footer: HIDDEN during lessons. NO logout button here; logout is on profile page */}
      {!isLessonMode && (
        <footer className="bg-paper-200 border-t-3 border-clay-dark py-4 px-6 text-center text-xs font-bold text-clay/70 mt-8 select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span>🦊 KidEdu O'zbekiston</span>
              <span>•</span>
              <span>5-10 yoshli bolalar uchun quvnoq ta'lim platformasi</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('profile')}
                className="text-terracotta hover:text-terracotta-dark font-extrabold underline"
              >
                Mening Profilim
              </button>
              <span className="text-[11px] text-clay/50">v1.2</span>
            </div>
          </div>
        </footer>
      )}

      {/* MODALS */}
      {/* 1. Child Profile Switcher & Creator */}
      <ChildProfileSelector
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
        childrenList={childrenList}
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
      />

      {/* 2. Gamification Badges Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        activeChild={activeChild}
      />

      {/* 3. Mascot Costume Sticker Shop (KidEdu Kiyimlar Do'koni) */}
      <StickerShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        activeChild={activeChild}
        onUpdateChild={(updated) => {
          setActiveChild(updated);
          refreshChildData();
        }}
      />

    </div>
  );
}
