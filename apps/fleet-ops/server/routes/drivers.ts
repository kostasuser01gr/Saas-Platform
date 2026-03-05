import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { status, search, page, limit } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 50, 200);
  const offset = (pageNum - 1) * limitNum;

  let where = 'WHERE tenant_id = ?';
  const params: any[] = [req.user!.tenant_id];

  if (status) { where += ' AND status = ?'; params.push(status); }
  if (search) { where += ' AND (name LIKE ? OR email LIKE ?)'; const s = `%${search}%`; params.push(s, s); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM drivers ${where}`).get(...params) as any).count;
  const drivers = db.prepare(`SELECT * FROM drivers ${where} ORDER BY name ASC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ data: drivers, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!driver) { res.status(404).json({ error: 'Driver not found' }); return; }

  const recentTrips = db.prepare(`
    SELECT dt.*, v.license, v.make, v.model FROM driver_trips dt
    JOIN vehicles v ON dt.vehicle_id = v.id WHERE dt.driver_id = ? ORDER BY dt.start_time DESC LIMIT 10
  `).all(req.params.id);

  const assignedVehicle = db.prepare('SELECT * FROM vehicles WHERE assigned_driver_id = ?').get(req.params.id);

  res.json({ ...(driver as any), recentTrips, assignedVehicle });
});

router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { name, license_number, license_expiry, phone, email, user_id } = req.body;
  if (!name) { res.status(400).json({ error: 'Name is required' }); return; }

  const id = uuidv4();
  db.prepare('INSERT INTO drivers (id, tenant_id, user_id, name, license_number, license_expiry, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    id, req.user!.tenant_id, user_id || null, name, license_number || null, license_expiry || null, phone || null, email || null
  );
  res.status(201).json(db.prepare('SELECT * FROM drivers WHERE id = ?').get(id));
});

router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const fields = ['name', 'license_number', 'license_expiry', 'phone', 'email', 'status', 'behavior_score'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) { updates.push(`${field} = ?`); values.push(req.body[field]); }
  }
  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id, req.user!.tenant_id);

  db.prepare(`UPDATE drivers SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);
  res.json(db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('UPDATE vehicles SET assigned_driver_id = NULL WHERE assigned_driver_id = ?').run(req.params.id);
  const result = db.prepare('DELETE FROM drivers WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Driver not found' }); return; }
  res.json({ message: 'Driver deleted' });
});

// Record a trip
router.post('/:id/trips', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, start_time, end_time, start_lat, start_lng, end_lat, end_lng, distance, max_speed, avg_speed, harsh_braking_events, speeding_events, idle_time_minutes, route_geojson } = req.body;
  if (!vehicle_id || !start_time) { res.status(400).json({ error: 'vehicle_id and start_time required' }); return; }

  const id = uuidv4();
  db.prepare(`INSERT INTO driver_trips (id, driver_id, vehicle_id, start_time, end_time, start_lat, start_lng, end_lat, end_lng, distance, max_speed, avg_speed, harsh_braking_events, speeding_events, idle_time_minutes, route_geojson)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, req.params.id, vehicle_id, start_time, end_time || null, start_lat || null, start_lng || null, end_lat || null, end_lng || null,
    distance || 0, max_speed || null, avg_speed || null, harsh_braking_events || 0, speeding_events || 0, idle_time_minutes || 0, route_geojson ? JSON.stringify(route_geojson) : null
  );

  // Update driver stats
  db.prepare(`UPDATE drivers SET total_trips = total_trips + 1, total_distance = total_distance + ?,
    harsh_braking_count = harsh_braking_count + ?, speeding_count = speeding_count + ?, idle_time_minutes = idle_time_minutes + ?,
    updated_at = datetime('now') WHERE id = ?`).run(
    distance || 0, harsh_braking_events || 0, speeding_events || 0, idle_time_minutes || 0, req.params.id
  );

  // Recalculate behavior score
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id) as any;
  if (driver && driver.total_trips > 0) {
    const brakingPenalty = (driver.harsh_braking_count / driver.total_trips) * 5;
    const speedingPenalty = (driver.speeding_count / driver.total_trips) * 8;
    const idlePenalty = (driver.idle_time_minutes / (driver.total_trips * 60)) * 3;
    const score = Math.max(0, Math.min(100, 100 - brakingPenalty - speedingPenalty - idlePenalty));
    db.prepare('UPDATE drivers SET behavior_score = ? WHERE id = ?').run(Math.round(score * 10) / 10, req.params.id);
  }

  res.status(201).json(db.prepare('SELECT * FROM driver_trips WHERE id = ?').get(id));
});

// Get driver behavior analytics
router.get('/:id/behavior', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id) as any;
  if (!driver) { res.status(404).json({ error: 'Driver not found' }); return; }

  const trips = db.prepare('SELECT * FROM driver_trips WHERE driver_id = ? ORDER BY start_time DESC LIMIT 50').all(req.params.id);

  res.json({
    score: driver.behavior_score,
    totalTrips: driver.total_trips,
    totalDistance: driver.total_distance,
    harshBrakingCount: driver.harsh_braking_count,
    speedingCount: driver.speeding_count,
    idleTimeMinutes: driver.idle_time_minutes,
    avgHarshBrakingPerTrip: driver.total_trips > 0 ? Math.round((driver.harsh_braking_count / driver.total_trips) * 100) / 100 : 0,
    avgSpeedingPerTrip: driver.total_trips > 0 ? Math.round((driver.speeding_count / driver.total_trips) * 100) / 100 : 0,
    recentTrips: trips,
  });
});

export default router;
