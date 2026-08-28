import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { getProducts, getSettings } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let settings: Awaited<ReturnType<typeof getSettings>> | null = null;
  let kvError = false;

  try {
    [products, settings] = await Promise.all([getProducts(), getSettings()]);
  } catch {
    kvError = true;
  }

  if (kvError || !settings) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Storage isn&apos;t connected yet
        </h1>
        <p className="text-sm text-soil-900/60">
          Add a Vercel KV database and a Blob store to this project (Storage
          tab in your Vercel dashboard), then redeploy. See the README for
          the exact steps.
        </p>
      </main>
    );
  }

  const inStock = products.filter((p) => p.stock === "in_stock");
  const soldOut = products.filter((p) => p.stock === "sold_out");
  const ordered = [...inStock, ...soldOut];

  return (
    <>
      <Header storeName={settings.storeName} />
      <main className="mx-auto max-w-5xl px-5 pb-24">
        <section className="flex flex-col gap-4 border-b hairline py-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sprout-600">
            Sown · Snipped · Delivered
          </span>
          <h1 className="max-w-lg font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {settings.tagline}
          </h1>
          {settings.deliveryInfo && (
            <p className="max-w-md text-sm text-soil-900/60">
              {settings.deliveryInfo}
            </p>
          )}
        </section>

        <section className="py-10">
          {ordered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center text-soil-900/50">
              <p className="font-display text-lg">Nothing planted yet</p>
              <p className="text-sm">
                Add your first product from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {ordered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="border-t hairline py-8 text-center text-xs text-soil-900/40">
        {settings.phone && <p>Questions? Call {settings.phone}</p>}
      </footer>
    </>
  );
}
