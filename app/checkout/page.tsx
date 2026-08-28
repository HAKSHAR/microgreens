"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { useCart } from "@/lib/cart-context";
import { StoreSettings } from "@/lib/types";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setError("Could not load store settings."));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!screenshotFile) {
      setError("Please upload a screenshot of your payment.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", screenshotFile);
      formData.append("folder", "screenshots");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          notes,
          paymentScreenshot: uploadData.url,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Could not place order");

      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-lg px-5 py-20 text-center text-soil-900/50">
          Your cart is empty.
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-5 py-10">
        <h1 className="font-display text-2xl font-semibold">Pay & confirm order</h1>
        <p className="mt-1 text-sm text-soil-900/60">
          Total to pay: <span className="font-semibold text-soil-950">₹{total}</span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-md border hairline bg-white p-6">
          {settings?.qrCodeImage ? (
            <div className="relative h-56 w-56">
              <Image
                src={settings.qrCodeImage}
                alt="Payment QR code"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <p className="py-10 text-sm text-soil-900/40">
              QR code not set up yet — contact the seller directly.
            </p>
          )}
          {settings?.upiId && (
            <p className="text-sm text-soil-900/60">
              UPI ID: <span className="font-medium text-soil-950">{settings.upiId}</span>
            </p>
          )}
          <p className="text-xs text-soil-900/40">
            Scan, pay ₹{total}, then upload your payment screenshot below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="label">Your name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input
              className="input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Delivery address</label>
            <textarea
              className="input"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <input
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Payment screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
              required
            />
            {screenshotPreview && (
              <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-sm border hairline">
                <Image
                  src={screenshotPreview}
                  alt="Payment screenshot preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-radish">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Submitting…" : "Submit order"}
          </button>
        </form>
      </main>
    </>
  );
}
