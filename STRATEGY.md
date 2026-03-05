# Product Integration Strategy: Car Rental SaaS Unified Platform

## 1. Unified Architecture
- **Monorepo:** Turborepo for orchestration.
- **Shared Components:** `packages/ui` (Radix + Tailwind) extracted from Premium AI Chat and Fleet-OPS.
- **Shared Database:** `packages/db` (Prisma + PostgreSQL) combining Fleet management, Sales CRM, and User accounts.

## 2. Module Mapping
| Module | Source Project | Key Features |
| --- | --- | --- |
| **Fleet Ops** | `Fleet-OPS`, `fleetops-hub` | Vehicle tracking, Maintenance logs, Inventory management. |
| **Telemetry** | `auraring-dashboard` | Real-time vehicle "vitals", Odometer, Fuel/EV levels. |
| **CRM & Sales** | `sellution-dashboard` | Customer LTV, Revenue analytics, Dynamic pricing. |
| **Staff Ops** | `kinsen-ops` | Mechanic tasks, Cleaner checklists, Rental check-in/out. |
| **AI Concierge** | `Premium AI Chat Platform` | AI-driven bookings, Damage assessment vision, Support. |

## 3. Tech Stack
- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **AI:** Google Gemini 1.5 Pro / Flash
- **Infrastructure:** Railway (Backend/DB) + Vercel (Frontend)

## 4. Immediate Roadmap
1. **Unification:** Extract common UI components into `packages/ui`.
2. **Database:** Initialize Prisma schema in `packages/db`.
3. **Gateway:** Build the unified `apps/dashboard` shell.
