"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-2xl font-semibold">Your cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center text-soil-900/50">
            <p>Your cart is empty.</p>
            <Link href="/" className="btn-secondary">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 flex flex-col divide-y hairline">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-soil-900/5">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-soil-900/50">
                      ₹{item.price} / {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="h-7 w-7 rounded-sm border hairline text-sm"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="h-7 w-7 rounded-sm border hairline text-sm"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-medium">
                    ₹{item.price * item.qty}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-soil-900/40 hover:text-radish"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t hairline pt-6">
              <span className="font-display text-lg font-semibold">Total</span>
              <span className="font-display text-lg font-semibold">₹{total}</span>
            </div>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Proceed to payment
            </Link>
          </>
        )}
      </main>
    </>
  );
}
