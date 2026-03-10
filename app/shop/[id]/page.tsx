"use client";
import React, { useState, useEffect, use } from "react";
import {
  Loader2,
  ChevronLeft,
  ShoppingCart,
  Minus,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Modal States
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  
  // Input Data States
  const [teacherEmail, setTeacherEmail] = useState("");
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    mobile: "",
    zipCode: "",
  });

  // Loading & Error States
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
          setActiveImage(json.data.images[0] || "");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const updateQuantity = (type: "i" | "d") => {
    if (type === "i") setQuantity((prev) => prev + 1);
    else if (type === "d" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  /**
   * FINAL STEP: STRIPE PAYMENT & DB SAVE
   */
  const handleStripeCheckout = async (metadata?: any) => {
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/public/shop/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_url: product.pdf_url,
          name: product.name,
          price: product.price.toString(),
          quantity: product.category?.toLowerCase() === "module" ? 1 : quantity,
          shipping: metadata || null,
          teacherEmail: teacherEmail || null, // Will be filled if it was a module
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Payment initialization failed.");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsProcessing(false);
    }
  };

  // 1. CLICK BUY NOW
  const handleBuyNow = () => {
    if (product.category?.toLowerCase() === "module") {
      setIsTeacherModalOpen(true);
    } else {
      setIsShippingModalOpen(true);
    }
  };

  /**
   * 2. MODULE STEP: Verify Teacher then OPEN Shipping Modal
   */
  const handleVerifyTeacher = async () => {
    if (!teacherEmail.includes("@")) return setError("Please enter a valid school email.");
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch(`/api/public/shop/teacher?email=${encodeURIComponent(teacherEmail)}`);
      const json = await res.json();

      if (res.ok && json.success) {
        // SUCCESS: Close teacher modal and open shipping modal
        setIsProcessing(false);
        setIsTeacherModalOpen(false);
        setIsShippingModalOpen(true);
      } else {
        setError(json.message || "Teacher email not recognized.");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Verification service error.");
      setIsProcessing(false);
    }
  };

  /**
   * 3. FINAL STEP: Shipping Form Submission
   */
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.address || !shippingData.mobile || !shippingData.zipCode) {
      return setError("All fields are required.");
    }
    await handleStripeCheckout(shippingData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-10 font-bold text-sm uppercase">
          <ChevronLeft size={20} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          <div className="space-y-6">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-4">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-slate-900 mb-6">{product.name}</h1>
            <p className="text-4xl font-black text-slate-900 mb-8">${product.price}</p>
            
            <div className="h-px bg-slate-100 w-full mb-8"></div>

            <div className="mb-10">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Description</h4>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
            </div>

            {product.category?.toLowerCase() !== "module" && (
              <div className="mb-10">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Quantity</h4>
                <div className="flex items-center gap-3 bg-slate-50 w-fit p-2 rounded-2xl border">
                  <button onClick={() => updateQuantity("d")} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-blue-600 text-slate-900">
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-black text-xl text-slate-900">{quantity}</span>
                  <button onClick={() => updateQuantity("i")} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-blue-600 text-slate-900">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={handleBuyNow}
              disabled={isProcessing}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-70"
            >
              {isProcessing && !isTeacherModalOpen && !isShippingModalOpen ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <><ShoppingCart size={24} /> Buy Now</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: TEACHER MODAL (FOR MODULES) */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-slate-900">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => { setIsTeacherModalOpen(false); setError(""); }} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
              <h3 className="text-2xl font-black">Teacher Pass</h3>
              <p className="text-slate-500 mt-2">Enter your email to verify module access.</p>
            </div>
            <div className="space-y-4">
              <input 
                type="email" 
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="teacher@school.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {error && <div className="text-red-500 text-xs font-bold flex items-center gap-2 bg-red-50 p-3 rounded-xl"><AlertCircle size={14}/> {error}</div>}
              <button onClick={handleVerifyTeacher} disabled={isProcessing} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                {isProcessing ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Verify Teacher Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 (OR STEP 1 FOR PRODUCTS): SHIPPING MODAL */}
      {isShippingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-slate-900">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => { setIsShippingModalOpen(false); setError(""); }} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Truck size={32} /></div>
              <h3 className="text-2xl font-black">Delivery Details</h3>
              <p className="text-slate-500 mt-1">Please provide your information.</p>
            </div>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name"
                value={shippingData.fullName}
                onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
              />
              <textarea 
                placeholder="Full Delivery Address"
                value={shippingData.address}
                onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 h-24"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Zip Code"
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input 
                  type="tel" 
                  placeholder="Mobile Number"
                  value={shippingData.mobile}
                  onChange={(e) => setShippingData({...shippingData, mobile: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {error && <div className="text-red-500 text-xs font-bold flex items-center gap-2 bg-red-50 p-3 rounded-xl"><AlertCircle size={14}/> {error}</div>}
              <button type="submit" disabled={isProcessing} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all">
                {isProcessing ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Proceed to Payment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}