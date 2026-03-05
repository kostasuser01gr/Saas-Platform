import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get latest telemetry for all vehicles
router.get('/latest', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const telemetry = db.prepare(`
    SELECT t.* FROM telemetry t
    INNER JOIN (SELECT vehicle_id, MAX(recorded_at) as max_recorded FROM telemetry GROUP BY vehicle_id) latest
    ON t.vehicle_id = latest.vehicle_id AND t.recorded_at = latest.max_recorded
    INNER JOIN vehicles v ON t.vehicle_id = v.id AND v.tenant_id = ?
  `).all(req.user!.tenant_id);
  res.json(telemetry);
});

// Get telemetry history for a vehicle
router.get('/vehicle/:vehicleId', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { from, to, limit } = req.query;
  const limitNum = Math.min(parseInt(limit as string) || 100, 1000);

  let query = 'SELECT * FROM telemetry WHERE vehicle_id = ?';
  const params: any[] = [req.params.vehicleId];

  if (from) { query += ' AND recorded_at >= ?'; params.push(from); }
  if (to) { query += ' AND recorded_at <= ?'; params.push(to); }
  query += ' ORDER BY recorded_at DESC LIMIT ?';
  params.push(limitNum);

  res.json(db.prepare(query).all(...params));
});

// Ingest telemetry data
router.post('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { vehicle_id, fuel_level, battery_health, tire_pressure_fl, tire_pressure_fr, tire_pressure_rl, tire_pressure_rr, engine_temp, speed, odometer, location_lat, location_lng, heading } = req.body;

  if (!vehicle_id) { res.status(400).json({ error: 'vehicle_id is required' }); return; }

  const id = uuidv4();
  db.prepare(`INSERT INTO telemetry (id, vehicle_id, fuel_level, battery_health, tire_pressure_fl, tire_pressure_fr, tire_pressure_rl, tire_pressure_rr, engine_temp, speed, odometer, location_lat, location_lng, heading)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, vehicle_id, fuel_level ?? null, battery_health ?? null, tire_pressure_fl ?? null, tire_pressure_fr ?? null, tire_pressure_rl ?? null, tire_pressure_rr ?? null, engine_temp ?? null, speed ?? null, odometer ?? null, location_lat ?? null, location_lng ?? null, heading ?? null
  );

  // Also record in location history if coordinates provided
  if (location_lat && location_lng) {
    db.prepare('INSERT INTO location_history (id, vehicle_id, lat, lng, speed, heading) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuidv4(), vehicle_id, location_lat, location_lng, speed ?? null, heading ?? null
    );

    // Update vehicle location
    db.prepare("UPDATE vehicles SET location_lat = ?, location_lng = ?, updated_at = datetime('now') WHERE id = ?").run(location_lat, location_lng, vehicle_id);
  }

  // Check for anomalies and create notifications
  checkTelemetryAnomalies(db, vehicle_id, req.body);

  res.status(201).json({ id, message: 'Telemetry recorded' });
});

function checkTelemetryAnomalies(db: any, vehicleId: string, data: any): void {
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicleId) as any;
  if (!vehicle) return;

  const alerts: { type: string; title: string; message: string; severity: string }[] = [];

  if (data.fuel_level !== undefined && data.fuel_level < 15) {
    alerts.push({ type: 'telemetry', title: 'Critical Fuel Level', message: `Vehicle ${vehicle.license} fuel at ${data.fuel_level}%`, severity: 'warning' });
  }
  if (data.battery_health !== undefined && data.battery_health < 50) {
    alerts.push({ type: 'telemetry', title: 'Low Battery Health', message: `Vehicle ${vehicle.license} battery at ${data.battery_health}%`, severity: 'warning' });
  }
  if (data.engine_temp !== undefined && data.engine_temp > 110) {
    alerts.push({ type: 'telemetry', title: 'Engine Overheating', message: `Vehicle ${vehicle.license} engine temp at ${data.engine_temp}°C`, severity: 'critical' });
  }
  if (data.speed !== undefined && data.speed > 130) {
    alerts.push({ type: 'telemetry', title: 'Speeding Alert', message: `Vehicle ${vehicle.license} speed at ${data.speed} km/h`, severity: 'warning' });
  }

  for (const alert of alerts) {
    db.prepare('INSERT INTO notifications (id, tenant_id, type, title, message, severity, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      uuidv4(), vehicle.tenant_id, alert.type, alert.title, alert.message, alert.severity, 'vehicle', vehicleId
    );
  }
}

export default router;
