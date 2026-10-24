# Brightside Agency - Business Website

Next.js 14 (App Router) + TypeScript + Tailwind + Neon PostgreSQL (raw SQL, no Prisma).

## Pages
Home, About, Services, Portfolio (with category filter), Contact, Admin login and Admin dashboard.

## Features
- Contact form saves to the database and emails you, plus an auto-reply to the visitor
- Spam honeypot on the contact form
- Admin login (bcrypt + JWT cookie)
- Admin dashboard: add/edit/delete/hide projects, read/reply/delete inquiries
- Tables, admin account and 3 sample projects are created automatically on first run

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in
3. `npm run dev`
4. Go to `/admin`, log in with ADMIN_EMAIL / ADMIN_PASSWORD

## Deploy
Push to GitHub, import into Vercel, add the same env vars.

Edit `lib/config.ts` to change the business name, contact details and services.
Edit `app/about/page.tsx` for the team members.
