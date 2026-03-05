import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// List vehicles with filtering, search, pagination
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { status, search, make, sort, order, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 20, 100);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (status) { where += ' AND status = ?'; params.push(status); }
  if (make) { where += ' AND make = ?'; params.push(make); }
  if (search) { where += ' AND (license LIKE ? OR make LIKE ? OR model LIKE ? OR vin LIKE ?)'; const s = `%${search}%`; params.push(s, s, s, s); }

  const sortCol = ['make', 'model', 'status', 'mileage', 'daily_rate', 'predictive_score', 'created_at'].includes(sort as string) ? sort : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const total = (db.prepare(`SELECT COUNT(*) as count FROM vehicles ${where}`).get(...params) as any).count;
  const vehicles = db.prepare(`SELECT * FROM vehicles ${where} ORDER BY ${sortCol} ${sortOrder} LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: vehicles, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

// Get single vehicle with latest telemetry
router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!vehicle) { res.status(404).json({ error: 'Vehicle not found' }); return; }

  const telemetry = db.prepare('SELECT * FROM telemetry WHERE vehicle_id = ? ORDER BY recorded_at DESC LIMIT 1').get(req.params.id);
  const recentMaintenance = db.prepare('SELECT * FROM maintenance_tasks WHERE vehicle_id = ? ORDER BY scheduled_date DESC LIMIT 5').all(req.params.id);

  res.json({ ...vehicle as any, telemetry, recentMaintenance });
});

// Create vehicle
router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const id = uuidv4();
  const { license, make, model, year, vin, status, image, daily_rate, location_lat, location_lng, location_label } = req.body;

  if (!license || !make || !model) { res.status(400).json({ error: 'License, make, and model are required' }); return; }

  db.prepare(`INSERT INTO vehicles (id, tenant_id, license, make, model, year, vin, status, image, daily_rate, location_lat, location_lng, location_label)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, req.user!.tenant_id, license, make, model, year || null, vin || null, status || 'Available', image || null, daily_rate || 0, location_lat || null, location_lng || null, location_label || null);

  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  res.status(201).json(vehicle);
});

// Update vehicle
router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!vehicle) { res.status(404).json({ error: 'Vehicle not found' }); return; }

  const fields = ['license', 'make', 'model', 'year', 'vin', 'status', 'image', 'daily_rate', 'mileage', 'last_service', 'next_service_due', 'predictive_score', 'location_lat', 'location_lng', 'location_label', 'assigned_driver_id'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) { updates.push(`${field} = ?`); values.push(req.body[field]); }
  }

  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id, req.user!.tenant_id);

  db.prepare(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);
  const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete vehicle
router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM vehicles WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Vehicle not found' }); return; }
  res.json({ message: 'Vehicle deleted' });
});

// Get vehicle location history
router.get('/:id/locations', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { from, to, limit } = req.query;
  const limitNum = Math.min(parseInt(limit as string) || 100, 1000);

  let query = 'SELECT * FROM location_history WHERE vehicle_id = ?';
  const params: any[] = [req.params.id];

  if (from) { query += ' AND recorded_at >= ?'; params.push(from); }
  if (to) { query += ' AND recorded_at <= ?'; params.push(to); }
  query += ' ORDER BY recorded_at DESC LIMIT ?';
  params.push(limitNum);

  const locations = db.prepare(query).all(...params);
  res.json(locations);
});

export default router;
