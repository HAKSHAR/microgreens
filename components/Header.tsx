"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

function SproutMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 24V14"
        stroke="#628F38"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 14C14 8 9 6 5 6C5 12 8 15 14 15"
        fill="#9FCB6B"
      />
      <path
        d="M14 11C14 6 19 4 23 4C23 10 20 13 14 13"
        fill="#7FAE4C"
      />
    </svg>
  );
}

export default function Header({ storeName }: { storeName?: string }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b hairline bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <SproutMark />
          <span className="font-display text-lg font-semibold tracking-tight">
            {storeName || "GreenNest Microgreens"}
          </span>
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-md border border-soil-900/15 px-3 py-2 text-sm font-medium hover:border-soil-900/40"
        >
          Cart
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sprout-600 px-1 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
