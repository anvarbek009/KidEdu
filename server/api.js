import {
  createUser,
  authenticateUser,
  validateSession,
  logoutSession,
  updateChildProgress,
  addChildForUser,
  addLearningLog,
  getLearningLogs
} from './db.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Yaroqsiz JSON formati'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function getBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  try {
    // 1. Auth: Register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.email || !body.password) {
        return sendJson(res, 400, { error: "Email va parol to'liq kiritilishi shart!" });
      }
      if (body.password.trim().length < 8) {
        return sendJson(res, 400, { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" });
      }
      const result = createUser(body);
      return sendJson(res, 201, result);
    }

    // 2. Auth: Login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const pass = body.password || body.pin;
      if (!body.email || !pass) {
        return sendJson(res, 400, { error: "Email va parolni kiriting!" });
      }
      const result = authenticateUser({ email: body.email, password: pass });
      return sendJson(res, 200, result);
    }

    // 3. Auth: Current Session Validation & Refresh (Checks 15-day inactivity rule)
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const token = getBearerToken(req);
      if (!token) {
        return sendJson(res, 401, { error: 'Avtorizatsiya talab qilinadi' });
      }
      const sessionData = validateSession(token);
      if (!sessionData) {
        return sendJson(res, 401, { error: 'Yaroqsiz sessiya' });
      }
      if (sessionData.expired) {
        return sendJson(res, 401, {
          error: 'Sessiya 15 kunlik nofaollikdan so‘ng tugadi. Qayta kiring.',
          expired: true
        });
      }
      return sendJson(res, 200, sessionData);
    }

    // 4. Auth: Logout
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = getBearerToken(req);
      if (token) {
        logoutSession(token);
      }
      return sendJson(res, 200, { success: true });
    }

    // For all remaining /api routes, authenticate token
    const token = getBearerToken(req);
    const sessionData = validateSession(token);
    if (!sessionData || sessionData.expired) {
      return sendJson(res, 401, {
        error: sessionData?.expired
          ? 'Sessiya 15 kunlik nofaollikdan so‘ng tugadi. Qayta kiring.'
          : 'Avtorizatsiya qilinmagan',
        expired: !!sessionData?.expired
      });
    }

    const userId = sessionData.user.id;

    // 5. User: Sync progress & child data to database
    if (pathname === '/api/user/sync' && req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.childId) {
        return sendJson(res, 400, { error: 'childId talab qilinadi' });
      }
      const updatedChildren = updateChildProgress(userId, body.childId, body);
      return sendJson(res, 200, { success: true, children: updatedChildren });
    }

    // 6. User: Add child profile
    if (pathname === '/api/children' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const updatedChildren = addChildForUser(userId, body);
      return sendJson(res, 201, { success: true, children: updatedChildren });
    }

    // 7. Learning Logs
    if (pathname === '/api/logs' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const logId = addLearningLog(userId, body);
      return sendJson(res, 201, { success: true, logId });
    }

    if (pathname === '/api/logs' && req.method === 'GET') {
      const childId = url.searchParams.get('childId');
      const logs = getLearningLogs(userId, childId);
      return sendJson(res, 200, logs);
    }

    return sendJson(res, 404, { error: 'API endpoint topilmadi' });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 400, { error: err.message || 'Server xatoligi' });
  }
}
