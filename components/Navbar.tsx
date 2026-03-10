"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Classes", href: "/classes" },
    { name: "Videos", href: "/videos" },
    { name: "Teachers", href: "/team" },
    { name: "Teachers Training", href: "/training" },
    { name: "Shop", href: "/shop" },
    { name: "FAQs", href: "/frequently" },
    { name: "Sign In", href: "/instructor/login" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo2.png" alt="Logo" width={50} height={50} className="object-contain" />
              <span className="text-blue-900 font-bold text-xl hidden md:block uppercase tracking-wider">
                INCARNET
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-blue-900 hover:text-yellow-500 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-blue-900 focus:outline-none">
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={closeMenu} // මෙතැනදී click කළ විට menu එක වැසෙනවා
                className="py-3 text-blue-900 font-medium border-b border-gray-50 hover:pl-2 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;