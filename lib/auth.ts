import { cookies } from "next/headers";

export const ADMIN_COOKIE = "greennest_admin";

function getSecret(): string {
  return process.env.ADMIN_SECRET || "fallback-dev-secret-change-me";
}

// Uses Web Crypto (available in both the Node.js and Edge runtimes,
// unlike Node's built-in `crypto` module which middleware can't use).
async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || "";
  return hmac(getSecret(), password);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return input === expected;
}

export async function isAdminRequest(
  cookieValue: string | undefined
): Promise<boolean> {
  if (!cookieValue) return false;
  return cookieValue === (await makeSessionToken());
}

export async function isAdminSession(): Promise<boolean> {
  const store = cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return isAdminRequest(value);
}
