import { Router, Response } from 'express';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { user_id, entity_type, entity_id, from, to, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (user_id) { where += ' AND user_id = ?'; params.push(user_id); }
  if (entity_type) { where += ' AND entity_type = ?'; params.push(entity_type); }
  if (entity_id) { where += ' AND entity_id = ?'; params.push(entity_id); }
  if (from) { where += ' AND created_at >= ?'; params.push(from); }
  if (to) { where += ' AND created_at <= ?'; params.push(to); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM audit_log ${where}`).get(...params) as any).count;
  const logs = db.prepare(`SELECT * FROM audit_log ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: logs, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

// Get audit trail for specific entity
router.get('/entity/:type/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const logs = db.prepare('SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? AND tenant_id = ? ORDER BY created_at DESC LIMIT 100').all(
    req.params.type, req.params.id, req.user!.tenant_id
  );
  res.json(logs);
});

export default router;
