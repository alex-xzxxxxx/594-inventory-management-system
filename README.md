# Inventory and Warehouse Management System (IWMS)

CISC 594 semester project: a simple inventory and warehouse management application with an Angular frontend and Spring Boot backend.

## Structure

- `inventory-system-ui` — Angular frontend
- `inventory-system-backend` — Spring Boot REST API with in-memory mock data

## Current scope: Version 1

- Administrator login (demo authentication)
- Product management
- Supplier management
- Inventory stock-in / stock-out
- Purchase order creation and receiving
- In-memory data; no external database required yet

## Business workflow

Supplier -> Product -> Purchase Order -> Receive Purchase Order -> Inventory Update

## Run backend

```bash
cd inventory-system-backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`

## Run frontend

```bash
cd inventory-system-ui
npm install
npm start
```

Frontend: `http://localhost:4200`

The frontend expects the backend at `http://localhost:8080/api`.

## Demo login

- Username: `admin`
- Password: `admin123`

Authentication is intentionally lightweight for the initial project version; it is not production security.

## Planned Version 2

- Analytics dashboard
- Inventory monitoring and low-stock alerts
- Reports and CSV/PDF export
- Audit log
