import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { search, category, low_stock, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (search) { where += ' AND (name LIKE ? OR part_number LIKE ?)'; const s = `%${search}%`; params.push(s, s); }
  if (category) { where += ' AND category = ?'; params.push(category); }
  if (low_stock === 'true') { where += ' AND quantity <= reorder_level'; }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM parts ${where}`).get(...params) as any).count;
  const parts = db.prepare(`SELECT * FROM parts ${where} ORDER BY name ASC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: parts, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

router.get('/low-stock', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const parts = db.prepare('SELECT * FROM parts WHERE tenant_id = ? AND quantity <= reorder_level ORDER BY quantity ASC').all(req.user!.tenant_id);
  res.json(parts);
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const part = db.prepare('SELECT * FROM parts WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!part) { res.status(404).json({ error: 'Part not found' }); return; }

  const usage = db.prepare(`
    SELECT mp.*, mt.title as maintenance_title, mt.vehicle_id, v.license FROM maintenance_parts mp
    JOIN maintenance_tasks mt ON mp.maintenance_id = mt.id
    LEFT JOIN vehicles v ON mt.vehicle_id = v.id WHERE mp.part_id = ? ORDER BY mt.created_at DESC LIMIT 20
  `).all(req.params.id);

  res.json({ ...(part as any), usage });
});

router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { name, part_number, category, quantity, reorder_level, unit_cost, supplier, location } = req.body;
  if (!name) { res.status(400).json({ error: 'Name is required' }); return; }

  const id = uuidv4();
  db.prepare('INSERT INTO parts (id, tenant_id, name, part_number, category, quantity, reorder_level, unit_cost, supplier, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, req.user!.tenant_id, name, part_number || null, category || null, quantity || 0, reorder_level || 5, unit_cost || 0, supplier || null, location || null
  );
  res.status(201).json(db.prepare('SELECT * FROM parts WHERE id = ?').get(id));
});

router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const fields = ['name', 'part_number', 'category', 'quantity', 'reorder_level', 'unit_cost', 'supplier', 'location'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) { updates.push(`${field} = ?`); values.push(req.body[field]); }
  }
  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id, req.user!.tenant_id);

  db.prepare(`UPDATE parts SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);

  // Check if low stock and notify
  const part = db.prepare('SELECT * FROM parts WHERE id = ?').get(req.params.id) as any;
  if (part && part.quantity <= part.reorder_level) {
    db.prepare('INSERT INTO notifications (id, tenant_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      uuidv4(), req.user!.tenant_id, 'alert', `Low Stock: ${part.name}`, `Part "${part.name}" (${part.part_number}) is at ${part.quantity} units (reorder level: ${part.reorder_level})`, 'warning', 'part', req.params.id
    );
  }

  res.json(part);
});

router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM parts WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Part not found' }); return; }
  res.json({ message: 'Part deleted' });
});

// Use part in maintenance
router.post('/:id/use', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { maintenance_id, quantity } = req.body;
  if (!maintenance_id || !quantity) { res.status(400).json({ error: 'maintenance_id and quantity required' }); return; }

  const part = db.prepare('SELECT * FROM parts WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id) as any;
  if (!part) { res.status(404).json({ error: 'Part not found' }); return; }
  if (part.quantity < quantity) { res.status(400).json({ error: `Insufficient stock. Available: ${part.quantity}` }); return; }

  db.prepare('INSERT INTO maintenance_parts (id, maintenance_id, part_id, quantity_used) VALUES (?, ?, ?, ?)').run(uuidv4(), maintenance_id, req.params.id, quantity);
  db.prepare("UPDATE parts SET quantity = quantity - ?, updated_at = datetime('now') WHERE id = ?").run(quantity, req.params.id);

  res.json({ message: 'Part used', remainingQuantity: part.quantity - quantity });
});

export default router;
