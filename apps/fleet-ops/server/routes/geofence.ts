import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const geofences = db.prepare('SELECT * FROM geofences WHERE tenant_id = ? ORDER BY created_at DESC').all(req.user!.tenant_id);
  res.json(geofences);
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const geofence = db.prepare('SELECT * FROM geofences WHERE id = ? AND tenant_id = ?').get(req.params.id, req.user!.tenant_id);
  if (!geofence) { res.status(404).json({ error: 'Geofence not found' }); return; }

  const events = db.prepare(`
    SELECT ge.*, v.license, v.make, v.model FROM geofence_events ge
    JOIN vehicles v ON ge.vehicle_id = v.id WHERE ge.geofence_id = ? ORDER BY ge.recorded_at DESC LIMIT 50
  `).all(req.params.id);

  res.json({ ...(geofence as any), events });
});

router.post('/', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { name, type, center_lat, center_lng, radius_meters, polygon_coords, alert_on_enter, alert_on_exit } = req.body;
  if (!name) { res.status(400).json({ error: 'Name is required' }); return; }

  const id = uuidv4();
  db.prepare(`INSERT INTO geofences (id, tenant_id, name, type, center_lat, center_lng, radius_meters, polygon_coords, alert_on_enter, alert_on_exit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, req.user!.tenant_id, name, type || 'circle', center_lat || null, center_lng || null, radius_meters || null,
    polygon_coords ? JSON.stringify(polygon_coords) : null, alert_on_enter ?? 1, alert_on_exit ?? 1
  );
  res.status(201).json(db.prepare('SELECT * FROM geofences WHERE id = ?').get(id));
});

router.put('/:id', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const fields = ['name', 'type', 'center_lat', 'center_lng', 'radius_meters', 'polygon_coords', 'alert_on_enter', 'alert_on_exit', 'is_active'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(field === 'polygon_coords' ? JSON.stringify(req.body[field]) : req.body[field]);
    }
  }
  if (updates.length === 0) { res.status(400).json({ error: 'No fields to update' }); return; }

  values.push(req.params.id, req.user!.tenant_id);
  db.prepare(`UPDATE geofences SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`).run(...values);
  res.json(db.prepare('SELECT * FROM geofences WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM geofences WHERE id = ? AND tenant_id = ?').run(req.params.id, req.user!.tenant_id);
  if (result.changes === 0) { res.status(404).json({ error: 'Geofence not found' }); return; }
  res.json({ message: 'Geofence deleted' });
});

// Check vehicle against geofences
router.post('/check', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, lat, lng } = req.body;
  if (!vehicle_id || lat === undefined || lng === undefined) { res.status(400).json({ error: 'vehicle_id, lat, lng required' }); return; }

  const geofences = db.prepare('SELECT * FROM geofences WHERE tenant_id = ? AND is_active = 1 AND type = ?').all(req.user!.tenant_id, 'circle') as any[];
  const violations: any[] = [];

  for (const gf of geofences) {
    const distance = haversineDistance(lat, lng, gf.center_lat, gf.center_lng);
    const inside = distance <= gf.radius_meters;

    // Check last known state
    const lastEvent = db.prepare('SELECT event_type FROM geofence_events WHERE geofence_id = ? AND vehicle_id = ? ORDER BY recorded_at DESC LIMIT 1').get(gf.id, vehicle_id) as any;
    const wasInside = lastEvent?.event_type === 'enter';

    if (inside && !wasInside && gf.alert_on_enter) {
      db.prepare('INSERT INTO geofence_events (id, geofence_id, vehicle_id, event_type, lat, lng) VALUES (?, ?, ?, ?, ?, ?)').run(uuidv4(), gf.id, vehicle_id, 'enter', lat, lng);
      db.prepare('INSERT INTO notifications (id, tenant_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        uuidv4(), req.user!.tenant_id, 'geofence', `Entered: ${gf.name}`, `Vehicle entered geofence "${gf.name}"`, 'info', 'vehicle', vehicle_id
      );
      violations.push({ geofence: gf.name, event: 'enter', distance });
    } else if (!inside && wasInside && gf.alert_on_exit) {
      db.prepare('INSERT INTO geofence_events (id, geofence_id, vehicle_id, event_type, lat, lng) VALUES (?, ?, ?, ?, ?, ?)').run(uuidv4(), gf.id, vehicle_id, 'exit', lat, lng);
      db.prepare('INSERT INTO notifications (id, tenant_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        uuidv4(), req.user!.tenant_id, 'geofence', `Exited: ${gf.name}`, `Vehicle exited geofence "${gf.name}"`, 'warning', 'vehicle', vehicle_id
      );
      violations.push({ geofence: gf.name, event: 'exit', distance });
    }
  }

  res.json({ checked: geofences.length, violations });
});

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default router;
