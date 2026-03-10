"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; 
import { 
  LayoutDashboard, UserCircle, BookOpen, 
  LogOut, Menu, X, Sparkles 
} from "lucide-react";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
      setIsLoading(false);
  }, []);

  const handleLogout = () => {
    Cookies.remove("instructor_token");
    router.push("/instructor/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/instructor" },
    { name: "Profile Management", icon: UserCircle, path: "/instructor/profile" },
    { name: "Classes Management", icon: BookOpen, path: "/instructor/classes" },
    { name: "My Lessons", icon: BookOpen, path: "/instructor/lessons" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* --- MOBILE HEADER --- */}
      {/* z-[100] wenuwata z-100 use kala */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-100">
        <div className="flex items-center gap-2 text-blue-600 font-serif italic font-bold">
          <Sparkles size={20} className="text-yellow-500" /> Incarnet
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 bg-slate-50 rounded-xl">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      {/* z-[90] wenuwata z-90 use kala */}
      <aside className={`
        fixed inset-y-0 left-0 z-90 w-72 bg-white border-r border-slate-100 p-8 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden md:flex items-center gap-2 text-blue-600 font-serif italic font-bold text-2xl mb-12">
          <Sparkles size={28} className="text-yellow-500" /> Incarnet
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest transition-all
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                    : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}
                `}
              >
                <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all italic"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}