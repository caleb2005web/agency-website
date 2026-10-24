import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = { id: number; email: string };
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret");

export async function setSession(user: Session) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
  cookies().set("session", token, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSession() {
  cookies().delete("session");
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { id: payload.id as number, email: payload.email as string };
  } catch {
    return null;
  }
}
