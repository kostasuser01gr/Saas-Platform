const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private onUnauthorized?: () => void;

  setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('fleet_token', token);
    localStorage.setItem('fleet_refresh_token', refreshToken);
  }

  loadTokens() {
    this.token = localStorage.getItem('fleet_token');
    this.refreshToken = localStorage.getItem('fleet_refresh_token');
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('fleet_token');
    localStorage.removeItem('fleet_refresh_token');
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, params } = options;

    let url = `${API_BASE}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, String(value));
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    let response = await fetch(url, config);

    // Auto-refresh on 403
    if (response.status === 403 && this.refreshToken) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        config.headers = { ...config.headers as any, Authorization: `Bearer ${this.token}` };
        response = await fetch(url, config);
      }
    }

    if (response.status === 401 || (response.status === 403 && !this.refreshToken)) {
      this.clearTokens();
      this.onUnauthorized?.();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async tryRefresh(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      this.token = data.token;
      localStorage.setItem('fleet_token', data.token);
      return true;
    } catch {
      return false;
    }
  }

  // Auth
  login(email: string, password: string) { return this.request<any>('/auth/login', { method: 'POST', body: { email, password } }); }
  register(data: { email: string; password: string; name: string; role?: string }) { return this.request<any>('/auth/register', { method: 'POST', body: data }); }
  getMe() { return this.request<any>('/auth/me'); }
  logout() { return this.request<any>('/auth/logout', { method: 'POST' }); }

  // Vehicles
  getVehicles(params?: Record<string, any>) { return this.request<any>('/vehicles', { params }); }
  getVehicle(id: string) { return this.request<any>(`/vehicles/${id}`); }
  createVehicle(data: any) { return this.request<any>('/vehicles', { method: 'POST', body: data }); }
  updateVehicle(id: string, data: any) { return this.request<any>(`/vehicles/${id}`, { method: 'PUT', body: data }); }
  deleteVehicle(id: string) { return this.request<any>(`/vehicles/${id}`, { method: 'DELETE' }); }
  getVehicleLocations(id: string, params?: Record<string, any>) { return this.request<any>(`/vehicles/${id}/locations`, { params }); }

  // Telemetry
  getLatestTelemetry() { return this.request<any>('/telemetry/latest'); }
  getVehicleTelemetry(vehicleId: string, params?: Record<string, any>) { return this.request<any>(`/telemetry/vehicle/${vehicleId}`, { params }); }
  ingestTelemetry(data: any) { return this.request<any>('/telemetry', { method: 'POST', body: data }); }

  // Operations
  getOperations(params?: Record<string, any>) { return this.request<any>('/operations', { params }); }
  createOperation(data: any) { return this.request<any>('/operations', { method: 'POST', body: data }); }

  // Maintenance
  getMaintenanceTasks(params?: Record<string, any>) { return this.request<any>('/maintenance', { params }); }
  getMaintenanceTask(id: string) { return this.request<any>(`/maintenance/${id}`); }
  createMaintenanceTask(data: any) { return this.request<any>('/maintenance', { method: 'POST', body: data }); }
  updateMaintenanceTask(id: string, data: any) { return this.request<any>(`/maintenance/${id}`, { method: 'PUT', body: data }); }
  deleteMaintenanceTask(id: string) { return this.request<any>(`/maintenance/${id}`, { method: 'DELETE' }); }
  getMaintenanceCalendar(year: number, month: number) { return this.request<any>(`/maintenance/calendar/${year}/${month}`); }
  getOverdueMaintenance() { return this.request<any>('/maintenance/overdue'); }

  // Drivers
  getDrivers(params?: Record<string, any>) { return this.request<any>('/drivers', { params }); }
  getDriver(id: string) { return this.request<any>(`/drivers/${id}`); }
  createDriver(data: any) { return this.request<any>('/drivers', { method: 'POST', body: data }); }
  updateDriver(id: string, data: any) { return this.request<any>(`/drivers/${id}`, { method: 'PUT', body: data }); }
  deleteDriver(id: string) { return this.request<any>(`/drivers/${id}`, { method: 'DELETE' }); }
  recordTrip(driverId: string, data: any) { return this.request<any>(`/drivers/${driverId}/trips`, { method: 'POST', body: data }); }
  getDriverBehavior(id: string) { return this.request<any>(`/drivers/${id}/behavior`); }

  // Customers
  getCustomers(params?: Record<string, any>) { return this.request<any>('/customers', { params }); }
  getCustomer(id: string) { return this.request<any>(`/customers/${id}`); }
  createCustomer(data: any) { return this.request<any>('/customers', { method: 'POST', body: data }); }
  updateCustomer(id: string, data: any) { return this.request<any>(`/customers/${id}`, { method: 'PUT', body: data }); }
  deleteCustomer(id: string) { return this.request<any>(`/customers/${id}`, { method: 'DELETE' }); }

  // Parts
  getParts(params?: Record<string, any>) { return this.request<any>('/parts', { params }); }
  getPart(id: string) { return this.request<any>(`/parts/${id}`); }
  createPart(data: any) { return this.request<any>('/parts', { method: 'POST', body: data }); }
  updatePart(id: string, data: any) { return this.request<any>(`/parts/${id}`, { method: 'PUT', body: data }); }
  deletePart(id: string) { return this.request<any>(`/parts/${id}`, { method: 'DELETE' }); }
  getLowStockParts() { return this.request<any>('/parts/low-stock'); }
  usePart(id: string, data: any) { return this.request<any>(`/parts/${id}/use`, { method: 'POST', body: data }); }

  // Geofences
  getGeofences() { return this.request<any>('/geofence'); }
  getGeofence(id: string) { return this.request<any>(`/geofence/${id}`); }
  createGeofence(data: any) { return this.request<any>('/geofence', { method: 'POST', body: data }); }
  updateGeofence(id: string, data: any) { return this.request<any>(`/geofence/${id}`, { method: 'PUT', body: data }); }
  deleteGeofence(id: string) { return this.request<any>(`/geofence/${id}`, { method: 'DELETE' }); }
  checkGeofence(data: any) { return this.request<any>('/geofence/check', { method: 'POST', body: data }); }

  // Notifications
  getNotifications(params?: Record<string, any>) { return this.request<any>('/notifications', { params }); }
  markNotificationRead(id: string) { return this.request<any>(`/notifications/${id}/read`, { method: 'PUT' }); }
  markAllNotificationsRead() { return this.request<any>('/notifications/read-all', { method: 'PUT' }); }
  getNotificationPreferences() { return this.request<any>('/notifications/preferences'); }
  updateNotificationPreferences(preferences: any[]) { return this.request<any>('/notifications/preferences', { method: 'PUT', body: { preferences } }); }

  // Analytics
  getAnalyticsOverview() { return this.request<any>('/analytics/overview'); }
  getRevenueAnalytics() { return this.request<any>('/analytics/revenue'); }
  getUtilizationAnalytics() { return this.request<any>('/analytics/utilization'); }
  getMaintenanceCostAnalytics() { return this.request<any>('/analytics/maintenance-costs'); }
  getFleetHealthAnalytics() { return this.request<any>('/analytics/health'); }

  // Audit
  getAuditLogs(params?: Record<string, any>) { return this.request<any>('/audit', { params }); }
  getEntityAuditTrail(type: string, id: string) { return this.request<any>(`/audit/entity/${type}/${id}`); }

  // AI
  chatWithAI(message: string, sessionId?: string) { return this.request<any>('/ai/chat', { method: 'POST', body: { message, sessionId } }); }
  queryAI(question: string) { return this.request<any>('/ai/query', { method: 'POST', body: { question } }); }
  getChatSessions() { return this.request<any>('/ai/sessions'); }
  getChatMessages(sessionId: string) { return this.request<any>(`/ai/sessions/${sessionId}/messages`); }
  deleteChatSession(id: string) { return this.request<any>(`/ai/sessions/${id}`, { method: 'DELETE' }); }
  getAnomalies() { return this.request<any>('/ai/anomalies'); }

  // Health
  healthCheck() { return this.request<any>('/health'); }
}

export const api = new ApiClient();
