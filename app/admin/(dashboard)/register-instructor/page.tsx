"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, Mail, Lock, Camera, Award, CheckCircle2, 
  ShieldCheck, ArrowRight, UserCircle, Search, Eye, 
  UserX, X, ShieldAlert, Info, Plus, Phone
} from "lucide-react";

export default function InstructorManagement() {
  // Form States
  const [fullName, setFullName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); // Added Mobile State
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ... (List & UI States remain same)
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/admin/instructors");
      const json = await res.json();
      if (json.success) setInstructors(json.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => { fetchInstructors(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please upload an image");

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("speciality", speciality);
    formData.append("email", email);
    formData.append("mobile", mobile); // Added Mobile to FormData
    formData.append("password", password);
    formData.append("image", imageFile);

    try {
      const res = await fetch("/api/admin/instructors", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setIsSuccess(true);
        // Clear Form
        setFullName("");
        setSpeciality("");
        setEmail("");
        setMobile(""); // Clear Mobile
        setPassword("");
        setImageFile(null);
        setPreviewUrl(null);
        fetchInstructors();
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert(json.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInstructors = instructors.filter(ins => 
    ins.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 space-y-24">
      
      {/* SECTION 1: REGISTER FORM */}
      <section>
        <header className="mb-10 mt-10">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Administrative Task</span>
          </div>
          <h1 className="text-4xl font-serif italic text-slate-900">Onboard <span className="text-blue-600">New Instructor</span></h1>
          <div className="h-1 w-20 bg-yellow-400 mt-2 rounded-full"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Photo Upload Side */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-8 text-center shadow-xl shadow-blue-50/20 sticky top-10">
              <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest mb-6">Profile Photo</p>
              <div onClick={() => fileInputRef.current?.click()} className="relative w-40 h-40 mx-auto group cursor-pointer">
                <div className="w-full h-full rounded-full bg-slate-50 border-4 border-white ring-4 ring-yellow-400/20 flex items-center justify-center overflow-hidden transition-all shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <UserCircle size={80} className="text-blue-100 group-hover:text-blue-200" />
                  )}
                  <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"><Camera size={24} /></div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                <div className="absolute bottom-2 right-2 bg-yellow-400 p-2 rounded-full shadow-lg border-2 border-white text-blue-900"><Plus size={14} /></div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleRegister} className="bg-white border border-blue-50 rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-blue-100/20 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Full Name</label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Emma Wilson" className="w-full bg-blue-50/30 border border-blue-100 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Speciality</label>
                  <input required value={speciality} onChange={(e) => setSpeciality(e.target.value)} type="text" placeholder="Yoga & Meditation" className="w-full bg-blue-50/30 border border-blue-100 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                </div>
              </div>

              {/* Added Mobile Field Here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Email Address</label>
                  <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="instructor@incarnet.com" className="w-full bg-blue-50/30 border border-blue-100 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input required value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" placeholder="+44 7700 900000" className="w-full bg-blue-50/30 border border-blue-100 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-blue-900 uppercase tracking-widest ml-1">Initial Password</label>
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-blue-50/30 border border-blue-100 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
              </div>
              <button disabled={isSubmitting} className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all ${isSuccess ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"}`}>
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isSuccess ? <><CheckCircle2 size={18}/> Registered</> : <><UserPlus size={18}/> Register Instructor</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIST (Existing code remains same) */}
      <section className="pt-10 border-t border-slate-100">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-serif italic text-slate-900">Manage <span className="text-yellow-500">Instructors</span></h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Directory of all registered professionals.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search by name..." className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 ring-blue-50 transition-all text-xs" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((ins) => (
            <div key={ins.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <img src={ins.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400/20" />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ins.full_name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ins.speciality}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedInstructor(ins)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"><Eye size={14} /> Details</button>
                <button className="px-4 py-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"><UserX size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: Updated to show Mobile */}
      {selectedInstructor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedInstructor(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-24 bg-blue-600 flex justify-end p-6"><button onClick={() => setSelectedInstructor(null)} className="text-white/50 hover:text-white"><X size={24}/></button></div>
            <div className="px-10 pb-10">
              <div className="relative -mt-12 flex items-end gap-6 mb-8">
                <img src={selectedInstructor.image_url} alt="" className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-lg object-cover" />
                <div className="pb-2">
                  <h2 className="text-2xl font-serif italic text-slate-900">{selectedInstructor.full_name}</h2>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedInstructor.speciality}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biography</p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    {selectedInstructor.bio ? `"${selectedInstructor.bio}"` : "No biography added yet."}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Email</span><span className="text-slate-900 lowercase">{selectedInstructor.email}</span></div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Mobile</span><span className="text-slate-900">{selectedInstructor.mobile || "N/A"}</span></div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>ID</span><span className="text-slate-900">INS-{selectedInstructor.id}</span></div>
                  <button className="w-full mt-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all">Deactivate Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}