# Unified Car Rental SaaS Architecture

## 📡 Data Flow & Integration

1.  **Ingestion (Fleet-OPS & fleetops-hub):**
    *   Vehicles are added via the Dashboard or imported from CSV/External APIs.
    *   Prisma (PostgreSQL) stores the authoritative record of the fleet.

2.  **Telemetry (auraring-dashboard):**
    *   A Node.js background worker on Railway listens to IoT webhooks.
    *   Updates the `Telemetry` table in PostgreSQL.
    *   Triggers alerts in the Dashboard if fuel is low or a geofence is breached.

3.  **Customer Experience (Premium AI Chat):**
    *   A Next.js frontend on Vercel hosts the AI Concierge.
    *   Uses Gemini 1.5 Pro to process natural language bookings.
    *   Calls the `apps/fleet-ops` API to check availability and create bookings.

4.  **Operational Workflow (kinsen-ops):**
    *   Mobile-optimized views for staff (cleaners/mechanics).
    *   Real-time updates via WebSockets (or Polling) for new tasks.
    *   Integrated signature pad and damage mapping for rental handovers.

5.  **Analytics (sellution-dashboard):**
    *   Aggregate sales and booking data from PostgreSQL.
    *   AI-generated insights (Gemini) explaining revenue trends and predicting future demand.

## 🚀 Deployment Config

### Vercel (Frontend)
*   **Root Directory:** `apps/dashboard` (or a unified shell).
*   **Framework:** Next.js.
*   **Env Vars:** `GEMINI_API_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_API_URL`.

### Railway (Backend)
*   **Service 1 (API):** `apps/api` (Refactored from fleet-ops).
*   **Service 2 (Database):** PostgreSQL instance.
*   **Service 3 (Cache):** Redis instance.
*   **Service 4 (Worker):** Background processing for IoT/Telemetry.
