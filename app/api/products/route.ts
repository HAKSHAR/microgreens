import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/kv";
import { isAdminRequest, ADMIN_COOKIE } from "@/lib/auth";
import { Product } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  // newest first
  products.sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, unit, price, image, stock } = body;

  if (!name || price === undefined) {
    return NextResponse.json(
      { error: "Name and price are required" },
      { status: 400 }
    );
  }

  const products = await getProducts();
  const newProduct: Product = {
    id: crypto.randomUUID(),
    name,
    description: description || "",
    unit: unit || "unit",
    price: Number(price),
    image: image || "",
    stock: stock === "sold_out" ? "sold_out" : "in_stock",
    createdAt: Date.now(),
  };
  products.push(newProduct);
  await saveProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}
