import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { search, loyalty_tier, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (search) { where += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)'; const s = `%${search}%`; params.push(s, s, s); }
  if (loyalty_tier) { where += ' AND loyalty_tier = ?'; params.push(loyalty_tier); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM customers ${where}`).get(...params) as any).count;
  const customers = db.prepare(`SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: customers, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const customer = db.prepare('SELECT * FROM customers WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!customer) { res.status(404).json({ error: 'Customer not found' }); return; }
  res.json(customer);
});

router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { name, email, phone, address, license_number, loyalty_tier, notes } = req.body;
  if (!name) { res.status(400).json({ error: 'Name is required' }); return; }

  const id = uuidv4();
  db.prepare('INSERT INTO customers (id, tenant_id, name, email, phone, address, license_number, loyalty_tier, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, req.user!.tenant_id, name, email || null, phone || null, address || null, license_number || null, loyalty_tier || 'bronze', notes || null
  );
  res.status(201).json(db.prepare('SELECT * FROM customers WHERE id = ?').get(id));
});

router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const fields = ['name', 'email', 'phone', 'address', 'license_number', 'loyalty_tier', 'notes', 'total_rentals', 'total_spent'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) { updates.push(`${field} = ?`); values.push(req.body[field]); }
  }
  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id, req.user!.tenant_id);

  db.prepare(`UPDATE customers SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM customers WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Customer not found' }); return; }
  res.json({ message: 'Customer deleted' });
});

export default router;
