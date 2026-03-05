-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK(role IN ('admin','fleet_manager','driver','viewer')),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  avatar_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tenants (multi-tenant)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  license TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vin TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','Maintenance','On Rental','Sold','Decommissioned')),
  image TEXT,
  daily_rate REAL DEFAULT 0,
  total_revenue REAL DEFAULT 0,
  rental_count INTEGER DEFAULT 0,
  mileage REAL DEFAULT 0,
  last_service TEXT,
  next_service_due TEXT,
  predictive_score REAL DEFAULT 100,
  location_lat REAL,
  location_lng REAL,
  location_label TEXT,
  assigned_driver_id TEXT REFERENCES drivers(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Telemetry
CREATE TABLE IF NOT EXISTS telemetry (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  fuel_level REAL,
  battery_health REAL,
  tire_pressure_fl REAL,
  tire_pressure_fr REAL,
  tire_pressure_rl REAL,
  tire_pressure_rr REAL,
  engine_temp REAL,
  speed REAL,
  odometer REAL,
  location_lat REAL,
  location_lng REAL,
  heading REAL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- GPS Location History
CREATE TABLE IF NOT EXISTS location_history (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  speed REAL,
  heading REAL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Operations Log
CREATE TABLE IF NOT EXISTS operations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  vehicle_id TEXT REFERENCES vehicles(id),
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Maintenance
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  type TEXT NOT NULL CHECK(type IN ('oil_change','tire_rotation','brake_inspection','engine_service','transmission','electrical','body_repair','general','recall')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','in_progress','completed','cancelled','overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high','critical')),
  scheduled_date TEXT,
  completed_date TEXT,
  cost REAL DEFAULT 0,
  technician TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Parts Inventory
CREATE TABLE IF NOT EXISTS parts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  part_number TEXT UNIQUE,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  unit_cost REAL DEFAULT 0,
  supplier TEXT,
  location TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS maintenance_parts (
  id TEXT PRIMARY KEY,
  maintenance_id TEXT NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
  part_id TEXT NOT NULL REFERENCES parts(id),
  quantity_used INTEGER NOT NULL DEFAULT 1
);

-- Customers (CRM)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  license_number TEXT,
  loyalty_tier TEXT DEFAULT 'bronze' CHECK(loyalty_tier IN ('bronze','silver','gold','platinum')),
  total_rentals INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  license_number TEXT,
  license_expiry TEXT,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','suspended')),
  behavior_score REAL DEFAULT 100,
  total_trips INTEGER DEFAULT 0,
  total_distance REAL DEFAULT 0,
  harsh_braking_count INTEGER DEFAULT 0,
  speeding_count INTEGER DEFAULT 0,
  idle_time_minutes INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Driver Trips
CREATE TABLE IF NOT EXISTS driver_trips (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  start_time TEXT NOT NULL,
  end_time TEXT,
  start_lat REAL,
  start_lng REAL,
  end_lat REAL,
  end_lng REAL,
  distance REAL DEFAULT 0,
  max_speed REAL,
  avg_speed REAL,
  harsh_braking_events INTEGER DEFAULT 0,
  speeding_events INTEGER DEFAULT 0,
  idle_time_minutes INTEGER DEFAULT 0,
  route_geojson TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Geofences
CREATE TABLE IF NOT EXISTS geofences (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'circle' CHECK(type IN ('circle','polygon')),
  center_lat REAL,
  center_lng REAL,
  radius_meters REAL,
  polygon_coords TEXT,
  alert_on_enter INTEGER DEFAULT 1,
  alert_on_exit INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS geofence_events (
  id TEXT PRIMARY KEY,
  geofence_id TEXT NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  event_type TEXT NOT NULL CHECK(event_type IN ('enter','exit')),
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  user_id TEXT REFERENCES users(id),
  type TEXT NOT NULL CHECK(type IN ('maintenance','geofence','telemetry','system','alert','info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK(severity IN ('info','warning','error','critical')),
  is_read INTEGER DEFAULT 0,
  entity_type TEXT,
  entity_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  email_enabled INTEGER DEFAULT 1,
  push_enabled INTEGER DEFAULT 1,
  sms_enabled INTEGER DEFAULT 0,
  UNIQUE(user_id, type)
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  user_id TEXT REFERENCES users(id),
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- AI Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  title TEXT DEFAULT 'New Chat',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle ON telemetry(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded ON telemetry(recorded_at);
CREATE INDEX IF NOT EXISTS idx_location_history_vehicle ON location_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_location_history_recorded ON location_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_operations_vehicle ON operations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_operations_created ON operations(created_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON maintenance_tasks(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled ON maintenance_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_geofence_events_vehicle ON geofence_events(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_driver_trips_driver ON driver_trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_trips_vehicle ON driver_trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_parts_tenant ON parts(tenant_id);
