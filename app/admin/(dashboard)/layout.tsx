"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/side-bar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <h2 className="text-xl font-serif italic text-blue-600">Incarnet</h2>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
          <Menu size={28} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 p-6 md:p-10 transition-all duration-300">
        {/* Header (Desktop) */}
        <header className="hidden md:block mb-10">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-1">Admin Console</p>
          <h1 className="text-3xl font-serif italic text-slate-900">Management Dashboard</h1>
        </header>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}