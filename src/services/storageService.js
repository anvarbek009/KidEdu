// KidEdu Persistent Storage & Backend Sync Service with 15-Day Inactivity Session Rule

const STORAGE_KEYS = {
  AUTH_TOKEN: 'kidedu_auth_token',
  CURRENT_USER: 'kidedu_current_user',
  CHILD_PROFILES: 'kidedu_child_profiles',
  ACTIVE_CHILD_ID: 'kidedu_active_child_id',
  LEARNING_LOGS: 'kidedu_learning_logs',
  SESSION_EXPIRES_AT: 'kidedu_session_expires_at',
  LAST_ACTIVE_TIME: 'kidedu_last_active_time',
};

// 15 days in milliseconds
export const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export const storageService = {
  // Authentication & Session Token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getSessionInfo() {
    const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT)) || 0;
    const lastActive = Number(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_TIME)) || 0;
    return { expiresAt, lastActive };
  },

  updateSessionActivity() {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_TIME, String(now));
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRES_AT, String(now + FIFTEEN_DAYS_MS));
  },

  isUserAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check 15 days inactivity locally
    const lastActive = Number(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_TIME)) || 0;
    const now = Date.now();
    if (lastActive && (now - lastActive > FIFTEEN_DAYS_MS)) {
      this.logout();
      return false;
    }

    return true;
  },

  // API Client Helper
  async apiRequest(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      // Session expired check (15 days inactivity from backend)
      if (response.status === 401) {
        if (data.expired || token) {
          this.logout();
        }
        throw new Error(data.error || 'Avtorizatsiya talab qilinadi');
      }

      if (!response.ok) {
        throw new Error(data.error || "Serverda xatolik yuz berdi");
      }

      this.updateSessionActivity();
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Auth Operations
  async login({ email, pin, password }) {
    const data = await this.apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, pin, password })
    });

    this.setToken(data.token);
    this.setCurrentUser(data.user);
    this.saveChildren(data.children || []);
    if (data.activeChildId) {
      this.setActiveChildId(data.activeChildId);
    }
    this.updateSessionActivity();
    return data;
  },

  async register({ name, email, pin, password, childName, childAgeGroup, childAvatar, childMascot }) {
    const data = await this.apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        pin,
        password,
        childName,
        childAgeGroup,
        childAvatar,
        childMascot
      })
    });

    this.setToken(data.token);
    this.setCurrentUser(data.user);
    this.saveChildren(data.children || []);
    if (data.activeChildId) {
      this.setActiveChildId(data.activeChildId);
    }
    this.updateSessionActivity();
    return data;
  },

  async checkServerSession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const data = await this.apiRequest('/api/auth/me', { method: 'GET' });
      if (data && data.user) {
        this.setCurrentUser(data.user);
        this.saveChildren(data.children || []);
        this.updateSessionActivity();
        return data;
      }
      return null;
    } catch (err) {
      // If expired, clear
      if (err.message.includes('15 kunlik') || err.message.includes('tugadi')) {
        this.logout();
      }
      return null;
    }
  },

  logout() {
    const token = this.getToken();
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CHILD_PROFILES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHILD_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_TIME);
  },

  // Child Profiles
  getChildren() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHILD_PROFILES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveChildren(children) {
    localStorage.setItem(STORAGE_KEYS.CHILD_PROFILES, JSON.stringify(children));
  },

  getActiveChildId() {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHILD_ID);
    if (raw) return raw;
    const children = this.getChildren();
    const firstId = children[0]?.id || '';
    if (firstId) {
      this.setActiveChildId(firstId);
    }
    return firstId;
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
      const merged = { ...children[index], ...updates };
      children[index] = merged;
      this.saveChildren(children);

      // Async sync to persistent backend database
      this.syncChildToBackend(merged);
      return merged;
    }
    return null;
  },

  async syncChildToBackend(childData) {
    const token = this.getToken();
    if (!token || !childData) return;

    try {
      await this.apiRequest('/api/user/sync', {
        method: 'POST',
        body: JSON.stringify({
          childId: childData.id,
          name: childData.name,
          ageGroup: childData.ageGroup,
          avatar: childData.avatar,
          mascotName: childData.mascotName,
          xp: childData.xp,
          level: childData.level,
          coins: childData.coins,
          streak: childData.streak,
          lastActiveDate: childData.lastActiveDate,
          unlockedBadges: childData.unlockedBadges,
          equippedCostume: childData.equippedCostume,
          inventory: childData.inventory,
          completedLessons: childData.completedLessons,
        })
      });
    } catch (err) {
      console.warn('Backend sync deferred:', err.message);
    }
  },

  async addChild(newChildData) {
    try {
      const res = await this.apiRequest('/api/children', {
        method: 'POST',
        body: JSON.stringify(newChildData)
      });
      if (res && res.children) {
        this.saveChildren(res.children);
        const newest = res.children[res.children.length - 1];
        if (newest) this.setActiveChildId(newest.id);
        return newest;
      }
    } catch (e) {
      console.warn('Failed to add child on backend:', e);
    }
    return null;
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
    // Level formula: Level 1 (0-100), Level 2 (100-250), Level 3 (250-450)...
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
    if (raw) {
      try { logs = JSON.parse(raw); } catch { logs = []; }
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
    localStorage.setItem(STORAGE_KEYS.LEARNING_LOGS, JSON.stringify(logs.slice(0, 100)));

    // Sync to backend asynchronously
    this.apiRequest('/api/logs', {
      method: 'POST',
      body: JSON.stringify(newLog)
    }).catch(() => {});

    return newLog;
  },

  // Backwards compatibility for Parent Pin
  getParentAuth() {
    const user = this.getCurrentUser();
    return {
      id: user?.id || 'user_1',
      name: user?.name || 'Ota-Ona',
      email: user?.email || '',
      pin: user?.pin || '1234',
      isLoggedIn: this.isUserAuthenticated(),
    };
  }
};
