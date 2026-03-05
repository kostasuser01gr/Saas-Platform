# Car Rental Management Platform - Project Specification

## 1. Project Overview
**Goal:** Create a centralized platform for managing bookings, vehicles, customers, payments, staff operations, and internal communication.

## 2. Core Modules

### 2.1 Staff Program (Internal Operations)
*   **Bookings Management:** Create/Edit/Cancel reservations.
*   **Fleet Management:** Real-time availability, status tracking (Maintenance, Cleaning).
*   **Customer Management:** Profiles, document storage (DL, ID).
*   **Operations:** Check-in/Check-out flows, damage recording, fuel logging.
*   **Finance:** Invoicing, payment tracking.

### 2.2 Management Dashboard
*   **KPIs:** Active bookings, Utilization rate, Revenue, Outstanding payments.
*   **Visualizations:** Revenue charts, Fleet status distribution.
*   **Alerts:** Maintenance due, Overdue returns.

### 2.3 Real-Time Chat (Internal)
*   **UX:** Viber-like interface.
*   **Features:** 1-to-1, Groups, File sharing, Read receipts.
*   **Channels:** Operations, Fleet, Front Desk.

## 3. Technical Architecture (Recommended)

### Frontend
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS v4
*   **State Management:** React Context + Hooks (or TanStack Query for server state)
*   **Routing:** React Router DOM
*   **Charts:** Recharts

### Backend (Recommended for Production)
*   **Runtime:** Node.js
*   **Framework:** Express.js or NestJS
*   **Database:** PostgreSQL (Relational data is critical for bookings/payments)
*   **ORM:** Prisma or Drizzle
*   **Real-time:** Socket.io (for Chat and Live Fleet Updates)
*   **Auth:** Supabase Auth or Clerk

### Database Schema (Simplified Entity Model)
*   **Users:** `id, name, email, role, password_hash`
*   **Vehicles:** `id, make, model, license_plate, status, category_id, mileage`
*   **Customers:** `id, name, email, phone, license_number`
*   **Bookings:** `id, vehicle_id, customer_id, start_date, end_date, status, total_amount`
*   **Messages:** `id, sender_id, channel_id, content, timestamp, status`

## 4. User Roles
*   **Admin:** Full access.
*   **Manager:** Dashboard, Reports, Staff management.
*   **Front Desk:** Bookings, Check-in/out, Customer interactions.
*   **Fleet Staff:** Vehicle status updates, Maintenance logging.

## 5. MVP Roadmap

### Phase 1 (MVP - Current Scope)
*   [x] Project Scaffolding & Layout
*   [x] Management Dashboard (UI + Mock Data)
*   [x] AI Assistant (Gemini Integration)
*   [ ] Staff Booking Grid (Basic UI)
*   [ ] Fleet List (Basic UI)
*   [ ] Internal Chat (UI + Mock Data)

### Phase 2
*   Real Backend Integration (Postgres)
*   Socket.io for real-time chat
*   Document Upload (S3/Blob Storage)
*   Auth Integration

### Phase 3
*   Customer Portal (Public facing)
*   Payment Gateway Integration (Stripe)
*   Mobile App for Fleet Staff
