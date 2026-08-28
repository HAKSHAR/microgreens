import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image is too large (max 8MB)" },
      { status: 400 }
    );
  }

  const safeFolder = ["products", "screenshots", "settings"].includes(folder)
    ? folder
    : "misc";

  const blob = await put(
    `${safeFolder}/${crypto.randomUUID()}-${file.name}`,
    file,
    { access: "public" }
  );

  return NextResponse.json({ url: blob.url });
}
