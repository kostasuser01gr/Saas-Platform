-- Default tenant
INSERT INTO tenants (id, name, slug) VALUES ('default', 'Fleet-OPS Demo', 'fleet-ops-demo');

-- Admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, tenant_id) VALUES
  ('usr-001', 'admin@fleetops.io', '$2b$10$placeholder_hash_admin', 'Admin User', 'admin', 'default'),
  ('usr-002', 'manager@fleetops.io', '$2b$10$placeholder_hash_manager', 'Fleet Manager', 'fleet_manager', 'default'),
  ('usr-003', 'driver1@fleetops.io', '$2b$10$placeholder_hash_driver', 'John Driver', 'driver', 'default');

-- Drivers
INSERT INTO drivers (id, tenant_id, user_id, name, license_number, license_expiry, phone, email, status, behavior_score) VALUES
  ('drv-001', 'default', 'usr-003', 'John Driver', 'DL-2024-001', '2026-12-31', '+1-555-0101', 'driver1@fleetops.io', 'active', 92),
  ('drv-002', 'default', NULL, 'Sarah Connor', 'DL-2024-002', '2025-08-15', '+1-555-0102', 'sarah@fleetops.io', 'active', 88),
  ('drv-003', 'default', NULL, 'Mike Chen', 'DL-2024-003', '2025-03-20', '+1-555-0103', 'mike@fleetops.io', 'active', 95);

