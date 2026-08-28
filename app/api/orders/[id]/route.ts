import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/kv";
import { isAdminRequest, ADMIN_COOKIE } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orders = await getOrders();
  const order = orders.find((o) => o.id === params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  orders[index] = { ...orders[index], status };
  await saveOrders(orders);

  return NextResponse.json(orders[index]);
}
