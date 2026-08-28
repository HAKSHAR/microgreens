"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { Product } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  description: "",
  unit: "100g box",
  price: "",
  stock: "in_stock" as Product["stock"],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function loadProducts() {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }

  useEffect(loadProducts, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImageIfNeeded(): Promise<string> {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("folder", "products");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    return data.url;
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImageIfNeeded();
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add product");
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview("");
      loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStock(product: Product) {
    const newStock = product.stock === "in_stock" ? "sold_out" : "in_stock";
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
    );
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/products/${id}`, { method: "DELETE" });
  }

  async function saveEdit(product: Product, updates: Partial<Product>) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setEditingId(null);
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="font-display text-2xl font-semibold">Products</h1>

        <form
          onSubmit={handleAddProduct}
          className="mt-6 grid grid-cols-1 gap-4 rounded-md border hairline bg-white p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="label">Product name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Price (₹)</label>
            <input
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Unit (e.g. "100g box")</label>
            <input
              className="input"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Stock status</label>
            <select
              className="input"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value as Product["stock"] })
              }
            >
              <option value="in_stock">In stock</option>
              <option value="sold_out">Sold out</option>
            </select>
          </div>
          <div>
            <label className="label">Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          </div>
          {imagePreview && (
            <div className="relative h-32 w-32 overflow-hidden rounded-sm border hairline">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
          )}
          {error && <p className="text-sm text-radish sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Adding…" : "Add product"}
            </button>
          </div>
        </form>

        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-soil-900/50">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-soil-900/50">No products yet — add your first one above.</p>
          ) : (
            <ul className="flex flex-col divide-y hairline rounded-md border hairline bg-white">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  editing={editingId === product.id}
                  onEditToggle={() =>
                    setEditingId(editingId === product.id ? null : product.id)
                  }
                  onSave={(updates) => saveEdit(product, updates)}
                  onToggleStock={() => toggleStock(product)}
                  onDelete={() => deleteProduct(product.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

function ProductRow({
  product,
  editing,
  onEditToggle,
  onSave,
  onToggleStock,
  onDelete,
}: {
  product: Product;
  editing: boolean;
  onEditToggle: () => void;
  onSave: (updates: Partial<Product>) => void;
  onToggleStock: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [unit, setUnit] = useState(product.unit);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    let image = product.image;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "products");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) image = data.url;
    }
    onSave({ name, description, price: Number(price), unit, image });
    setSaving(false);
  }

  if (editing) {
    return (
      <li className="flex flex-col gap-3 p-4">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea
          className="input"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-3">
          <input
            className="input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
          }}
          className="text-sm"
        />
        {imagePreview && (
          <div className="relative h-24 w-24 overflow-hidden rounded-sm border hairline">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button onClick={onEditToggle} className="btn-secondary">
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-4 p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-soil-900/5">
        {product.image && (
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-soil-900/50">
          ₹{product.price} / {product.unit}
        </p>
      </div>
      <button
        onClick={onToggleStock}
        className={`rounded-sm px-3 py-1.5 text-xs font-semibold ${
          product.stock === "in_stock"
            ? "bg-sprout-500/15 text-sprout-600"
            : "bg-soil-900/10 text-soil-900/60"
        }`}
      >
        {product.stock === "in_stock" ? "In stock" : "Sold out"}
      </button>
      <button onClick={onEditToggle} className="btn-secondary px-3 py-1.5 text-xs">
        Edit
      </button>
      <button
        onClick={onDelete}
        className="px-2 text-xs text-soil-900/40 hover:text-radish"
      >
        Delete
      </button>
    </li>
  );
}
