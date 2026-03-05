import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.prepare(
      'INSERT INTO users (id, email, password_hash, name, role, tenant_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, email, passwordHash, name, role || 'viewer', 'default');

    const token = generateAccessToken({ id, email, name, role: role || 'viewer', tenant_id: 'default' });
    const refreshToken = generateRefreshToken({ id });

    db.prepare('INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').run(
      uuidv4(), id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    res.status(201).json({ user: { id, email, name, role: role || 'viewer' }, token, refreshToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email) as any;
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateAccessToken({
      id: user.id, email: user.email, name: user.name, role: user.role, tenant_id: user.tenant_id,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    db.prepare('INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').run(
      uuidv4(), user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar_url: user.avatar_url },
      token,
      refreshToken,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fleet-ops-dev-refresh-secret-2024') as any;
    const db = getDb();
    const stored = db.prepare('SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?').get(refreshToken, decoded.id) as any;

    if (!stored || new Date(stored.expires_at) < new Date()) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1').get(decoded.id) as any;
    if (!user) {
      res.status(403).json({ error: 'User not found or inactive' });
      return;
    }

    const newToken = generateAccessToken({
      id: user.id, email: user.email, name: user.name, role: user.role, tenant_id: user.tenant_id,
    });

    res.json({ token: newToken });
  } catch (err: any) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(req.user!.id);
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, name, role, tenant_id, avatar_url, created_at FROM users WHERE id = ?').get(req.user!.id);
  res.json(user);
});

function generateAccessToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fleet-ops-dev-secret-key-2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

function generateRefreshToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fleet-ops-dev-refresh-secret-2024', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

export default router;
