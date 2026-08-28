import { Redis } from "@upstash/redis";
import { Product, Order, StoreSettings, DEFAULT_SETTINGS } from "./types";

// Works with Vercel's Redis (Upstash) marketplace integration, whichever
// env var names it lands on for your project.
const url =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

if (!url || !token) {
  // Thrown lazily, only when a page actually tries to read/write data —
  // see the friendly "storage isn't connected" screen on the homepage.
}

const kv = new Redis({ url, token });

const PRODUCTS_KEY = "greennest:products";
const ORDERS_KEY = "greennest:orders";
const SETTINGS_KEY = "greennest:settings";

export async function getProducts(): Promise<Product[]> {
  const data = await kv.get<Product[]>(PRODUCTS_KEY);
  return data ?? [];
}

export async function saveProducts(products: Product[]): Promise<void> {
  await kv.set(PRODUCTS_KEY, products);
}

export async function getOrders(): Promise<Order[]> {
  const data = await kv.get<Order[]>(ORDERS_KEY);
  return data ?? [];
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await kv.set(ORDERS_KEY, orders);
}

export async function getSettings(): Promise<StoreSettings> {
  const data = await kv.get<StoreSettings>(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  await kv.set(SETTINGS_KEY, settings);
}
