"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, Calendar, Clock, Edit3, 
  Trash2, MapPin, X, Upload, User, Loader2
} from "lucide-react";

interface ClassItem {
  id: number;
  title: string;
  teacher_name: string;
  event_date: string; // Matches DB column
  event_time: string; // Matches DB column
  address: string;
  image: string | null;
  teacher_email: string;
}

export default function ClassesManagement() {
  // --- STATES ---
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    teacher_name: "", 
    event_date: "",
    event_time: "",
    address: "",
    teacher_email: "" // Will be handled by backend JWT
  });

  // --- 1. FETCH DATA ---
  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const result = await res.json();
      if (result.success) {
        setClasses(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // --- 2. DELETE LOGIC ---
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const res = await fetch(`/api/classes?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setClasses(classes.filter(c => c.id !== id));
      } else {
        alert("Delete failed: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- 3. MODAL HANDLERS ---
  const openModal = (cls: ClassItem | null = null) => {
    if (cls) {
      setIsEditing(true);
      setSelectedClassId(cls.id);
      setFormData({
        title: cls.title,
        teacher_name: cls.teacher_name,
        event_date: cls.event_date,
        event_time: cls.event_time,
        address: cls.address,
        teacher_email: cls.teacher_email
      });
      setPreviewUrl(cls.image);
    } else {
      setIsEditing(false);
      setSelectedClassId(null);
      setFormData({ title: "", teacher_name: "", event_date: "", event_time: "", address: "", teacher_email: "" });
      setPreviewUrl(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- 4. SAVE (POST/PUT) LOGIC ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("teacher_name", formData.teacher_name);
    data.append("date", formData.event_date); // matches backend get("date")
    data.append("time", formData.event_time); // matches backend get("time")
    data.append("address", formData.address);
    
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      // Use query param ?id= for editing to match backend PUT/DELETE
      const url = isEditing ? `/api/classes?id=${selectedClassId}` : "/api/classes";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, { method, body: data });
      const result = await response.json();

      if (result.success) {
        await fetchClasses();
        setIsModalOpen(false);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 p-6 animate-in fade-in duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900">Classes <span className="text-blue-600">Management</span></h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage details exactly how students see them.</p>
        </div>
        <button onClick={() => openModal()} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all flex items-center gap-2">
          <Plus size={18} strokeWidth={3} /> Register New Class
        </button>
      </header>

      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class & Instructor</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule & Venue</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {classes.map((cls) => (
              <tr key={cls.id} className="group hover:bg-blue-50/20 transition-all">
                <td className="px-8 py-8">
                  <div className="flex items-center gap-4">
                    <img src={cls.image || ""} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" alt="class" />
                    <div>
                      <p className="font-bold text-slate-900">{cls.title}</p>
                      <p className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1">
                        <User size={10} /> With {cls.teacher_name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="space-y-1 text-xs font-bold text-slate-600">
                    {/* FIXED: Using correct DB property names */}
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-400"/> {cls.event_date}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-yellow-500"/> {cls.event_time}</div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium italic"><MapPin size={14}/> {cls.address}</div>
                  </div>
                </td>
                <td className="px-8 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal(cls)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-yellow-400 hover:text-blue-900 transition-all"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(cls.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-y-auto max-h-[90vh] p-10 md:p-14 animate-in zoom-in-95">
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-serif italic text-slate-900">{isEditing ? "Update" : "Register"} <span className="text-blue-600">Class</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class Banner Image</label>
                <div 
                  className="w-full h-40 bg-blue-50 border-2 border-dashed border-blue-100 rounded-[2.5rem] flex flex-col items-center justify-center text-blue-400 hover:bg-blue-100/50 cursor-pointer transition-all group overflow-hidden relative"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase">Click to Upload Image</span>
                    </>
                  )}
                  <input type="file" id="fileUpload" hidden onChange={handleFileChange} accept="image/*" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-100 text-sm" placeholder="e.g. Morning Psalms Flow" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Instructor Name</label>
                  <input required value={formData.teacher_name} onChange={e => setFormData({...formData, teacher_name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-100 text-sm" placeholder="Emma Wilson" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" required value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} placeholder="Feb 07, 2026" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none focus:ring-2 ring-blue-100 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" required value={formData.event_time} onChange={e => setFormData({...formData, event_time: e.target.value})} placeholder="08:30 AM" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none focus:ring-2 ring-blue-100 text-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Serenity Lane, Colombo 07" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none focus:ring-2 ring-blue-100 text-sm" />
                </div>
              </div>

              <button 
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all mt-4 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? "Update Class Details" : "Register Class Details")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}