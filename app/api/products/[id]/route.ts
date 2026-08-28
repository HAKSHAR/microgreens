import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/kv";
import { isAdminRequest, ADMIN_COOKIE } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await req.json();
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id,
    price:
      updates.price !== undefined
        ? Number(updates.price)
        : products[index].price,
  };
  await saveProducts(products);

  return NextResponse.json(products[index]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== params.id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await saveProducts(filtered);
  return NextResponse.json({ success: true });
}
