"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { StoreSettings, DEFAULT_SETTINGS } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    let qrCodeImage = settings.qrCodeImage;

    if (qrFile) {
      const formData = new FormData();
      formData.append("file", qrFile);
      formData.append("folder", "settings");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) qrCodeImage = data.url;
    }

    const updated = { ...settings, qrCodeImage };
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const saved = await res.json();
    setSettings(saved);
    setQrFile(null);
    setQrPreview("");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <main className="mx-auto max-w-2xl px-5 py-10 text-sm text-soil-900/50">Loading…</main>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-2xl font-semibold">Store settings</h1>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-md border hairline bg-white p-6">
          <div>
            <label className="label">Store name</label>
            <input
              className="input"
              value={settings.storeName}
              onChange={(e) => update("storeName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Tagline (shown on homepage)</label>
            <textarea
              className="input"
              rows={2}
              value={settings.tagline}
              onChange={(e) => update("tagline", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Delivery info line</label>
            <input
              className="input"
              value={settings.deliveryInfo}
              onChange={(e) => update("deliveryInfo", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone number</label>
              <input
                className="input"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="label">WhatsApp number</label>
              <input
                className="input"
                value={settings.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">UPI ID</label>
            <input
              className="input"
              value={settings.upiId}
              onChange={(e) => update("upiId", e.target.value)}
              placeholder="yourname@upi"
            />
          </div>
          <div>
            <label className="label">Address</label>
            <input
              className="input"
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Payment QR code image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setQrFile(file);
                setQrPreview(URL.createObjectURL(file));
              }}
              className="text-sm"
            />
            <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-sm border hairline bg-soil-900/5">
              {(qrPreview || settings.qrCodeImage) && (
                <Image
                  src={qrPreview || settings.qrCodeImage}
                  alt="QR code"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save settings"}
            </button>
            {saved && <span className="text-sm text-sprout-600">Saved ✓</span>}
          </div>
        </form>
      </main>
    </>
  );
}
