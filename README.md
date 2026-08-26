# SalesFlow CRM - CRM & Sales Pipeline SaaS

SalesFlow CRM is a full-stack CRM and sales pipeline web application built as a portfolio project for a fresh graduate. It helps a sales team manage companies, contacts, leads, deals, follow-up activities, sales stages, notifications, and performance from one workspace.

## Technology Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- Pusher JS (optional real-time notifications)

### Backend
- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- express-session
- bcrypt
- class-validator
- Nodemailer (optional email notifications)
- Pusher (optional real-time notifications)

## Main Features

1. User registration, login, logout, and session authentication.
2. Role-based access with Admin, Manager, and Sales roles.
3. Admin team-user management.
4. Personal profile and password update.
5. Company CRUD with search, sorting, and pagination.
6. Contact CRUD connected to companies.
7. Lead CRUD with source, value, status, company, contact, and sales-person assignment.
8. Convert a lead into a sales deal.
9. Deal CRUD with value, stage, expected close date, company/contact, and owner.
10. Drag-and-drop sales pipeline: NEW -> CONTACTED -> PROPOSAL -> NEGOTIATION -> WON/LOST.
11. Deal history records when a deal is created, updated, or moved between stages.
12. Notes on leads and deals.
13. Calls, meetings, emails, notes, and follow-up activities with due dates and completion status.
14. CRM dashboard with leads, active deals, won/lost deals, expected revenue, won revenue, pipeline counts, upcoming activities, and recently updated deals.
15. Stored in-app notifications.
16. Optional Pusher real-time notifications.
17. Optional email notifications for user/deal assignments.
18. Search, filters, newest/oldest sorting, and pagination on major list pages.

## Project Workflow

Potential customer -> Lead -> Contacted/Qualified -> Convert to Deal -> Move through Sales Pipeline -> Won or Lost -> Dashboard reporting

## Before Running in VS Code

You need:

- Node.js 20 or newer
- npm
- PostgreSQL installed and running
- pgAdmin (recommended, but optional)
- VS Code

Pusher and Gmail/SMTP are optional. The application works without them.

---

# Step 1 - Create PostgreSQL Database

Open pgAdmin, connect to your PostgreSQL server, open Query Tool, and run:

```sql
CREATE DATABASE crm_sales_pipeline;
```

If the database already exists, do not create it again.

Remember your PostgreSQL username and password. A common local username is `postgres`.

# Step 2 - Open the Project in VS Code

Open the folder:

```text
crm-sales-pipeline-saas
```

You should see:

```text
crm-sales-pipeline-saas/
  backend/
  frontend/
  README.md
```

# Step 3 - Configure Backend Environment

Open a terminal in VS Code:

```bash
cd backend
```

Copy `.env.example` to `.env`.

Windows Command Prompt:

```bat
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Then open `backend/.env` and set your PostgreSQL password:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=crm_sales_pipeline
DB_SYNC=true
```

Keep this for local development:

```env
FRONTEND_URL=http://localhost:3200
PORT=3001
```

Change the session secret to your own value:

```env
SESSION_SECRET=my_crm_project_secret_2026_change_this
```

## Optional Pusher

If you already have a Pusher account, add:

```env
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=ap2
```

If you leave these blank, the CRM still runs normally; only real-time pop-up notifications are disabled.

## Optional Email

For Gmail SMTP you can configure:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_google_app_password
MAIL_FROM=SalesFlow CRM <your_email@gmail.com>
```

Use a Google App Password, not your normal Gmail password. If you leave mail credentials blank, the CRM still runs normally.

# Step 4 - Install Backend Packages

Inside `backend`:

```bash
npm install
```

# Step 5 - Create the First Admin User

Still inside `backend`, run:

```bash
npm run seed
```

Default seed account:

```text
Email: admin@crm.local
Password: Admin123!
```

You can change these values in `backend/.env` before running the seed:

```env
SEED_ADMIN_NAME=CRM Admin
SEED_ADMIN_EMAIL=admin@crm.local
SEED_ADMIN_PASSWORD=Admin123!
```

# Step 6 - Run Backend

```bash
npm run start:dev
```

Backend should run at:

```text
http://localhost:3001
```

Keep this terminal running.

# Step 7 - Configure Frontend

Open a second VS Code terminal:

```bash
cd frontend
```

Copy `.env.local.example` to `.env.local`.

Windows Command Prompt:

```bat
copy .env.local.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

The basic frontend configuration is:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For Pusher, if configured in backend, add the same public key and cluster:

```env
NEXT_PUBLIC_PUSHER_KEY=YOUR_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
```

# Step 8 - Install Frontend Packages

```bash
npm install
```

# Step 9 - Run Frontend

```bash
npm run dev
```

Frontend should run at:

```text
http://localhost:3200
```

Open that address in your browser.

# Step 10 - Login

Use the seeded admin account:

```text
Email: admin@crm.local
Password: Admin123!
```

After login, you can create Managers and Sales users from Team Users.

---

# Recommended Demo Data Order

For the first test, add data in this order:

1. Create a Company.
2. Create a Contact and select that Company.
3. Create a Sales user from Team Users.
4. Create a Lead and assign it to the Sales user.
5. Change the Lead to QUALIFIED.
6. Open Leads and click Convert.
7. Open Pipeline and drag the new Deal between columns.
8. Open the Deal to add Notes and Follow-up Activities.
9. Mark the Deal WON.
10. Return to Dashboard to see the updated totals and revenue.

# Roles

## Admin
- Full CRM access
- Create/edit/delete team users
- Change user roles
- Manage CRM records

## Manager
- View team users
- Manage companies, contacts, leads, deals, activities, and pipeline

## Sales
- Manage CRM records and their profile
- Work with leads, deals, notes, and follow-ups
- Cannot administratively create/delete team users

# Important Development Notes

- `DB_SYNC=true` makes TypeORM automatically create/update tables. This is convenient for a local portfolio project. In a production application you would normally use migrations instead.
- Session storage uses the default in-memory Express session store. This is fine for local learning/demo purposes, but a production deployment would use a persistent session store.
- Pusher and email are deliberately optional so you can run the main project without external accounts.
- This project intentionally does not add microservices, Redis, queues, refresh-token architecture, Docker orchestration, payments, or other advanced infrastructure because the goal is to stay close to a fresh-graduate full-stack knowledge level.

# Common Problems

## PostgreSQL password error

Check `DB_USERNAME`, `DB_PASSWORD`, and whether PostgreSQL is running.

## Database does not exist

Create `crm_sales_pipeline` in pgAdmin first.

## Frontend cannot call backend

Confirm:

```text
Backend: http://localhost:3001
Frontend: http://localhost:3200
```

and make sure `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` match those addresses.

## Login fails after first run

Run:

```bash
cd backend
npm run seed
```

Then use the seed email/password from `.env`.

## No real-time pop-up appears

This is expected if Pusher variables are blank. Database notifications still work.

## No email arrives

This is expected if SMTP variables are blank. Configure a valid Gmail App Password if you want email notifications.

# Portfolio Short Description

Developed a full-stack CRM and Sales Pipeline web application using Next.js, NestJS, TypeScript, and PostgreSQL to manage companies, contacts, leads, sales deals, follow-up activities, role-based users, real-time notifications, and sales performance through an interactive dashboard and drag-and-drop pipeline.
