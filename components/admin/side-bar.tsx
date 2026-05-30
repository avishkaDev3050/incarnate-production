"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Sliders,
  Sparkles,
  Heart,
  HelpCircle,
  GraduationCap,
  Video,
  UserPlus, 
  LogOut, 
  X, 
  ShoppingBasket,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Compass,
  Info,
  CheckSquare,
  ShoppingBag,
  CreditCard,
  Settings
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }: any) => {
  const pathname = usePathname();
  const router = useRouter();

  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    // { name: "Site Content", href: "/admin/content", icon: FileText },
    { name: "Slider Section", href: "/admin/sliders", icon: Sliders },
    { name: "Promotion Section", href: "/admin/promotions", icon: Sparkles },
    { name: "Welcome Section", href: "/admin/welcome", icon: Info },
    { name: "Wellbeing Journey", href: "/admin/wellbeing", icon: Compass },
    { name: "Testimonial Section", href: "/admin/testimonie", icon: MessageSquare },
    { name: "About Section", href: "/admin/about", icon: Heart },
    { name: "Team Intro Section", href: "/admin/team", icon: Users },
    { name: "FAQs Content", href: "/admin/faqs", icon: HelpCircle },
    { name: "Facilitators Content", href: "/admin/training", icon: GraduationCap },
    { name: "Video Management", href: "/admin/video", icon: Video },
    { name: "Gallery Management", href: "/admin/gallery", icon: ImageIcon },
    { name: "Register Instructor", href: "/admin/register-instructor", icon: UserPlus },
    { name: "Instructor Edits", href: "/admin/profile-approvals", icon: Users },
    { name: "Class Approvals", href: "/admin/classes", icon: CheckSquare },
    { name: "Manage Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Manage Orders", href: "/admin/shop", icon: CreditCard },
    { name: "Footer Section", href: "/admin/footer", icon: Settings },
  ];
  
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 z-50 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full pt-6 pb-4 px-4">
          
          {/* Logo Area */}
          <div className="flex justify-between items-center mb-6 px-3 flex-shrink-0">
            <div>
              <h2 className="text-xl font-serif italic text-white tracking-wide">Incarnet</h2>
              <p className="text-[9px] uppercase tracking-[0.25em] text-blue-400 font-bold mt-0.5">Super Admin</p>
            </div>
            <button 
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* 📜 Scrollable Nav Links Area */}
          {/* Tailwind scrollbar utilities පාවිච්චි කරලා සිහින්ව හදලා තියෙන්නේ */}
          <nav className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold" 
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <link.icon 
                    size={16} 
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                    }`} 
                  />
                  <span className="text-xs tracking-tight truncate">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Action (Fixed at bottom) */}
          <div className="pt-4 border-t border-slate-800 flex-shrink-0 mt-3">
            <button 
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sign Out Dashboard</span>
            </button>
          </div>
        </div>
      </aside>

      {/* CSS For Global Custom Smooth Scrollbar Effect */}
      <style jsx global>{`
        /* Webkit Browsers (Chrome, Safari, Edge) සඳහා scrollbar එක ලස්සන කිරීම */
        nav::-webkit-scrollbar {
          width: 5px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: #334155; /* Slate-700 */
          border-radius: 9999px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: #475569; /* Slate-600 */
        }
        /* Firefox සඳහා */
        nav {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
      `}</style>
    </>
  );
};

export default Sidebar;