// KidEdu LocalStorage persistence service

const STORAGE_KEYS = {
  PARENT_AUTH: 'kidedu_parent_auth',
  CHILD_PROFILES: 'kidedu_child_profiles',
  ACTIVE_CHILD_ID: 'kidedu_active_child_id',
  LEARNING_LOGS: 'kidedu_learning_logs',
  SETTINGS: 'kidedu_settings',
};

// Seed initial demo data for smooth first-time experience
const DEFAULT_PARENT = {
  id: 'parent_1',
  name: 'Ota-Ona',
  email: 'otaona@kidedu.uz',
  pin: '1234',
  isLoggedIn: false,
};

const DEFAULT_CHILDREN = [
  {
    id: 'child_1',
    name: 'Azizbek',
    ageGroup: '7-8', // '5-6', '7-8', '9-10'
    avatar: '🦊',
    mascotName: 'Doni',
    xp: 280,
    level: 2,
    coins: 45,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: ['first_step', 'math_star_1', 'abc_starter'],
    equippedCostume: { hat: 'straw_hat', accessory: 'explorer_bag' },
    inventory: ['straw_hat', 'explorer_bag'],
    completedLessons: {
      math: ['count_1', 'add_1'],
      alphabet: ['A', 'B', 'D', 'E'],
      stories: ['story_1'],
    },
    dailyTimeLimitMinutes: 30,
  },
  {
    id: 'child_2',
    name: 'Madinabonu',
    ageGroup: '5-6',
    avatar: '🐰',
    mascotName: 'Quyonvoy',
    xp: 90,
    level: 1,
    coins: 20,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: ['first_step'],
    equippedCostume: { hat: null, accessory: null },
    inventory: [],
    completedLessons: {
      math: ['count_1'],
      alphabet: ['A'],
      stories: [],
    },
    dailyTimeLimitMinutes: 20,
  }
];

