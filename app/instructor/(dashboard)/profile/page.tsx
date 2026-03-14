"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, User, Award, FileText, 
  Save, CheckCircle2, Loader2 
} from "lucide-react";
import Swal from "sweetalert2";

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // අලුතින් තෝරන file එක තබා ගැනීමට
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image size should be less than 2MB", "error");
      return;
    }

    setSelectedFile(file); // File එක state එකට දාගන්න

    // Preview එකක් පෙන්වීමට පමණක් FileReader භාවිතා කරයි
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // --- FormData භාවිතය (Backend එකේ req.formData() එකට ගැලපෙන ලෙස) ---
      const formData = new FormData();
      formData.append("full_name", profile.name);
      formData.append("speciality", profile.speciality);
      formData.append("bio", profile.bio);
      
      // අලුත් image එකක් තෝරා ඇත්නම් එය එකතු කරන්න
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch("/api/instructor", {
        method: "PUT",
        body: formData, // JSON.stringify අවශ්‍ය නැත
      });

      const result = await res.json();

      if (res.ok) {
        // අලුත් Image URL එක ලැබුනේ නම් එය update කරන්න
        if (result.image_url) {
          setProfile(prev => ({ ...prev, image_url: result.image_url }));
          setSelectedFile(null); // File selection එක clear කරන්න
        }

        Swal.fire({
          title: "Success!",
          text: "Profile updated and old image removed!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      } else {
        throw new Error(result.message || "Failed to update");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
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
      <header className="mb-10 px-4">
        <h2 className="text-3xl font-serif italic text-slate-900">
          Profile <span className="text-blue-600">Management</span>
        </h2>
        <div className="h-1 w-12 bg-yellow-400 mt-2 rounded-full"></div>
      </header>

      <form onSubmit={handleProfileUpdate} className="mb-16">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <div className="lg:col-span-1 flex flex-col items-center">
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-4 border-white ring-4 ring-blue-50 shadow-xl transition-all group-hover:ring-blue-200">
                  <img 
                    src={profile.image_url || "https://via.placeholder.com/150"} 
                    className="w-full h-full object-cover" 
                    alt="Profile" 
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*"
                />
              </div>
              <p className="mt-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Click to change photo</p>
              <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">{profile.email}</p>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                    <input 
                      type="text"
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-blue-50/30 border border-blue-100 p-4 pl-12 rounded-2xl text-sm font-medium outline-none focus:border-yellow-400 focus:bg-white transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Speciality</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                    <input 
                      type="text"
                      value={profile.speciality} 
                      onChange={(e) => setProfile({...profile, speciality: e.target.value})}
                      className="w-full bg-blue-50/30 border border-blue-100 p-4 pl-12 rounded-2xl text-sm font-medium outline-none focus:border-yellow-400 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Biography</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-5 text-blue-300" size={18} />
                  <textarea 
                    rows={6}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full bg-blue-50/30 border border-blue-100 p-4 pl-12 rounded-[2rem] outline-none focus:border-yellow-400 focus:bg-white transition-all text-sm leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : <><Save size={16} className="text-yellow-400"/> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}