-- Vehicles
INSERT INTO vehicles (id, tenant_id, license, make, model, year, vin, status, image, daily_rate, total_revenue, rental_count, mileage, last_service, predictive_score, location_lat, location_lng, location_label, assigned_driver_id) VALUES
  ('v-001', 'default', 'FL-1234', 'BMW', 'X5', 2023, '5UXCR6C05N9K12345', 'Available', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 120, 45600, 380, 23400, '2024-11-15', 87, 37.7749, -122.4194, 'San Francisco HQ', NULL),
  ('v-002', 'default', 'FL-5678', 'Ford', 'Focus', 2022, '1FADP3F29NL123456', 'On Rental', 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800', 55, 18200, 331, 45200, '2024-10-20', 72, 37.7849, -122.4094, 'Downtown Lot', 'drv-001'),
  ('v-003', 'default', 'FL-9012', 'Tesla', 'Model 3', 2024, '5YJ3E1EA1NF123456', 'Available', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 95, 32100, 338, 12800, '2024-12-01', 95, 37.7649, -122.4294, 'Airport Depot', NULL),
  ('v-004', 'default', 'FL-3456', 'Toyota', 'Corolla', 2021, '2T1BURHE5NC123456', 'Maintenance', 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800', 45, 28900, 642, 67800, '2024-09-10', 45, 37.7549, -122.4394, 'Service Center', 'drv-002'),
  ('v-005', 'default', 'FL-7890', 'Honda', 'Accord', 2023, '1HGCV1F34PA123456', 'Available', 'https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800', 70, 15400, 220, 18900, '2024-11-28', 91, 37.7949, -122.3994, 'North Station', 'drv-003');

-- Telemetry snapshots
INSERT INTO telemetry (id, vehicle_id, fuel_level, battery_health, tire_pressure_fl, tire_pressure_fr, tire_pressure_rl, tire_pressure_rr, engine_temp, speed, odometer, location_lat, location_lng, recorded_at) VALUES
  ('tel-001', 'v-001', 78, 95, 34, 34, 33, 33, 92, 0, 23400, 37.7749, -122.4194, datetime('now')),
  ('tel-002', 'v-002', 45, 88, 32, 31, 32, 30, 98, 45, 45200, 37.7849, -122.4094, datetime('now')),
  ('tel-003', 'v-003', NULL, 92, 35, 35, 35, 35, 28, 0, 12800, 37.7649, -122.4294, datetime('now')),
  ('tel-004', 'v-004', 23, 76, 28, 29, 27, 28, 105, 0, 67800, 37.7549, -122.4394, datetime('now')),
  ('tel-005', 'v-005', 91, 97, 34, 34, 34, 34, 88, 60, 18900, 37.7949, -122.3994, datetime('now'));

-- Operations
INSERT INTO operations (id, tenant_id, vehicle_id, user_id, action, details, created_at) VALUES
  ('op-001', 'default', 'v-001', 'usr-001', 'wash', 'Full exterior and interior wash', datetime('now', '-2 hours')),
  ('op-002', 'default', 'v-002', 'usr-002', 'rental_start', 'Rented to customer John Doe', datetime('now', '-1 hours')),
  ('op-003', 'default', 'v-004', 'usr-002', 'maintenance', 'Scheduled brake inspection', datetime('now', '-30 minutes')),
  ('op-004', 'default', 'v-003', 'usr-001', 'inspection', 'Quarterly safety inspection passed', datetime('now', '-15 minutes')),
  ('op-005', 'default', 'v-005', 'usr-003', 'fuel', 'Refueled to full tank', datetime('now', '-5 minutes'));

-- Maintenance tasks
INSERT INTO maintenance_tasks (id, vehicle_id, tenant_id, type, title, description, status, priority, scheduled_date, cost, technician) VALUES
  ('mt-001', 'v-004', 'default', 'brake_inspection', 'Brake Pad Replacement', 'Front brake pads worn below minimum thickness', 'in_progress', 'high', date('now'), 450, 'Mike T.'),
  ('mt-002', 'v-001', 'default', 'oil_change', 'Regular Oil Change', '10,000 mile oil change service', 'scheduled', 'medium', date('now', '+7 days'), 85, NULL),
  ('mt-003', 'v-002', 'default', 'tire_rotation', 'Tire Rotation & Balance', 'Quarterly tire rotation', 'scheduled', 'low', date('now', '+14 days'), 60, NULL),
  ('mt-004', 'v-004', 'default', 'engine_service', 'Engine Diagnostic', 'Check engine light investigation', 'scheduled', 'critical', date('now', '+1 day'), 200, 'Sarah M.'),
  ('mt-005', 'v-003', 'default', 'general', 'Annual Inspection', 'Full vehicle annual inspection', 'completed', 'medium', date('now', '-5 days'), 150, 'Mike T.');

-- Parts inventory
INSERT INTO parts (id, tenant_id, name, part_number, category, quantity, reorder_level, unit_cost, supplier, location) VALUES
  ('prt-001', 'default', 'Brake Pad Set (Front)', 'BP-FRT-001', 'brakes', 12, 5, 45.99, 'AutoParts Co.', 'Shelf A1'),
  ('prt-002', 'default', 'Oil Filter', 'OF-STD-001', 'engine', 25, 10, 8.99, 'FilterPro', 'Shelf B2'),
  ('prt-003', 'default', 'Synthetic Motor Oil 5W-30 (5L)', 'OIL-5W30-5L', 'engine', 18, 8, 32.50, 'LubeTech', 'Shelf B1'),
  ('prt-004', 'default', 'Air Filter', 'AF-STD-001', 'engine', 15, 5, 12.99, 'FilterPro', 'Shelf B3'),
  ('prt-005', 'default', 'Wiper Blade Set', 'WB-UNI-001', 'exterior', 8, 4, 18.50, 'AutoParts Co.', 'Shelf C1'),
  ('prt-006', 'default', 'Tire - All Season 225/65R17', 'TR-AS-225', 'tires', 6, 4, 125.00, 'TireWorld', 'Bay D1');

-- Geofences
INSERT INTO geofences (id, tenant_id, name, type, center_lat, center_lng, radius_meters, alert_on_enter, alert_on_exit, is_active) VALUES
  ('gf-001', 'default', 'San Francisco HQ', 'circle', 37.7749, -122.4194, 500, 1, 1, 1),
  ('gf-002', 'default', 'Airport Zone', 'circle', 37.6213, -122.3790, 2000, 1, 1, 1),
  ('gf-003', 'default', 'Restricted Downtown', 'circle', 37.7849, -122.4094, 300, 0, 1, 1);

-- Customers
INSERT INTO customers (id, tenant_id, name, email, phone, license_number, loyalty_tier, total_rentals, total_spent) VALUES
  ('cust-001', 'default', 'John Doe', 'john@example.com', '+1-555-1001', 'DL-JD-2024', 'gold', 15, 4500),
  ('cust-002', 'default', 'Jane Smith', 'jane@example.com', '+1-555-1002', 'DL-JS-2024', 'silver', 8, 2200),
  ('cust-003', 'default', 'Bob Wilson', 'bob@example.com', '+1-555-1003', 'DL-BW-2024', 'bronze', 3, 750);

-- Notifications
INSERT INTO notifications (id, tenant_id, user_id, type, title, message, severity, is_read) VALUES
  ('notif-001', 'default', 'usr-001', 'maintenance', 'Brake Inspection Due', 'Vehicle FL-3456 requires immediate brake inspection', 'warning', 0),
  ('notif-002', 'default', 'usr-001', 'telemetry', 'Low Fuel Alert', 'Vehicle FL-3456 fuel level below 25%', 'warning', 0),
  ('notif-003', 'default', 'usr-002', 'geofence', 'Geofence Exit', 'Vehicle FL-5678 has left San Francisco HQ zone', 'info', 1);
