# SolarServ Solutions: Product Requirements Document

## 1. Project Overview
SolarServ Solutions is a B2C solar panel maintenance and cleaning platform. The ecosystem consists of a homeowner-facing mobile/web app and an operator-facing admin dashboard, supported by a unified data model and a sustainable, trustworthy design language.

## 2. Product Pillars

### I. User-Facing App (Homeowner)
*   **Onboarding & Auth:** Email/password signup, login, validation, and password recovery.
*   **Profile Setup:** Multi-step form (name, contact, address with map pin, notifications).
*   **Solar Asset Registration:** Guided flow for logging panel brand, capacity (kW), count, install date, photo upload, and rooftop map placement.
*   **Service Booking:** On-demand cleaning/inspection/maintenance requests with scheduling and confirmation.
*   **Service History:** Timeline of past/upcoming requests with status badges.
*   **Notifications:** Alerts for bookings, technician status, and reminders.

### II. Operator / Admin Dashboard (Web)
*   **KPI Summary:** Cards for users, assets, requests, monthly completions, and efficiency scores.
*   **Geographic Map View:** Interactive map with cluster markers and individual installation pins.
*   **Service Request Management:** Filterable data table for incoming requests and assignments.
*   **User Management:** Searchable account list with deep-dive profiles.
*   **Technician Dispatch:** Drag-and-drop calendar for scheduling and assignments.

### III. Data Model & System Design
*   **Entities:** Users, Solar Assets, Service Requests, Technicians, Notifications.
*   **Access Control:**
    *   Homeowners: Own data only.
    *   Operators: All data (Read/Update).
    *   Admins: Full CRUD.
*   **Relationships:** Assets belong to Users; Service Requests link Assets, Users, and Technicians.

### IV. Design System & Visual Language
*   **Brand Tone:** Clean, trustworthy, sustainable.
*   **Palette:**
    *   Primary: Deep Navy (#0F1F3D)
    *   Accent: Solar Amber (#F59E0B)
    *   Surface: White / Soft Grey neutrals.
*   **Typography:** Sans-serif (Regular 400, Medium 500).
*   **Grid:** 4px base grid, 16px/24px padding.
*   **Compliance:** WCAG 2.1 AA.

## 3. Technical Specifications
*   **Responsive:** Mobile-first for User App; Desktop-first for Admin Dashboard.
*   **Breakpoints:** 768px (Tablet), 1280px (Desktop).
