import { cookies } from "next/headers"

// ─── Admin Credentials ─────────────────────────────────────────
// Change these to your desired admin login credentials.
// For production, move these to environment variables:
//   ADMIN_USERNAME and ADMIN_PASSWORD
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"

// Secret used to sign session tokens
const SESSION_SECRET = process.env.SESSION_SECRET || "dar-voyages-secret-key-change-in-production"
const SESSION_COOKIE = "admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// ─── Web Crypto helpers (Edge-compatible) ───────────────────────
const encoder = new TextEncoder()

function toBase64url(data: string): string {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64url(b64: string): string {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4))
  return atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad)
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function getKey(): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

async function hmacSign(data: string): Promise<string> {
  const key = await getKey()
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(data))
  return toHex(sig)
}

async function createToken(username: string): Promise<string> {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })
  const signature = await hmacSign(payload)
  const encoded = toBase64url(payload)
  return `${encoded}.${signature}`
}

async function verifyToken(token: string): Promise<{ username: string; exp: number } | null> {
  try {
    const [encoded, signature] = token.split(".")
    if (!encoded || !signature) return null
    const payload = fromBase64url(encoded)
    const expectedSig = await hmacSign(payload)
    if (signature !== expectedSig) return null
    const data = JSON.parse(payload)
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function createSession(username: string): Promise<void> {
  const token = await createToken(username)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  const data = await verifyToken(token)
  if (!data) return null
  return { username: data.username }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

// For use in middleware (can't use cookies() there, token passed directly)
export async function verifySessionToken(token: string): Promise<boolean> {
  return (await verifyToken(token)) !== null
}

export { SESSION_COOKIE }
