export type Product = {
  id: string;
  name: string;
  description: string;
  unit: string; // e.g. "100g box", "per punnet"
  price: number; // in rupees
  image: string; // blob URL
  stock: "in_stock" | "sold_out";
  daysToHarvest?: number;
  createdAt: number;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
  image: string;
};

export type OrderStatus = "pending_payment" | "confirmed" | "rejected";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  paymentScreenshot: string; // blob URL
  status: OrderStatus;
  createdAt: number;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  upiId: string;
  qrCodeImage: string; // blob URL
  address: string;
  deliveryInfo: string;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "GreenNest Microgreens",
  tagline: "Fresh-cut greens, grown a few days ago, not a few states away.",
  phone: "",
  whatsapp: "",
  upiId: "",
  qrCodeImage: "",
  address: "",
  deliveryInfo: "Local delivery within 2 days of harvest.",
};
