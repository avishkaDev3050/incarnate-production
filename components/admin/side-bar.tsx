"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CalendarCheck, 
  UserPlus, 
  LogOut, 
  X, 
  ShoppingBasket
} from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = ({ isOpen, setIsOpen }: any) => {
  const pathname = usePathname();
  const router = useRouter();

  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Site Content", href: "/admin/content", icon: Settings },
    { name: "Register Instructor", href: "/admin/register-instructor", icon: UserPlus },
    { name: "Instructor Edits", href: "/admin/profile-approvals", icon: Users },
    { name: "Class Approvals", href: "/admin/classes", icon: CalendarCheck },
    { name: "Manage Products", href: "/admin/products", icon: ShoppingBasket },
    { name: "Manage Orders", href: "/admin/shop", icon: ShoppingBasket },
  ];
  
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay - දැන් මේක මඳක් ලාවට පෙනෙන අඳුරු වීදුරුවක් වගේ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 z-70 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full py-10 px-6">
          
          {/* Logo Area */}
          <div className="flex justify-between items-center mb-12 px-2">
            <div>
              <h2 className="text-2xl font-serif italic text-slate-900">Incarnet</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-600 font-bold">Super Admin</p>
            </div>
            <button 
              className="md:hidden text-slate-400 hover:text-slate-600 p-1" 
              onClick={() => setIsOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1.5">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <link.icon size={19} className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                  <span className="text-sm font-semibold tracking-tight">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-50">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group" onClick={handleLogout}>
              <LogOut size={19} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;