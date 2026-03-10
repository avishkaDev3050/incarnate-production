"use client";
import React from "react";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  images: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  // Get first image or fallback to placeholder
  const displayImage = product.images?.[0] || "/api/placeholder/400/400";

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="p-3 bg-white text-slate-900 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
            <Eye size={20} />
          </button>
          <button className="p-3 bg-white text-slate-900 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
            <ShoppingCart size={20} />
          </button>
        </div>

        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-slate-600 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow italic">
          {product.description || "No description available for this product."}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Price
            </span>
            <span className="text-2xl font-black text-slate-900">
              ${product.price}
            </span>
          </div>
          <Link
            href={`/shop/${product.id}`}
            className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200 text-center"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
