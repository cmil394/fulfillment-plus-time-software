# FulfillmentPlus-Time-Software

Time tracking software for Fulfillment Plus designed to track, manage and analyze data on customers, tasks and employees

### Features

- Employee time tracking and management
- Customer and task management
- Data analytics and reporting via charts
- Admin dashboard with role-based access

## Local Setup

- **Frontend:** http://localhost:5173/
- **Backend:** http://localhost:3001

### Prerequisites

- Node.js
- npm
- PostgreSQL (local server)

### Environment Variables

Both folders contain a `.env.sample` file. Copy each one and rename it to `.env`, then fill in your values.

**Backend** (`/backend/.env`):
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_EMAIL` | Default admin login email |
| `ADMIN_PASSWORD` | Default admin login password |

**Frontend** (`/frontend/.env`):
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_ADMIN_EMAIL` | Admin email (must match backend) |
| `VITE_ADMIN_PASSWORD` | Admin password (must match backend) |

**Setting up your `DATABASE_URL`:**

The connection string follows this format:

```
postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME?schema=public
```

1. Replace `USERNAME` and `PASSWORD` with your local PostgreSQL credentials
2. Replace `DATABASE_NAME` with whatever you want to call the database (e.g. `timetracking_db`)
3. Make sure PostgreSQL is running locally before starting the backend

### Steps

1. Run `setup.bat` to install all dependencies
2. Run `run.bat` to start the frontend and backend in separate terminals
3. Open http://localhost:5173/ in your browser

> **Note:** These scripts are Windows-only (.bat files).

## Tech Stack

### Backend

- **Node.js**
- **TypeScript**
- **NestJS**
- **Prisma**
- **JWT**
- **bcrypt**

### Frontend

- **TypeScript**
- **React**
- **Recharts**
- **CSS**

### Database

- **PostgreSQL**
- **Neon / Supabase**
