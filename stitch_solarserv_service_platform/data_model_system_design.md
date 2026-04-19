# SolarServ Solutions: Data Model & System Design

## 1. Database Schema (Entities)

### Users
- `id` (UUID, PK)
- `name` (String)
- `email` (String, Unique)
- `hashed_password` (String)
- `phone` (String)
- `address` (Text)
- `role` (Enum: 'homeowner', 'operator', 'admin')
- `created_at` (Timestamp)

### Solar Assets
- `id` (UUID, PK)
- `user_id` (UUID, FK -> Users.id)
- `panel_brand` (String)
- `capacity_kw` (Decimal)
- `panel_count` (Integer)
- `install_date` (Date)
- `photo_url` (String)
- `lat` (Float)
- `lng` (Float)
- `property_zone` (String) - *For geographic dispatch optimization*

### Service Requests
- `id` (UUID, PK)
- `asset_id` (UUID, FK -> Solar Assets.id)
- `user_id` (UUID, FK -> Users.id)
- `service_type` (Enum: 'cleaning', 'inspection', 'maintenance')
- `requested_datetime` (Timestamp)
- `assigned_technician_id` (UUID, FK -> Technicians.id, Nullable)
- `status` (Enum: 'Scheduled', 'In Progress', 'Completed', 'Cancelled')
- `notes` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Technicians
- `id` (UUID, PK)
- `name` (String)
- `phone` (String)
- `availability_schedule` (JSONB) - *Stores weekly working hours*
- `assigned_zone` (String)

### Notifications
- `id` (UUID, PK)
- `user_id` (UUID, FK -> Users.id)
- `type` (Enum: 'booking_confirm', 'tech_en_route', 'service_complete', 'reminder')
- `message` (Text)
- `read_at` (Timestamp, Nullable)
- `created_at` (Timestamp)

## 2. Relationships & Constraints
- **One-to-Many:** User -> Solar Assets (A user can have multiple installations).
- **One-to-Many:** User -> Service Requests.
- **One-to-Many:** Solar Asset -> Service Requests.
- **One-to-Many:** Technician -> Service Requests.

## 3. Access Control Rules (RBAC)
- **Homeowners:** 
  - READ: Own profile, own assets, own service requests, own notifications.
  - CREATE: Service requests, assets.
  - UPDATE: Own profile.
- **Operators:**
  - READ: All data.
  - CREATE/UPDATE: Service requests, technician assignments, assets.
- **Admins:**
  - FULL CRUD: All entities, including user roles and system configurations.

## 4. Key API Endpoints (Planned)
- `POST /auth/signup` & `POST /auth/login`
- `GET /assets` (User specific)
- `POST /bookings/create`
- `GET /admin/kpi-summary`
- `PATCH /admin/dispatch/:request_id`
