import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, action, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE o.tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (vehicle_id) { where += ' AND o.vehicle_id = ?'; params.push(vehicle_id); }
  if (action) { where += ' AND o.action = ?'; params.push(action); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM operations o ${where}`).get(...params) as any).count;
  const operations = db.prepare(`
    SELECT o.*, v.license as vehicle_license, v.make as vehicle_make, v.model as vehicle_model, u.name as user_name
    FROM operations o
    LEFT JOIN vehicles v ON o.vehicle_id = v.id
    LEFT JOIN users u ON o.user_id = u.id
    ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, limitNum, offset);

  res.json({ data: operations, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

router.post('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, action, details } = req.body;
  if (!action) { res.status(400).json({ error: 'Action is required' }); return; }

  const id = uuidv4();
  db.prepare('INSERT INTO operations (id, tenant_id, vehicle_id, user_id, action, details) VALUES (?, ?, ?, ?, ?, ?)').run(
    id, req.user!.tenant_id, vehicle_id || null, req.user!.id, action, details || null
  );

  const operation = db.prepare('SELECT * FROM operations WHERE id = ?').get(id);
  res.status(201).json(operation);
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM operations WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Operation not found' }); return; }
  res.json({ message: 'Operation deleted' });
});

export default router;
