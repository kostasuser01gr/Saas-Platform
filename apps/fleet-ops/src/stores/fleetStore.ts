import { create } from 'zustand';
import { api } from '../lib/api';

interface Vehicle {
  id: string;
  license: string;
  make: string;
  model: string;
  year?: number;
  vin?: string;
  status: 'Available' | 'Maintenance' | 'On Rental' | 'Sold' | 'Decommissioned';
  image?: string;
  daily_rate: number;
  total_revenue: number;
  rental_count: number;
  mileage: number;
  predictive_score: number;
  location_lat?: number;
  location_lng?: number;
  location_label?: string;
  last_service?: string;
  next_service_due?: string;
  assigned_driver_id?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  is_read: number;
  created_at: string;
}

interface FleetState {
  vehicles: Vehicle[];
  selectedVehicle: (Vehicle & { telemetry?: any; recentMaintenance?: any[] }) | null;
  notifications: Notification[];
  unreadCount: number;
  analyticsOverview: any | null;
  isLoading: boolean;
  error: string | null;

  fetchVehicles: (params?: Record<string, any>) => Promise<void>;
  fetchVehicle: (id: string) => Promise<void>;
  createVehicle: (data: any) => Promise<void>;
  updateVehicle: (id: string, data: any) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;

  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;

  fetchAnalyticsOverview: () => Promise<void>;

  clearError: () => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  notifications: [],
  unreadCount: 0,
  analyticsOverview: null,
  isLoading: false,
  error: null,

  fetchVehicles: async (params) => {
    try {
      set({ isLoading: true });
      const data = await api.getVehicles(params);
      set({ vehicles: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchVehicle: async (id) => {
    try {
      set({ isLoading: true });
      const vehicle = await api.getVehicle(id);
      set({ selectedVehicle: vehicle, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createVehicle: async (data) => {
    try {
      await api.createVehicle(data);
      await get().fetchVehicles();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateVehicle: async (id, data) => {
    try {
      await api.updateVehicle(id, data);
      await get().fetchVehicles();
      if (get().selectedVehicle?.id === id) await get().fetchVehicle(id);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteVehicle: async (id) => {
    try {
      await api.deleteVehicle(id);
      if (get().selectedVehicle?.id === id) set({ selectedVehicle: null });
      await get().fetchVehicles();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  fetchNotifications: async () => {
    try {
      const data = await api.getNotifications({ limit: 20 });
      set({ notifications: data.data, unreadCount: data.unreadCount });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  markNotificationRead: async (id) => {
    await api.markNotificationRead(id);
    await get().fetchNotifications();
  },

  markAllRead: async () => {
    await api.markAllNotificationsRead();
    await get().fetchNotifications();
  },

  fetchAnalyticsOverview: async () => {
    try {
      const data = await api.getAnalyticsOverview();
      set({ analyticsOverview: data });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  clearError: () => set({ error: null }),
}));