const DEFAULT_LOGS = [
  {
    id: 'log_1',
    childId: 'child_1',
    subject: 'matematika',
    topic: 'Qo\'shish va Ayirish (1-20)',
    score: 9,
    total: 10,
    xpEarned: 50,
    durationSeconds: 180,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'log_2',
    childId: 'child_1',
    subject: 'alifbo',
    topic: 'O\'zbek Alifbosi (A, B, D, E)',
    score: 8,
    total: 8,
    xpEarned: 60,
    durationSeconds: 240,
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'log_3',
    childId: 'child_1',
    subject: 'o\'qish',
    topic: 'Ertak: Quvnoq Ayiqcha',
    score: 5,
    total: 5,
    xpEarned: 40,
    durationSeconds: 300,
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
];

export const storageService = {
  // Parent Auth
  getParentAuth() {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENT_AUTH);
    if (!raw) {
      this.saveParentAuth(DEFAULT_PARENT);
      return DEFAULT_PARENT;
    }
    return JSON.parse(raw);
  },

  saveParentAuth(authData) {
    localStorage.setItem(STORAGE_KEYS.PARENT_AUTH, JSON.stringify(authData));
  },

  isUserAuthenticated() {
    const auth = this.getParentAuth();
    return !!(auth && auth.isLoggedIn);
  },

  logout() {
    const auth = this.getParentAuth();
    auth.isLoggedIn = false;
    this.saveParentAuth(auth);
  },

  // Child Profiles
  getChildren() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHILD_PROFILES);
    if (!raw) {
      this.saveChildren(DEFAULT_CHILDREN);
      return DEFAULT_CHILDREN;
    }
    return JSON.parse(raw);
  },

  saveChildren(children) {
    localStorage.setItem(STORAGE_KEYS.CHILD_PROFILES, JSON.stringify(children));
  },

  getActiveChildId() {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHILD_ID);
    if (!raw) {
      const children = this.getChildren();
      const firstId = children[0]?.id || 'child_1';
      this.setActiveChildId(firstId);
      return firstId;
    }
    return raw;
  },

  setActiveChildId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHILD_ID, id);
  },

  getActiveChild() {
    const children = this.getChildren();
    const activeId = this.getActiveChildId();
    return children.find(c => c.id === activeId) || children[0] || null;
  },

  updateActiveChild(updates) {
    const children = this.getChildren();
    const activeId = this.getActiveChildId();
    const index = children.findIndex(c => c.id === activeId);
    if (index !== -1) {
      children[index] = { ...children[index], ...updates };
      this.saveChildren(children);
      return children[index];
    }
    return null;
  },

  addChild(newChildData) {
    const children = this.getChildren();
    const newChild = {
      id: 'child_' + Date.now(),
      name: newChildData.name || 'Yangi Bilimdon',
      ageGroup: newChildData.ageGroup || '7-8',
      avatar: newChildData.avatar || '🦊',
      mascotName: newChildData.mascotName || 'Doni',
      xp: 0,
      level: 1,
      coins: 20,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['first_step'],
      equippedCostume: { hat: null, accessory: null },
      inventory: [],
      completedLessons: { math: [], alphabet: [], stories: [] },
      dailyTimeLimitMinutes: newChildData.dailyTimeLimitMinutes || 30,
      ...newChildData,
    };
    children.push(newChild);
    this.saveChildren(children);
    this.setActiveChildId(newChild.id);
    return newChild;
  },

  deleteChild(childId) {
    let children = this.getChildren();
    if (children.length <= 1) return false; // Keep at least one child
    children = children.filter(c => c.id !== childId);
    this.saveChildren(children);
    this.setActiveChildId(children[0].id);
    return true;
  },

  // Gamification: Add XP and calculate level
  addXpAndCoins(xpAmount, coinsAmount = 5, subject = 'math') {
    const child = this.getActiveChild();
    if (!child) return { newXp: 0, levelUp: false, newLevel: 1 };

    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = child.streak || 1;

    // Check streak
    if (child.lastActiveDate) {
      const lastDate = new Date(child.lastActiveDate);
      const today = new Date(todayStr);
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const currentXp = child.xp || 0;
    const newXp = currentXp + xpAmount;
    const oldLevel = child.level || 1;
    // Level formula: Level 1 (0-100), Level 2 (100-250), Level 3 (250-450), Level 4 (450-700), Level 5 (700+)
    const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;
    const levelUp = newLevel > oldLevel;

    const newCoins = (child.coins || 0) + coinsAmount;

    this.updateActiveChild({
      xp: newXp,
      level: newLevel,
      coins: newCoins,
      streak: newStreak,
      lastActiveDate: todayStr,
    });

    return {
      newXp,
      newLevel,
      levelUp,
      newCoins,
      streak: newStreak,
    };
  },

  // Learning Logs
  getLogs(childId = null) {
    const raw = localStorage.getItem(STORAGE_KEYS.LEARNING_LOGS);
    let logs = [];
    if (!raw) {
      logs = DEFAULT_LOGS;
      localStorage.setItem(STORAGE_KEYS.LEARNING_LOGS, JSON.stringify(logs));
    } else {
      logs = JSON.parse(raw);
    }
    if (childId) {
      return logs.filter(l => l.childId === childId);
    }
    return logs;
  },

  logActivity(activity) {
    const logs = this.getLogs();
    const newLog = {
      id: 'log_' + Date.now(),
      childId: activity.childId || this.getActiveChildId(),
      subject: activity.subject,
      topic: activity.topic,
      score: activity.score,
      total: activity.total,
      xpEarned: activity.xpEarned,
      durationSeconds: activity.durationSeconds || 60,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.LEARNING_LOGS, JSON.stringify(logs.slice(0, 100))); // Keep last 100
    return newLog;
  },

  // Reset all data
  resetAllData() {
    localStorage.clear();
    this.saveParentAuth(DEFAULT_PARENT);
    this.saveChildren(DEFAULT_CHILDREN);
    this.setActiveChildId(DEFAULT_CHILDREN[0].id);
    localStorage.setItem(STORAGE_KEYS.LEARNING_LOGS, JSON.stringify(DEFAULT_LOGS));
  }
};
