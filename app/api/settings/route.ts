import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/kv";
import { isAdminRequest, ADMIN_COOKIE } from "@/lib/auth";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isAdminRequest(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await req.json();
  const current = await getSettings();
  const merged = { ...current, ...updates };
  await saveSettings(merged);

  return NextResponse.json(merged);
}
