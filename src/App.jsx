import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { audio } from './services/audioService';

// Auth Screen (Displayed first before child dashboard)
import AuthScreen from './components/auth/AuthScreen';

// Navigation & Modals
import HeaderNav from './components/navbar/HeaderNav';
import FullscreenBanner from './components/common/FullscreenBanner';
import StorybookWorldMap from './components/world/StorybookWorldMap';
import MathAdventureView from './components/math/MathAdventureView';
import AlphabetForestView from './components/alphabet/AlphabetForestView';
import StoryReaderView from './components/reading/StoryReaderView';
import ParentGateModal from './components/parent/ParentGateModal';
import ParentDashboard from './components/parent/ParentDashboard';
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
  const [currentView, setCurrentView] = useState('world'); // 'world', 'math', 'alphabet', 'stories'

  // Modals State
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time tracking
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  // Load Initial Data from localStorage
  useEffect(() => {
    refreshChildData();

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const refreshChildData = () => {
    const freshChildren = storageService.getChildren();
    const activeId = storageService.getActiveChildId();
    setChildrenList(freshChildren);
    setActiveChildId(activeId);
    const current = freshChildren.find(c => c.id === activeId) || freshChildren[0];
    setActiveChild(current);
  };

  // Auth Success Handler
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    refreshChildData();
    setCurrentView('world');
  };

  // Logout Handler
  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
    setIsParentDashboardOpen(false);
    setIsParentGateOpen(false);
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
  const handleAddChild = (childData) => {
    const newChild = storageService.addChild(childData);
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

    // Log the activity
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

  // Parent Gate Success
  const handleParentGateSuccess = () => {
    setIsParentGateOpen(false);
    setIsParentDashboardOpen(true);
  };

  // 1. If not authenticated, show proper Login / Register screen
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // 2. Child Learning Dashboard & Storybook Game World
  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-between selection:bg-sunny selection:text-clay-dark antialiased">
      
      {/* Fullscreen Notification Banner */}
      <FullscreenBanner
        isFullscreen={isFullscreen}
        onExitFullscreen={handleToggleFullscreen}
        activeChild={activeChild}
      />

      {/* Main Storybook Header Navigation */}
      <HeaderNav
        activeChild={activeChild}
        currentView={currentView}
        onGoHome={() => setCurrentView('world')}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenProfileSelector={() => setIsProfileSelectorOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenShop={() => setIsShopModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'world' && (
          <StorybookWorldMap
            activeChild={activeChild}
            onNavigateTo={(viewKey) => setCurrentView(viewKey)}
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

      {/* Playful Footer */}
      <footer className="bg-paper-200 border-t-3 border-clay-dark py-4 px-6 text-center text-xs font-bold text-clay/70 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span>🦊 KidEdu O'zbekiston</span>
            <span>•</span>
            <span>5-10 yoshli bolalar uchun quvnoq ta'lim platformasi</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsParentGateOpen(true)}
              className="text-terracotta underline font-extrabold hover:text-terracotta-dark"
            >
              Ota-Ona Kabineti
            </button>
            <button
              onClick={handleLogout}
              className="text-clay/60 hover:text-terracotta font-bold text-[11px] underline"
            >
              Chiqish (Logout)
            </button>
            <span className="text-[11px] text-clay/50">v1.0 MVP</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Parent Gate Security */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
        parentPin={storageService.getParentAuth()?.pin || '1234'}
      />

      {/* 2. Parent Control Dashboard */}
      <ParentDashboard
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        childrenList={childrenList}
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        onDataUpdated={refreshChildData}
        onLogout={handleLogout}
      />

      {/* 3. Child Profile Switcher & Creator */}
      <ChildProfileSelector
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
        childrenList={childrenList}
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
      />

      {/* 4. Gamification Badges Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        activeChild={activeChild}
      />

      {/* 5. Mascot Costume Sticker Shop */}
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
