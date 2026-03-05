# DriveFlow - Car Rental Management Platform Specification

## 1. Executive Summary
DriveFlow is a centralized, production-ready platform designed to streamline daily operations for car rental companies. It integrates fleet management, booking workflows, customer data, and internal communication into a single interface, reducing manual overhead and providing real-time visibility to management.

## 2. System Architecture

### 2.1 High-Level Architecture
*   **Frontend:** React 19 (Vite), Tailwind CSS, React Router, Recharts, Framer Motion.
*   **Backend (Recommended):** Node.js (NestJS or Express) or Go (Gin).
*   **Database:** PostgreSQL (Primary relational data), Redis (Caching & Session store).
*   **Real-Time Layer:** Socket.io or WebSocket (for Chat & Live Fleet Updates).
*   **Storage:** AWS S3 or Google Cloud Storage (Documents, Vehicle Photos).
*   **Infrastructure:** Dockerized containers orchestrated via Kubernetes or deployed on AWS ECS/Google Cloud Run.

### 2.2 Database Schema (Core Entities)

#### Users & Roles
*   **Users:** `id, email, password_hash, full_name, role_id, branch_id, last_login`
*   **Roles:** `id, name (Admin, Manager, Reception, Fleet, Accountant), permissions (JSON)`

#### Fleet Management
*   **Vehicles:** `id, plate, vin, make, model, year, category_id, branch_id, status (Available, Rented, Maintenance, Cleaning), mileage, fuel_level, last_service_date`
*   **Categories:** `id, name (Economy, SUV, Luxury), base_price_per_day, deposit_amount`
*   **MaintenanceLogs:** `id, vehicle_id, type, description, cost, start_date, end_date, status`

#### Operations
*   **Customers:** `id, full_name, email, phone, license_number, license_expiry, passport_number, blacklist_status, notes`
*   **Bookings:** `id, customer_id, vehicle_id, pickup_branch_id, return_branch_id, start_time, end_time, status (Pending, Confirmed, Active, Completed, Cancelled), total_amount, deposit_status`
*   **BookingExtras:** `id, booking_id, name (GPS, Child Seat), price`
*   **Inspections:** `id, booking_id, type (Pickup/Return), mileage, fuel_level, damage_notes, photos (JSON array), staff_id`

#### Finance
*   **Payments:** `id, booking_id, amount, method (Card, Cash, Transfer), type (Deposit, Rental, Fine), status, transaction_date`
*   **Invoices:** `id, booking_id, invoice_number, generated_at, pdf_url`

#### Communication
*   **Conversations:** `id, type (Direct, Group), name, created_at`
*   **Participants:** `id, conversation_id, user_id, last_read_at`
*   **Messages:** `id, conversation_id, sender_id, content, type (Text, Image, File), created_at, status (Sent, Delivered, Read)`

## 3. User Roles & Permissions

| Role | Dashboard | Bookings | Fleet | Customers | Finance | Chat | Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin** | Full | Full | Full | Full | Full | Full | Full |
| **Manager** | Full | Full | Full | Full | View | Full | Branch Only |
| **Reception** | View | Create/Edit | View | Create/Edit | Create | Full | - |
| **Fleet Staff**| View | View | Update Status | View | - | Full | - |
| **Accountant**| View | View | View | View | Full | Full | - |

## 4. API Design (RESTful)

### Core Endpoints
*   `GET /api/v1/dashboard/stats` - Aggregated KPIs.
*   `GET /api/v1/vehicles?status=available&branch=1` - Fleet search.
*   `POST /api/v1/bookings` - Create reservation.
*   `POST /api/v1/bookings/{id}/checkout` - Trigger pickup workflow.
*   `POST /api/v1/bookings/{id}/checkin` - Trigger return workflow.
*   `GET /api/v1/chat/conversations` - List user chats.
*   `POST /api/v1/chat/messages` - Send message.

## 5. Roadmap

### Phase 1: MVP (Current Focus)
*   **Staff Interface:** Dashboard, Fleet List, Booking Management (CRUD).
*   **Chat:** Real-time internal messaging (UI + Mock).
*   **Operations:** Basic Customer management.

### Phase 2: Operational Depth
*   **Workflows:** Digital inspection checklists with photo upload.
*   **Finance:** Invoice generation and payment tracking.
*   **Integrations:** Email notifications (SendGrid).

### Phase 3: Expansion
*   **Customer Portal:** Mobile app for end-users to book.
*   **IoT:** GPS integration for live vehicle tracking.
*   **Multi-Branch:** Advanced inventory balancing between locations.

## 6. UI/UX Structure
*   **Dashboard:** High-level metrics, urgent alerts.
*   **Fleet:** Grid/List view, status indicators, quick actions (Maintenance).
*   **Bookings:** Calendar view (Gantt style) and List view.
*   **Chat:** Split view (Sidebar + Conversation), "Viber-like" purple accents, double-tick read receipts.
