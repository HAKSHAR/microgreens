"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { Order } from "@/lib/types";

const STATUS_STYLE: Record<Order["status"], string> = {
  pending_payment: "bg-clay/10 text-clay",
  confirmed: "bg-sprout-500/15 text-sprout-600",
  rejected: "bg-radish/10 text-radish",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  function loadOrders() {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }

  useEffect(loadOrders, []);

  async function updateStatus(order: Order, status: Order["status"]) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="font-display text-2xl font-semibold">Orders</h1>

        {loading ? (
          <p className="mt-6 text-sm text-soil-900/50">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-6 text-sm text-soil-900/50">No orders yet.</p>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-md border hairline bg-white p-4">
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-medium">
                      #{order.id} — {order.customerName}
                    </p>
                    <p className="text-sm text-soil-900/50">
                      {order.customerPhone} · ₹{order.total} ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>

                {expanded === order.id && (
                  <div className="mt-4 flex flex-col gap-4 border-t hairline pt-4 sm:flex-row">
                    <div className="flex-1">
                      <ul className="flex flex-col gap-1 text-sm">
                        {order.items.map((item) => (
                          <li key={item.productId} className="flex justify-between">
                            <span>
                              {item.name} × {item.qty}
                            </span>
                            <span>₹{item.price * item.qty}</span>
                          </li>
                        ))}
                      </ul>
                      {order.customerAddress && (
                        <p className="mt-3 text-sm text-soil-900/60">
                          <strong>Address:</strong> {order.customerAddress}
                        </p>
                      )}
                      {order.notes && (
                        <p className="mt-1 text-sm text-soil-900/60">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => updateStatus(order, "confirmed")}
                          className="rounded-sm bg-sprout-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Confirm payment
                        </button>
                        <button
                          onClick={() => updateStatus(order, "rejected")}
                          className="rounded-sm bg-radish px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-sm border hairline">
                      <Image
                        src={order.paymentScreenshot}
                        alt="Payment screenshot"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
