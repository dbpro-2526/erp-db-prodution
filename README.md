# ERP Inventory — Scaffold

This branch contains an initial scaffold for the inventory / demand system.

Quick start (local, requires Docker for Postgres if you prefer):

1. Copy .env.example to .env and edit values.
2. Install dependencies: npm install
3. Start development: npm run dev

Database setup (Prisma + Postgres):
- Ensure POSTGRES_URL is set in .env
- Run: npx prisma migrate dev --name init
- Run seed: npm run seed

Seed admin credentials (temporary):
- Email: dbprodhind@gmail.com
- Password: dbpr@2526

Notes:
- This scaffold is minimal — API routes, Prisma schema, and example services are included.
- Fill in email provider credentials and update environment variables as needed.

Files of interest:
- prisma/schema.prisma — DB schema (users, roles, office, items, demands, approvals)
- prisma/seed.ts — creates roles and a Super Admin user
- src/pages — Next.js pages and API routes
- functions/ — cloud-functions skeleton for background jobs (sendEmail)

