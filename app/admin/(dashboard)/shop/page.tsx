"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  User, 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  Hash, 
  CreditCard,
  ShoppingCart
} from "lucide-react";

export default function OrderManagement() {
  const [filter, setFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shop/orders");
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (order: any, nextStatus: string) => {
    try {
      const res = await fetch("/api/admin/shop/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status: nextStatus,
          teacher_email: order.mobile, 
          module_name: order.product_name, 
          pdf_url: order.pdf_url
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSelectedOrder(null);
        fetchOrders();
      } else {
        alert("Server Error: " + result.error);
      }
    } catch (err) {
      alert("System Update Failed");
    }
  };

  const filteredOrders = orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-10">
        <div>
          <h1 className="text-4xl font-serif italic text-slate-900">Order Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Review customer details and grant module access.</p>
        </div>
        <div className="flex bg-white border p-1.5 rounded-2xl shadow-sm">
          {["pending", "shipped", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                filter === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-slate-400 animate-pulse">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed">
            <Package className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400">No {filter} orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border rounded-[2.5rem] p-8 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order #{order.id}</span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-50 rounded-full">Qty: {order.quantity}</span>
                  </div>
                  <h3 className="text-2xl font-serif italic text-slate-900">{order.product_name}</h3>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User size={14}/> {order.full_name}</span>
                    <span className="font-bold text-emerald-600 text-sm">£{order.total_price}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedOrder(order)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-bold uppercase transition-colors">Details</button>
                  {order.status === "pending" && (
                    <button onClick={() => handleUpdateStatus(order, "shipped")} className="px-6 py-3 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase transition-all">Approve & Ship</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- FULL DATA MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-serif italic text-slate-900">Order Verification</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-10 space-y-8">
              {/* Product Highlight */}
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-tighter">
                    <ShoppingCart size={12}/> Purchased Item
                  </div>
                  <p className="text-xl font-serif italic leading-tight">{selectedOrder.product_name}</p>
                  <p className="text-xs text-slate-400 font-medium">Quantity: <span className="text-white">{selectedOrder.quantity} Unit(s)</span></p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">£{selectedOrder.total_price}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Paid via Stripe</p>
                </div>
              </div>

              {/* Detailed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Customer Contact */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User size={16} className="text-slate-400" />
                    <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Customer</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">{selectedOrder.full_name}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Phone size={14} /> {selectedOrder.mobile}
                    </div>
                  </div>
                </section>

                {/* Shipping Location */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <MapPin size={16} className="text-slate-400" />
                    <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Shipping Address</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedOrder.address}</p>
                    <div className="flex items-center gap-2 text-slate-900 text-sm font-black">
                      <Hash size={14} className="text-blue-500" /> {selectedOrder.zip_code}
                    </div>
                  </div>
                </section>
              </div>

              {/* Date Metadata */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase border-t pt-6">
                <Calendar size={14} /> 
                Transaction Date: {new Date(selectedOrder.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>

              {/* Action Buttons */}
              {selectedOrder.status === "pending" && (
                <div className="flex gap-4 pt-4">
                  <button onClick={() => handleUpdateStatus(selectedOrder, "cancelled")} className="flex-1 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold uppercase text-[10px] transition-colors">
                    Cancel Order
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedOrder, "shipped")} className="flex-[2] py-4 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl font-bold uppercase text-[10px] transition-all shadow-xl">
                    Confirm & Grant Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}