export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'PARKED' | 'SOLD';

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  make: string;
  model: string;
  status: VehicleStatus;
  attributes: Record<string, any>; // Dynamic fields
  createdAt: string;
  updatedAt: string;
}

export interface ImportConfig {
  fileType: 'EXCEL' | 'CSV';
  moduleSlug: string; // e.g. "service_records"
  mapping: Record<string, string>; // Excel Header -> DB Field
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT';
  entity: string;
  entityId: string;
  timestamp: string;
}
