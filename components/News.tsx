"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react"; 
import Link from "next/link"; 

// Data structure එක define කරමු
interface Promotion {
  id: number;
  flag: string;
  title1: string;
  title2: string;
  description: string;
  btn_text: string;
  btn_url: string;
  image_url: string;
}

export default function ModernAd() {
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch("/api/admin/promotions"); 
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          // අලුත්ම promotion එක (පළවෙනි එක) ලබා ගනිමු
          setPromo(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, []);

  // Loading state එක
  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-900" size={40} />
      </div>
    );
  }

  // DB එකේ කිසිම promotion එකක් නැතිනම් section එක පෙන්වන්නේ නැත
  if (!promo) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-3xl border-2 border-blue-50/50 shadow-xl bg-white">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Left Side: Dynamic Image */}
          <div className="relative w-full md:w-1/2 h-87.5 md:h-125 overflow-hidden group">
            <img
              src={promo.image_url} 
              alt="Promotion"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Promotion+Image";
              }}
            />
            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-yellow-500/10 transition-colors duration-500" />
          </div>

          {/* Right Side: Content Area */}
          <div className="w-full md:w-1/2 p-10 md:p-16 space-y-6 bg-white">
            {promo.flag && (
              <div className="inline-block px-4 py-1 rounded-full bg-yellow-400 text-blue-900 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {promo.flag}
              </div>
            )}

            <h2 className="text-4xl md:text-5xl font-serif leading-tight italic">
              <span className="text-blue-900">{promo.title1}</span> <br />
              <span className="text-red-600">{promo.title2}</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              {promo.description}
            </p>

            <div className="pt-4">
              <Link href={promo.btn_url || "#"}>
                <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-yellow-500 hover:text-blue-900 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer">
                  {promo.btn_text || "Learn More"} <ArrowRight size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}