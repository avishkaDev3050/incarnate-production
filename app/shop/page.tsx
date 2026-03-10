"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2, PackageSearch } from "lucide-react";

export default function UserProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        const json = await res.json();
        if (json.success) {
          const formattedData = json.data.map((p: any) => ({
            ...p,
            images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images || [])
          }));
          setProducts(formattedData);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Our Collection</span>
          <h1 className="text-5xl font-black text-slate-900 mt-4 mb-4">Discover Products</h1>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Fetching Inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-40">
            <PackageSearch className="mx-auto text-slate-200 mb-4" size={80} />
            <p className="text-slate-500 font-medium">No products available at the moment.</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}