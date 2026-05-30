"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Save, Info, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import Swal from "sweetalert2";

interface FooterData {
  brand_description: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  address: string;
  phone: string;
  email: string;
}

export default function FooterAdminPage() {
  const [formData, setFormData] = useState<FooterData>({
    brand_description: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    address: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Existing Footer Settings
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch("/api/admin/footer");
        const data = await res.json();
        
        // දත්ත තිබේ නම් ඒවා Form එකට දාන්න
        if (data && !data.message) {
          setFormData({
            brand_description: data.brand_description || "",
            facebook_url: data.facebook_url || "",
            instagram_url: data.instagram_url || "",
            twitter_url: data.twitter_url || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Save / Update Footer Settings (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: result.message || "Footer settings updated successfully.",
          confirmButtonColor: "#1e3a8a",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "You might be unauthorized or missing data.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong while saving.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-950" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-800">
      
      {/* Header Block */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-3 shadow-sm">
        <Info size={24} className="text-blue-400" />
        <div>
          <h2 className="text-xl font-bold">Footer Settings</h2>
          <p className="text-slate-400 text-xs mt-0.5">Update website branding description, social links, and official contact information.</p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* Section 1: Brand Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Company Branding</h3>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Brand Description</label>
            <textarea
              name="brand_description"
              value={formData.brand_description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary about your company/website displayed in the footer..."
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Facebook size={14} className="text-blue-600" /> Facebook URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Instagram size={14} className="text-pink-600" /> Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/yourprofile"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Twitter size={14} className="text-sky-500" /> Twitter / X URL
              </label>
              <input
                type="url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="https://x.com/yourprofile"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

          </div>
        </div>

        {/* Section 3: Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-500" /> Physical Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="No. 123, Kandy Road, Colombo"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Phone size={14} className="text-slate-500" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Mail size={14} className="text-slate-500" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@yourcompany.com"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950/20 transition-all"
              />
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-950 text-white font-semibold text-xs rounded-xl hover:bg-blue-900 active:scale-[0.99] shadow-sm flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save size={14} /> Save Settings
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}