import { Router, Response } from 'express';
import { getDb } from '../db/initialize';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Fleet overview stats
router.get('/overview', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tid = req.user!.tenant_id;

  const totalVehicles = (db.prepare('SELECT COUNT(*) as c FROM vehicles WHERE tenant_id = ?').get(tid) as any).c;
  const statusBreakdown = db.prepare('SELECT status, COUNT(*) as count FROM vehicles WHERE tenant_id = ? GROUP BY status').all(tid);
  const totalRevenue = (db.prepare('SELECT COALESCE(SUM(total_revenue), 0) as total FROM vehicles WHERE tenant_id = ?').get(tid) as any).total;
  const avgPredictiveScore = (db.prepare('SELECT COALESCE(AVG(predictive_score), 0) as avg FROM vehicles WHERE tenant_id = ?').get(tid) as any).avg;
  const pendingMaintenance = (db.prepare("SELECT COUNT(*) as c FROM maintenance_tasks WHERE tenant_id = ? AND status IN ('scheduled','overdue')").get(tid) as any).c;
  const totalCustomers = (db.prepare('SELECT COUNT(*) as c FROM customers WHERE tenant_id = ?').get(tid) as any).c;
  const totalDrivers = (db.prepare('SELECT COUNT(*) as c FROM drivers WHERE tenant_id = ?').get(tid) as any).c;
  const unreadNotifications = (db.prepare('SELECT COUNT(*) as c FROM notifications WHERE tenant_id = ? AND is_read = 0').get(tid) as any).c;

  res.json({
    totalVehicles, statusBreakdown, totalRevenue, avgPredictiveScore: Math.round(avgPredictiveScore * 10) / 10,
    pendingMaintenance, totalCustomers, totalDrivers, unreadNotifications,
  });
});

// Revenue analytics
router.get('/revenue', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tid = req.user!.tenant_id;

  const byVehicle = db.prepare('SELECT id, license, make, model, total_revenue, rental_count, daily_rate FROM vehicles WHERE tenant_id = ? ORDER BY total_revenue DESC').all(tid);
  const totalRevenue = (db.prepare('SELECT COALESCE(SUM(total_revenue), 0) as total FROM vehicles WHERE tenant_id = ?').get(tid) as any).total;
  const avgRevenuePerVehicle = byVehicle.length > 0 ? totalRevenue / byVehicle.length : 0;
  const topPerformers = byVehicle.slice(0, 5);

  res.json({ totalRevenue, avgRevenuePerVehicle: Math.round(avgRevenuePerVehicle * 100) / 100, topPerformers, byVehicle });
});

// Utilization analytics
router.get('/utilization', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tid = req.user!.tenant_id;

  const vehicles = db.prepare('SELECT id, license, make, model, status, rental_count, mileage, total_revenue FROM vehicles WHERE tenant_id = ?').all(tid) as any[];
  const totalVehicles = vehicles.length;
  const onRental = vehicles.filter(v => v.status === 'On Rental').length;
  const available = vehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'Maintenance').length;

  const utilizationRate = totalVehicles > 0 ? Math.round((onRental / totalVehicles) * 100) : 0;
  const avgMileage = totalVehicles > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.mileage, 0) / totalVehicles) : 0;

  res.json({
    utilizationRate, totalVehicles, onRental, available, inMaintenance,
    avgMileage, vehicles: vehicles.map(v => ({ ...v, revenuePerMile: v.mileage > 0 ? Math.round((v.total_revenue / v.mileage) * 100) / 100 : 0 })),
  });
});

// Maintenance cost analytics
router.get('/maintenance-costs', requireRole('admin', 'fleet_manager'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tid = req.user!.tenant_id;

  const totalCost = (db.prepare('SELECT COALESCE(SUM(cost), 0) as total FROM maintenance_tasks WHERE tenant_id = ?').get(tid) as any).total;
  const byType = db.prepare('SELECT type, COUNT(*) as count, COALESCE(SUM(cost), 0) as total_cost, COALESCE(AVG(cost), 0) as avg_cost FROM maintenance_tasks WHERE tenant_id = ? GROUP BY type ORDER BY total_cost DESC').all(tid);
  const byVehicle = db.prepare(`
    SELECT v.id, v.license, v.make, v.model, COUNT(mt.id) as task_count, COALESCE(SUM(mt.cost), 0) as total_cost
    FROM vehicles v LEFT JOIN maintenance_tasks mt ON v.id = mt.vehicle_id
    WHERE v.tenant_id = ? GROUP BY v.id ORDER BY total_cost DESC
  `).all(tid);
  const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM maintenance_tasks WHERE tenant_id = ? GROUP BY status').all(tid);

  res.json({ totalCost, byType, byVehicle, byStatus });
});

// Fleet health score
router.get('/health', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const tid = req.user!.tenant_id;

  const vehicles = db.prepare('SELECT id, license, make, model, predictive_score, status FROM vehicles WHERE tenant_id = ?').all(tid) as any[];
  const avgScore = vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.predictive_score, 0) / vehicles.length) : 0;
  const critical = vehicles.filter(v => v.predictive_score < 40);
  const warning = vehicles.filter(v => v.predictive_score >= 40 && v.predictive_score < 70);
  const healthy = vehicles.filter(v => v.predictive_score >= 70);

  res.json({ avgScore, critical, warning, healthy, vehicles });
});

export default router;
