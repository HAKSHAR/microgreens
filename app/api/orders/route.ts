import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/kv";
import { isAdminRequest, ADMIN_COOKIE } from "@/lib/auth";
import { Order } from "@/lib/types";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  orders.sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    items,
    total,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    paymentScreenshot,
  } = body;

  if (!items?.length || !customerName || !customerPhone || !paymentScreenshot) {
    return NextResponse.json(
      { error: "Missing required order details" },
      { status: 400 }
    );
  }

  const orders = await getOrders();
  const newOrder: Order = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    items,
    total: Number(total) || 0,
    customerName,
    customerPhone,
    customerAddress: customerAddress || "",
    notes: notes || "",
    paymentScreenshot,
    status: "pending_payment",
    createdAt: Date.now(),
  };
  orders.push(newOrder);
  await saveOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}
