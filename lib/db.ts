import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
let ready: Promise<void> | null = null;

async function init() {
  await sql.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await sql.query(`CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Website',
    description TEXT NOT NULL,
    image_url TEXT,
    link TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await sql.query(`CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);

  // Create the admin account from env vars the first time
  const users = await sql.query("SELECT id FROM users LIMIT 1");
  if (users.length === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await sql.query("INSERT INTO users (email, password_hash) VALUES ($1, $2)", [process.env.ADMIN_EMAIL.toLowerCase(), hash]);
  }

  // A few sample projects so the portfolio isn't empty (delete them in the admin)
  const projects = await sql.query("SELECT id FROM projects LIMIT 1");
  if (projects.length === 0) {
    const samples = [
      ["Fresh Basket Grocers", "E-commerce", "Online grocery store with delivery slots and mobile payments."],
      ["Kilimani Dental Clinic", "Website", "Modern clinic website with online appointment requests."],
      ["TaskFlow Dashboard", "Web App", "Internal project tracker for a small logistics team."],
    ];
    for (const [t, c, d] of samples) {
      await sql.query("INSERT INTO projects (title, category, description) VALUES ($1,$2,$3)", [t, c, d]);
    }
  }
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  ready ??= init().catch((e) => { ready = null; throw e; });
  await ready;
  return (await sql.query(text, params)) as T[];
}
