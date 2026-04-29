"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      if (data) setFooterData(data);
    };
    fetchFooter();
  }, []);

  // දත්ත ලැබෙන තුරු default අගයන් පෙන්වීමට හෝ skeleton එකක් පෙන්විය හැක
  const brandDesc = footerData?.brand_description || "Connecting body, mind, and soul through the rhythmic beauty of movement.";
  const contactEmail = footerData?.email || "office@miw.org.uk";
  const contactPhone = footerData?.phone || "+44 7769975454";
  const contactAddress = footerData?.address || "Pyecombe Lodge, 2 Church Lane";

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
            <p className="text-blue-100 text-sm leading-relaxed">{brandDesc}</p>
            
            <div className="flex space-x-4 mt-6">
              <Link href={footerData?.facebook_url || "#"} className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href={footerData?.instagram_url || "#"} className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href={footerData?.twitter_url || "#"} className="p-2 bg-blue-800 hover:bg-yellow-500 rounded-full transition-colors">
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
              <li><Link href="/shop" className="hover:text-yellow-400 transition">Shop</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin className="text-yellow-400 mt-1" size={18} />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-yellow-400" size={18} />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={18} />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 uppercase tracking-widest">Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">Subscribe for tips and session updates.</p>
            <form className="flex flex-col space-y-3">
              <input type="email" placeholder="Your Email Address" className="bg-blue-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400" />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 rounded-lg transition shadow-lg">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-16 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between text-blue-200 text-xs">
          <p>© {new Date().getFullYear()} Incarnate Life. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;