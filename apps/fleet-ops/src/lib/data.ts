export interface Vehicle {
  id: string;
  license: string;
  make: string;
  model: string;
  status: "Available" | "Maintenance" | "On Rental" | "Sold";
  location: string;
  dailyRate: number;
  totalRevenue: number;
  vin: string;
  image: string;
  rentalCount: number;
  // New Telemetry Data
  fuelLevel?: number; // 0-100
  batteryHealth?: number; // 0-100
  tirePressure?: [number, number, number, number]; // PSI
  mileage?: number;
  predictiveScore?: number; // 0-100 (100 is perfect health)
  lastService?: string;
}

export interface OperationLog {
  id: string;
  action: string;
  details: string;
  status: "Success" | "Pending" | "Failed";
  timestamp: string;
  vehicleId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "5789eff0-9908-48fd-410f-7080b1d77995",
    license: "ABC-1234",
    make: "BMW",
    model: "X5",
    status: "Available",
    location: "Daily X9",
    dailyRate: 45.00,
    totalRevenue: 36000,
    vin: "WA123BX5678904567",
    image: "https://images.unsplash.com/photo-1556189250-72ba95452da9?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3",
    rentalCount: 38,
    fuelLevel: 78,
    batteryHealth: 98,
    tirePressure: [32, 32, 31, 32],
    mileage: 12450,
    predictiveScore: 92,
    lastService: "2 weeks ago"
  },
  {
    id: "ford-focus-001",
    license: "XYZ-9876",
    make: "Ford",
    model: "Focus",
    status: "Maintenance",
    location: "Service Bay 2",
    dailyRate: 30.00,
    totalRevenue: 25000,
    vin: "1FAHP3F21CL29384",
    image: "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3",
    rentalCount: 42,
    fuelLevel: 12,
    batteryHealth: 85,
    tirePressure: [28, 29, 28, 28],
    mileage: 45200,
    predictiveScore: 45,
    lastService: "3 months ago"
  },
  {
    id: "tesla-model-3-001",
    license: "ELN-4200",
    make: "Tesla",
    model: "Model 3",
    status: "On Rental",
    location: "Downtown",
    dailyRate: 85.00,
    totalRevenue: 45000,
    vin: "5YJ3E1EA1JF00001",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3",
    rentalCount: 15,
    fuelLevel: 88,
    batteryHealth: 100,
    tirePressure: [42, 42, 42, 42],
    mileage: 8500,
    predictiveScore: 98,
    lastService: "1 month ago"
  },
  {
    id: "toyota-corolla-001",
    license: "COR-5555",
    make: "Toyota",
    model: "Corolla",
    status: "Available",
    location: "Lot A",
    dailyRate: 28.00,
    totalRevenue: 18000,
    vin: "2T1BURHE9KC12345",
    image: "https://images.unsplash.com/photo-1623869675781-80e653949129?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3",
    rentalCount: 55,
    fuelLevel: 45,
    batteryHealth: 90,
    tirePressure: [30, 30, 30, 30],
    mileage: 62000,
    predictiveScore: 78,
    lastService: "6 months ago"
  },
  {
    id: "honda-accord-001",
    license: "HND-7777",
    make: "Honda",
    model: "Accord",
    status: "Sold",
    location: "Archive",
    dailyRate: 35.00,
    totalRevenue: 32000,
    vin: "1HGCR2F34KA00001",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3",
    rentalCount: 60,
    fuelLevel: 0,
    batteryHealth: 0,
    tirePressure: [0, 0, 0, 0],
    mileage: 120000,
    predictiveScore: 0,
    lastService: "1 year ago"
  },
];

export const operationsLog: OperationLog[] = [
  {
    id: "log-001",
    action: "Wash Slot: BMW X5",
    details: "S000000",
    status: "Success",
    timestamp: "10:42 AM",
    vehicleId: "5789eff0-9908-48fd-410f-7080b1d77995",
  },
  {
    id: "log-002",
    action: "Rental Sale",
    details: "6 - B0000 Sug Better",
    status: "Success",
    timestamp: "09:15 AM",
    vehicleId: "5789eff0-9908-48fd-410f-7080b1d77995",
  },
  {
    id: "log-003",
    action: "Toyota Corolla out on Rental",
    details: "Rental ID: #99283",
    status: "Success",
    timestamp: "Yesterday",
    vehicleId: "toyota-corolla-001",
  },
  {
    id: "log-004",
    action: "Mark Recnes Rental",
    details: "System Auto-log",
    status: "Success",
    timestamp: "Yesterday",
  },
  {
    id: "log-005",
    action: "Ford Focus",
    details: "Maintenance Check",
    status: "Success",
    timestamp: "2 days ago",
    vehicleId: "ford-focus-001",
  },
];

export const initialChatHistory: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Set vehicle status for Ford Focus to maintenance",
    timestamp: "10:30 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "I've updated the status of Ford Focus (XYZ-9876) to 'Maintenance'. A service ticket has been created.",
    timestamp: "10:30 AM",
  },
  {
    id: "msg-3",
    role: "user",
    content: "Log a Wash for the BMW X5",
    timestamp: "10:32 AM",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: "Wash logged for BMW X5 (ABC-1234). Slot S000000 assigned.",
    timestamp: "10:32 AM",
  },
];
