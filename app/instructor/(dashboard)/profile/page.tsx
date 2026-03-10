"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, User, Award, FileText, 
  Save, CheckCircle2 
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  speciality: string;
  bio: string;
  image_url: string;
  email: string;
}

export default function ProfileManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    id: "",
    name: "",
    speciality: "",
    bio: "",
    image_url: "",
    email: ""
  });

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const res = await fetch("/api/instructor");
        const json = await res.json();
        if (json.success) {
          setProfile({
            id: json.data.id,
            name: json.data.full_name || "",
            speciality: json.data.speciality || "",
            bio: json.data.bio || "",
            image_url: json.data.image_url || "",
            email: json.data.email || ""
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/instructor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: profile.bio,
          image_url: profile.image_url, // Added image_url to the request body
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (err) {
      alert("Failed to submit update request");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900">
            Profile <span className="text-blue-600">Management</span>
          </h2>
          <div className="h-1 w-12 bg-yellow-400 mt-2 rounded-full"></div>
        </div>
        {showSuccess && (
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-300">
            <CheckCircle2 size={16} /> Bio update request sent for admin approval!
          </div>
        )}
      </header>

      <form onSubmit={handleProfileUpdate} className="mb-16">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="relative group cursor-not-allowed">
                <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-4 border-white ring-4 ring-blue-50 shadow-xl">
                  <img 
                    src={profile.image_url || "https://via.placeholder.com/150"} 
                    className="w-full h-full object-cover" 
                    alt="Profile" 
                  />
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">{profile.email}</p>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                    <input 
                      disabled
                      value={profile.name} 
                      className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Speciality</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                    <input 
                      disabled
                      value={profile.speciality} 
                      className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Edit Biography</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-5 text-blue-300" size={18} />
                  <textarea 
                    rows={6}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Enter your new bio here..."
                    className="w-full bg-blue-50/30 border border-blue-100 p-4 pl-12 rounded-[2rem] outline-none focus:border-yellow-400 focus:bg-white transition-all text-sm leading-relaxed"
                  />
                </div>
                <p className="text-[9px] text-slate-400 ml-2 italic">* Submitting a new bio will be reviewed by an admin before it goes live.</p>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? "Submitting..." : <><Save size={16} className="text-yellow-400"/> Request Bio Update</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}