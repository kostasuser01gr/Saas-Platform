import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// List maintenance tasks
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, status, priority, type, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE mt.tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (vehicle_id) { where += ' AND mt.vehicle_id = ?'; params.push(vehicle_id); }
  if (status) { where += ' AND mt.status = ?'; params.push(status); }
  if (priority) { where += ' AND mt.priority = ?'; params.push(priority); }
  if (type) { where += ' AND mt.type = ?'; params.push(type); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM maintenance_tasks mt ${where}`).get(...params) as any).count;
  const tasks = db.prepare(`
    SELECT mt.*, v.license, v.make, v.model FROM maintenance_tasks mt
    LEFT JOIN vehicles v ON mt.vehicle_id = v.id
    ${where} ORDER BY CASE mt.priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, mt.scheduled_date ASC
    LIMIT ? OFFSET ?
  `).all(...params, limitNum, offset);

  res.json({ data: tasks, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

// Get single task
router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const task = db.prepare(`
    SELECT mt.*, v.license, v.make, v.model FROM maintenance_tasks mt
    LEFT JOIN vehicles v ON mt.vehicle_id = v.id WHERE mt.id = ? AND mt.tenant_id = ?
  `).get(req.params.id, req.user!.tenant_id);
  if (!task) { res.status(404).json({ error: 'Task not found' }); return; }

  const parts = db.prepare(`
    SELECT mp.*, p.name, p.part_number, p.unit_cost FROM maintenance_parts mp
    JOIN parts p ON mp.part_id = p.id WHERE mp.maintenance_id = ?
  `).all(req.params.id);

  res.json({ ...(task as any), parts });
});

// Create task
router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, type, title, description, status, priority, scheduled_date, cost, technician, notes } = req.body;
  if (!vehicle_id || !type || !title) { res.status(400).json({ error: 'vehicle_id, type, and title are required' }); return; }

  const id = uuidv4();
  db.prepare(`INSERT INTO maintenance_tasks (id, vehicle_id, tenant_id, type, title, description, status, priority, scheduled_date, cost, technician, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, vehicle_id, req.user!.tenant_id, type, title, description || null, status || 'scheduled', priority || 'medium', scheduled_date || null, cost || 0, technician || null, notes || null
  );

  // Create notification
  db.prepare('INSERT INTO notifications (id, tenant_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    uuidv4(), req.user!.tenant_id, 'maintenance', `Maintenance Scheduled: ${title}`, `${type} scheduled for vehicle ${vehicle_id}`, priority === 'critical' ? 'critical' : 'info', 'maintenance', id
  );

  res.status(201).json(db.prepare('SELECT * FROM maintenance_tasks WHERE id = ?').get(id));
});

// Update task
router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const task = db.prepare('SELECT * FROM maintenance_tasks WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!task) { res.status(404).json({ error: 'Task not found' }); return; }

  const fields = ['type', 'title', 'description', 'status', 'priority', 'scheduled_date', 'completed_date', 'cost', 'technician', 'notes'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) { updates.push(`${field} = ?`); values.push(req.body[field]); }
  }
  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id, req.user!.tenant_id);

  db.prepare(`UPDATE maintenance_tasks SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);

  // If completed, update vehicle predictive score
  if (req.body.status === 'completed') {
    const t = task as any;
    db.prepare("UPDATE vehicles SET predictive_score = MIN(100, predictive_score + 10), last_service = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(t.vehicle_id);
  }

  res.json(db.prepare('SELECT * FROM maintenance_tasks WHERE id = ?').get(req.params.id));
});

// Delete task
router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM maintenance_tasks WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Task not found' }); return; }
  res.json({ message: 'Task deleted' });
});

// Calendar view - tasks by date range
router.get('/calendar/:year/:month', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { year, month } = req.params;
  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const endDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;

  const tasks = db.prepare(`
    SELECT mt.*, v.license, v.make, v.model FROM maintenance_tasks mt
    LEFT JOIN vehicles v ON mt.vehicle_id = v.id
    WHERE mt.tenant_id = ? AND mt.scheduled_date >= ? AND mt.scheduled_date < ?
    ORDER BY mt.scheduled_date ASC
  `).all(req.user!.tenant_id, startDate, endDate);

  res.json(tasks);
});

// Overdue check
router.get('/overdue', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tasks = db.prepare(`
    SELECT mt.*, v.license, v.make, v.model FROM maintenance_tasks mt
    LEFT JOIN vehicles v ON mt.vehicle_id = v.id
    WHERE mt.tenant_id = ? AND mt.status = 'scheduled' AND mt.scheduled_date < date('now')
    ORDER BY mt.scheduled_date ASC
  `).all(req.user!.tenant_id);

  // Auto-update to overdue
  if (tasks.length > 0) {
    db.prepare("UPDATE maintenance_tasks SET status = 'overdue', updated_at = datetime('now') WHERE tenant_id = ? AND status = 'scheduled' AND scheduled_date < date('now')").run(req.user!.tenant_id);
  }

  res.json(tasks);
});

export default router;
