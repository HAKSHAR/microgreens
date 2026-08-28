"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === "sold_out";

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border hairline bg-white">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-soil-900/5">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              soldOut ? "grayscale opacity-60" : ""
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-soil-900/30 text-sm">
            No photo yet
          </div>
        )}
        {soldOut && (
          <span className="absolute left-2 top-2 rounded-sm bg-soil-950 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-soil-900/60 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-display text-lg font-semibold">
              ₹{product.price}
            </span>
            <span className="ml-1 text-xs text-soil-900/50">
              / {product.unit}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="rounded-md bg-soil-900 px-3 py-2 text-xs font-semibold text-paper transition-colors hover:bg-sprout-600 disabled:cursor-not-allowed disabled:bg-soil-900/20"
          >
            {soldOut ? "Unavailable" : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
