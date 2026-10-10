import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'kidedu.db');
export const db = new DatabaseSync(DB_PATH);

// 15 days in milliseconds
export const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

// Initialize Database Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      pin TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      last_active_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS child_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      age_group TEXT NOT NULL,
      avatar TEXT NOT NULL,
      mascot_name TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      coins INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 1,
      last_active_date TEXT,
      unlocked_badges TEXT NOT NULL,
      equipped_costume TEXT NOT NULL,
      inventory TEXT NOT NULL,
      completed_lessons TEXT NOT NULL,
      daily_time_limit_minutes INTEGER DEFAULT 30,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS learning_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      child_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Clean up any old demo accounts
  db.prepare("DELETE FROM users WHERE email IN ('demo@kidedu.uz', 'demo@gmail.com')").run();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return computed === hash;
}

// User & Auth Operations
export function createUser({ name, email, password, childName, childAgeGroup, childAvatar, childMascot }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    throw new Error('Bu email/login bilan foydalanuvchi allaqachon mavjud!');
  }

  if (!password || password.trim().length < 8) {
    throw new Error("Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
  }

  const userId = 'user_' + crypto.randomUUID();
  const passToHash = password.trim();
  const { hash, salt } = hashPassword(passToHash);
  const now = Date.now();

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, salt, pin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, (name || 'Foydalanuvchi').trim(), normalizedEmail, hash, salt, passToHash, now);

  // New users start from lesson 1 with 0 coins and separate profile!
  const childId = 'child_' + crypto.randomUUID();
  const emptyCompleted = JSON.stringify({ math: [], alphabet: [], stories: [] });
  const emptyBadges = JSON.stringify(['first_step']);
  const emptyEquipped = JSON.stringify({ hat: null, accessory: null });
  const emptyInv = JSON.stringify([]);

  db.prepare(`
    INSERT INTO child_profiles (
      id, user_id, name, age_group, avatar, mascot_name,
      xp, level, coins, streak, last_active_date,
      unlocked_badges, equipped_costume, inventory, completed_lessons, daily_time_limit_minutes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    childId, userId, childName?.trim() || 'Bilimdon', childAgeGroup || '7-8',
    childAvatar || '🦊', childMascot || 'Doni',
    0, 1, 0, 1, new Date().toISOString().split('T')[0],
    emptyBadges, emptyEquipped, emptyInv, emptyCompleted, 30
  );

  return authenticateUser({ email: normalizedEmail, password: passToHash });
}

export function authenticateUser({ email, password }) {
  const normalized = email?.trim().toLowerCase();
  let user = null;

  if (normalized) {
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalized);
  }

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi!');
  }

  const passAttempt = password?.trim();
  if (!passAttempt) {
    throw new Error('Iltimos, parolingizni kiriting!');
  }

  const isMatch = verifyPassword(passAttempt, user.password_hash, user.salt) || (user.pin && user.pin === passAttempt);
  if (!isMatch) {
    throw new Error("Noto'g'ri parol yoki email!");
  }

  // Create a 15-day session
  const token = 'token_' + crypto.randomUUID().replace(/-/g, '') + Date.now().toString(36);
  const now = Date.now();
  const expiresAt = now + FIFTEEN_DAYS_MS;

  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, last_active_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(token, user.id, now, now, expiresAt);

  const children = getChildrenForUser(user.id);
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    pin: user.pin,
    createdAt: user.created_at,
  };

  return {
    token,
    user: safeUser,
    children,
    activeChildId: children[0]?.id || null,
    expiresAt,
  };
}

export function validateSession(token) {
  if (!token) return null;
  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!session) return null;

  const now = Date.now();
  // Check 15 days inactivity
  if (now - session.last_active_at > FIFTEEN_DAYS_MS || now > session.expires_at) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return { expired: true };
  }

  // Update sliding 15-day activity window
  const newExpiresAt = now + FIFTEEN_DAYS_MS;
  db.prepare('UPDATE sessions SET last_active_at = ?, expires_at = ? WHERE token = ?')
    .run(now, newExpiresAt, token);

  const user = db.prepare('SELECT id, name, email, pin, created_at FROM users WHERE id = ?').get(session.user_id);
  if (!user) return null;

  const children = getChildrenForUser(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      pin: user.pin,
      createdAt: user.created_at,
    },
    children,
    lastActiveAt: now,
    expiresAt: newExpiresAt,
  };
}

export function logoutSession(token) {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function getChildrenForUser(userId) {
  const rows = db.prepare('SELECT * FROM child_profiles WHERE user_id = ?').all(userId);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    ageGroup: r.age_group,
    avatar: r.avatar,
    mascotName: r.mascot_name,
    xp: r.xp,
    level: r.level,
    coins: r.coins,
    streak: r.streak,
    lastActiveDate: r.last_active_date,
    unlockedBadges: JSON.parse(r.unlocked_badges || '[]'),
    equippedCostume: JSON.parse(r.equipped_costume || '{}'),
    inventory: JSON.parse(r.inventory || '[]'),
    completedLessons: JSON.parse(r.completed_lessons || '{"math":[],"alphabet":[],"stories":[]}'),
    dailyTimeLimitMinutes: r.daily_time_limit_minutes,
  }));
}

export function updateChildProgress(userId, childId, updates) {
  const existing = db.prepare('SELECT * FROM child_profiles WHERE id = ? AND user_id = ?').get(childId, userId);
  if (!existing) {
    throw new Error('Bola profili topilmadi');
  }

  const newXp = updates.xp !== undefined ? updates.xp : existing.xp;
  const newLevel = updates.level !== undefined ? updates.level : existing.level;
  const newCoins = updates.coins !== undefined ? updates.coins : existing.coins;
  const newStreak = updates.streak !== undefined ? updates.streak : existing.streak;
  const newDate = updates.lastActiveDate || existing.last_active_date || new Date().toISOString().split('T')[0];
  
  const newBadges = updates.unlockedBadges ? JSON.stringify(updates.unlockedBadges) : existing.unlocked_badges;
  const newEquipped = updates.equippedCostume ? JSON.stringify(updates.equippedCostume) : existing.equipped_costume;
  const newInv = updates.inventory ? JSON.stringify(updates.inventory) : existing.inventory;
  const newCompleted = updates.completedLessons ? JSON.stringify(updates.completedLessons) : existing.completed_lessons;
  const newName = updates.name || existing.name;
  const newAge = updates.ageGroup || existing.age_group;
  const newAvatar = updates.avatar || existing.avatar;
  const newMascot = updates.mascotName || existing.mascot_name;

  db.prepare(`
    UPDATE child_profiles SET
      name = ?, age_group = ?, avatar = ?, mascot_name = ?,
      xp = ?, level = ?, coins = ?, streak = ?, last_active_date = ?,
      unlocked_badges = ?, equipped_costume = ?, inventory = ?, completed_lessons = ?
    WHERE id = ? AND user_id = ?
  `).run(
    newName, newAge, newAvatar, newMascot,
    newXp, newLevel, newCoins, newStreak, newDate,
    newBadges, newEquipped, newInv, newCompleted,
    childId, userId
  );

  return getChildrenForUser(userId);
}

export function addChildForUser(userId, childData) {
  const childId = 'child_' + crypto.randomUUID();
  const emptyCompleted = JSON.stringify({ math: [], alphabet: [], stories: [] });
  const emptyBadges = JSON.stringify(['first_step']);
  const emptyEquipped = JSON.stringify({ hat: null, accessory: null });
  const emptyInv = JSON.stringify([]);

  db.prepare(`
    INSERT INTO child_profiles (
      id, user_id, name, age_group, avatar, mascot_name,
      xp, level, coins, streak, last_active_date,
      unlocked_badges, equipped_costume, inventory, completed_lessons, daily_time_limit_minutes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    childId, userId, childData.name || 'Bilimdon', childData.ageGroup || '7-8',
    childData.avatar || '🦊', childData.mascotName || 'Doni',
    0, 1, 0, 1, new Date().toISOString().split('T')[0],
    emptyBadges, emptyEquipped, emptyInv, emptyCompleted, childData.dailyTimeLimitMinutes || 30
  );

  return getChildrenForUser(userId);
}

export function addLearningLog(userId, logData) {
  const logId = 'log_' + crypto.randomUUID();
  db.prepare(`
    INSERT INTO learning_logs (
      id, user_id, child_id, subject, topic, score, total, xp_earned, duration_seconds, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    logId, userId, logData.childId, logData.subject, logData.topic,
    logData.score || 0, logData.total || 0, logData.xpEarned || 0,
    logData.durationSeconds || 60, Date.now()
  );
  return logId;
}

export function getLearningLogs(userId, childId = null) {
  if (childId) {
    return db.prepare('SELECT * FROM learning_logs WHERE user_id = ? AND child_id = ? ORDER BY created_at DESC LIMIT 100').all(userId, childId);
  }
  return db.prepare('SELECT * FROM learning_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100').all(userId);
}

// Initialize tables on load
initDatabase();
