"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-white p-1 rounded-lg">
                <Image src="/logo2.jpg" alt="Logo" width={40} height={40} />
              </div>
              <span className="font-bold text-xl tracking-wider text-yellow-400">
                Incarnate Life
              </span>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed">
              Connecting body, mind, and soul through the rhythmic beauty of movement and the timeless wisdom of the Psalms.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors text-white">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors text-white">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors text-white">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-4 text-blue-100">
              <li><Link href="/" className="hover:text-yellow-400 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-yellow-400 transition">Our Story</Link></li>
              <li><Link href="/classes" className="hover:text-yellow-400 transition">All Classes</Link></li>
              <li><Link href="/instructors" className="hover:text-yellow-400 transition">Teachers</Link></li>
              <li><Link href="/shop" className="hover:text-yellow-400 transition">Shop</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin className="text-yellow-400 mt-1" size={18} />
                <span>Pyecombe Lodge, 2 Church Lane</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-yellow-400" size={18} />
                <span>+44 7769975454</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={18} />
                <span>office@miw.org.uk</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 uppercase tracking-widest">Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">Subscribe for free tips and session updates.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-blue-800 border-none rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 rounded-lg transition shadow-lg">
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-blue-200 text-xs">
          <p>© 2026 Psalms and Stretches. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-yellow-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-yellow-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;