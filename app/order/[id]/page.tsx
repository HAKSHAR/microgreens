"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Order } from "@/lib/types";

const STATUS_COPY: Record<Order["status"], { label: string; tone: string; body: string }> = {
  pending_payment: {
    label: "Waiting for confirmation",
    tone: "bg-clay/10 text-clay",
    body: "We've received your order and screenshot. We'll confirm it shortly.",
  },
  confirmed: {
    label: "Confirmed",
    tone: "bg-sprout-500/15 text-sprout-600",
    body: "Payment confirmed — your order is being prepared.",
  },
  rejected: {
    label: "Payment not verified",
    tone: "bg-radish/10 text-radish",
    body: "We couldn't verify this payment. Please contact us with your order code.",
  },
};

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-lg px-5 py-20 text-center">
          <p className="text-soil-900/50">Order not found.</p>
          <Link href="/" className="btn-secondary mt-4">
            Back to shop
          </Link>
        </main>
      </>
    );
  }

  if (!order) return null;

  const status = STATUS_COPY[order.status];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-5 py-12">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.tone}`}>
          {status.label}
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">
          Order #{order.id}
        </h1>
        <p className="mt-2 text-sm text-soil-900/60">{status.body}</p>

        <ul className="mt-6 flex flex-col divide-y hairline rounded-md border hairline bg-white">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between px-4 py-3 text-sm">
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="font-medium">₹{item.price * item.qty}</span>
            </li>
          ))}
          <li className="flex justify-between px-4 py-3 text-sm font-semibold">
            <span>Total</span>
            <span>₹{order.total}</span>
          </li>
        </ul>

        <p className="mt-6 text-xs text-soil-900/40">
          Save your order code <strong>{order.id}</strong> to check status later.
        </p>

        <Link href="/" className="btn-secondary mt-6 inline-block">
          Back to shop
        </Link>
      </main>
    </>
  );
}
