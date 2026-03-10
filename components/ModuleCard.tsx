"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Loader2 } from "lucide-react";

interface ModuleProps {
  image: string;
  name: string;
  price: string;
}

export default function ModuleCard({ image, name, price }: ModuleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Backend එකට දත්ත යවා Session එකක් හදාගන්නවා
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          price: price, 
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error("Stripe Error:", session.error);
        alert("Payment Error: " + session.error);
        return;
      }

      // 2. Stripe විසින් ලබාදෙන URL එකට කෙලින්ම රීඩිරෙක්ට් කරනවා
      // මෙය තමයි වඩාත්ම සාර්ථක සහ වේගවත් ක්‍රමය
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      // මෙහිදී setIsLoading(false) කරන්නේ නැහැ, මොකද පිටුව රීඩිරෙක්ට් වෙන නිසා.
      // රීඩිරෙක්ට් එක පරක්කු නම් පමණක් බොත්තම දිගටම පෙන්වයි.
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
      {/* Module Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-grow">
        <h4 className="text-blue-900 font-bold text-xl mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          {name}
        </h4>
        
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
            <span className="text-2xl font-bold text-yellow-600 font-mono">
              {price}
            </span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex items-center gap-3 bg-blue-900 text-white px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-blue-900 transition-all duration-300 shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95 min-w-[140px] justify-center"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShoppingCart size={18} />
            )}
            {isLoading ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}