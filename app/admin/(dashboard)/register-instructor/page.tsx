"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, Mail, Lock, Camera, Award, CheckCircle2, 
  ShieldCheck, ArrowRight, UserCircle, Search, Eye, 
  UserX, X, ShieldAlert, Info, Plus, Phone, RefreshCcw
} from "lucide-react";
import Swal from "sweetalert2";

export default function InstructorManagement() {
  // ... (කලින් තිබුණු සියලුම states සහ fetch functions මෙතනට එන්න ඕනේ)
  const [fullName, setFullName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchInstructors(); }, []);

  // --- දත් දෙකම වැඩ කරන (Activate/Deactivate) Function එක ---
  const handleStatusUpdate = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // 1 නම් 0 කරනවා, 0 නම් 1 කරනවා
    const actionText = newStatus === 1 ? "Activate" : "Deactivate";
    
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this instructor?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 1 ? '#10b981' : '#dc2626',
      confirmButtonText: `Yes, ${actionText}`
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("/api/admin/instructors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
        });
        if (res.ok) {
          Swal.fire('Success!', `Profile ${actionText}d successfully.`, 'success');
          setSelectedInstructor(null);
          fetchInstructors();
        }
      } catch (err) { console.error(err); }
    }
  };

  // ... (handleRegister සහ handleImageChange functions කලින් වගේමයි)

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 space-y-24">
      {/* Registration Form UI (කලින් එවපු එකමයි) */}
      {/* ... (Register Form Code) ... */}

      {/* SECTION 2: LIST */}
      <section className="pt-10 border-t border-slate-100">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div><h2 className="text-3xl font-serif italic text-slate-900">Manage <span className="text-yellow-500">Instructors</span></h2></div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search..." className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none text-xs" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.filter(ins => ins.full_name.toLowerCase().includes(searchTerm.toLowerCase())).map((ins) => (
            <div key={ins.id} className={`bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all ${ins.status === 0 ? "opacity-60 grayscale bg-slate-50" : ""}`}>
              <div className="flex items-center gap-4 mb-6">
                <img src={ins.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400/20" />
                <div>
                  <h3 className="font-bold text-slate-900">{ins.full_name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ins.speciality}</p>
                    {ins.status === 0 && <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">INACTIVE</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedInstructor(ins)} className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"><Eye size={14} /> Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: UPDATED FOR ACTIVATE/DEACTIVATE */}
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
                  <p className="text-sm text-slate-600 italic leading-relaxed">{selectedInstructor.bio || "No biography added yet."}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex justify-between"><span>Email</span><span className="text-slate-900 lowercase">{selectedInstructor.email}</span></div>
                  <div className="flex justify-between"><span>Mobile</span><span className="text-slate-900">{selectedInstructor.mobile || "N/A"}</span></div>
                  
                  {/* DYNAMIC BUTTON BASED ON STATUS */}
                  {selectedInstructor.status === 1 ? (
                    <button 
                      onClick={() => handleStatusUpdate(selectedInstructor.id, 1)}
                      className="w-full mt-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      <UserX size={14}/> Deactivate Profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusUpdate(selectedInstructor.id, 0)}
                      className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14}/> Activate Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}