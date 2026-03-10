"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, Receipt } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-12 text-center">
        
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse" />
            <CheckCircle2 className="relative text-green-500 w-16 h-16" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Received!
        </h1>
        <p className="text-slate-500 mb-8">
          Thank you for your purchase. Your order is being processed and a receipt has been sent to your email.
        </p>

        {/* Simple Info Box */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex flex-col gap-2 border border-slate-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Order Reference</span>
            <span className="text-slate-900 font-mono font-bold">
              #{sessionId ? sessionId.slice(-8).toUpperCase() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="text-green-600 font-bold text-[10px] uppercase tracking-wider bg-green-50 px-2 py-1 rounded-md">
              Successful
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/shop" 
            className="w-full bg-[#0056b3] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            Go to Dashboard <ArrowRight size={18} />
          </Link>
          
          <Link 
            href="/shop" 
            className="w-full bg-white text-slate-600 py-4 rounded-2xl font-bold border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>

        {/* Footer Support */}
        <p className="mt-8 text-xs text-slate-400">
          Having trouble? <Link href="/support" className="text-blue-500 underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}

export default function SimpleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}