"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // URL එක /admin හෝ /instructor වලින් පටන් ගනී නම් true වේ
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/instructor");

  return (
    <>
      {/* Dashboard පිටු වලදී Navbar පෙන්වන්නේ නැත */}
      {!isDashboard && <Navbar />}
      
      {children}
      
      {/* Dashboard පිටු වලදී Footer පෙන්වන්නේ නැත */}
      {!isDashboard && <Footer />}
    </>
  );
}