import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get notifications for current user
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { unread_only, type, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE (user_id = ? OR user_id IS NULL) AND tenant_id = ?';
  const params: any[] = [req.user!.id, req.user!.tenant_id];

  if (unread_only === 'true') { where += ' AND is_read = 0'; }
  if (type) { where += ' AND type = ?'; params.push(type); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM notifications ${where}`).get(...params) as any).count;
  const unreadCount = (db.prepare(`SELECT COUNT(*) as count FROM notifications ${where.replace('AND is_read = 0', '')} AND is_read = 0`).get(...params) as any).count;
  const notifications = db.prepare(`SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: notifications, unreadCount, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

// Mark as read
router.put('/:id/read', (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Marked as read' });
});

// Mark all as read
router.put('/read-all', (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1 WHERE (user_id = ? OR user_id IS NULL) AND tenant_id = ?').run(req.user!.id, req.user!.tenant_id);
  res.json({ message: 'All notifications marked as read' });
});

// Create notification (system/admin use)
router.post('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { user_id, type, title, message, severity, entity_type, entity_id } = req.body;
  if (!type || !title || !message) { res.status(400).json({ error: 'type, title, and message are required' }); return; }

  const id = uuidv4();
  db.prepare('INSERT INTO notifications (id, tenant_id, user_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, req.user!.tenant_id, user_id || null, type, title, message, severity || 'info', entity_type || null, entity_id || null
  );
  res.status(201).json(db.prepare('SELECT * FROM notifications WHERE id = ?').get(id));
});

// Delete notification
router.delete('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
  res.json({ message: 'Notification deleted' });
});

// Get/update notification preferences
router.get('/preferences', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const prefs = db.prepare('SELECT * FROM notification_preferences WHERE user_id = ?').all(req.user!.id);
  res.json(prefs);
});

router.put('/preferences', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { preferences } = req.body;
  if (!Array.isArray(preferences)) { res.status(400).json({ error: 'preferences array required' }); return; }

  const upsert = db.prepare(`INSERT INTO notification_preferences (id, user_id, type, email_enabled, push_enabled, sms_enabled) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, type) DO UPDATE SET email_enabled = excluded.email_enabled, push_enabled = excluded.push_enabled, sms_enabled = excluded.sms_enabled`);

  for (const pref of preferences) {
    upsert.run(uuidv4(), req.user!.id, pref.type, pref.email_enabled ? 1 : 0, pref.push_enabled ? 1 : 0, pref.sms_enabled ? 1 : 0);
  }
  res.json({ message: 'Preferences updated' });
});

export default router;
