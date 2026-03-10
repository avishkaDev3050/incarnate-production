"use client";
import React, { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Clock, Calendar, 
  User, DollarSign, MapPin, Eye, X, Info,
  BookOpen, Award, Users
} from "lucide-react";

export default function ClassApprovals() {
  const [filter, setFilter] = useState("pending"); // "pending" | "approved" | "rejected"
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map filter string to DB status
  const statusMap: Record<string, number> = {
    pending: 0,
    approved: 1,
    rejected: 2,
  };

  // 1. Fetch Data
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/classes");
      const result = await res.json();
      if (result.success) {
        setClasses(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 2. Handle Status Update (Approve/Reject)
  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      const res = await fetch("/api/admin/classes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await res.json();
      if (result.success) {
        setSelectedClass(null);
        fetchClasses(); // Refresh list
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  // Filter classes based on active tab
  const filteredClasses = classes.filter(c => c.approved === statusMap[filter]);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 relative">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif italic text-slate-900">Class Approvals</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Review new submissions from your instructors.</p>
        </div>

        <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* --- CLASS LIST --- */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-slate-400">Loading submissions...</p>
        ) : filteredClasses.length === 0 ? (
          <p className="text-center py-10 text-slate-400">No classes found in {filter} status.</p>
        ) : (
          filteredClasses.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                        {item.category || "Class"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif italic text-slate-900">{item.title}</h3>
                  <div className="flex flex-wrap gap-4 text-slate-500 text-xs font-medium">
                     <div className="flex items-center gap-1"><User size={14}/> {item.teacher_name}</div>
                     <div className="flex items-center gap-1"><Calendar size={14}/> {item.event_date}</div>
                     <div className="flex items-center gap-1"><Clock size={14}/> {item.event_time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setSelectedClass(item)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    <Eye size={16} /> View Details
                  </button>
                  {item.approved === 0 && (
                    <button 
                        onClick={() => handleUpdateStatus(item.id, 1)}
                        className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100"
                    >
                        Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DETAILS POPUP (MODAL) --- */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedClass(null)}></div>
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar">
            
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-50 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-slate-900 leading-tight">{selectedClass.title}</h2>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Class Submission Details</p>
                </div>
                <button onClick={() => setSelectedClass(null)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
            </div>

            <div className="p-8 md:p-10 space-y-10">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instructor</p>
                     <p className="text-xs font-bold text-slate-900">{selectedClass.teacher_name}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                     <p className="text-xs font-bold text-slate-900">{selectedClass.event_date}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                     <p className="text-xs font-bold text-slate-900">{selectedClass.event_time}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                     <p className="text-xs font-bold text-slate-900 truncate">{selectedClass.address}</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <section className="space-y-3">
                     <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest">
                        <Info size={14} className="text-blue-500"/> Contact Email
                     </div>
                     <p className="text-sm text-slate-500">{selectedClass.teacher_email}</p>
                  </section>
                  
                  {selectedClass.image && (
                      <section className="space-y-3">
                         <div className="text-slate-900 font-bold text-xs uppercase tracking-widest">Class Image</div>
                         <img src={selectedClass.image} alt="Preview" className="w-full h-48 object-cover rounded-3xl" />
                      </section>
                  )}
               </div>

               {/* Modal Footer Actions */}
               {selectedClass.approved === 0 && (
                <div className="pt-8 flex gap-4">
                  <button 
                    onClick={() => handleUpdateStatus(selectedClass.id, 2)}
                    className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all"
                  >
                     Reject Submission
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedClass.id, 1)}
                    className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100"
                  >
                     Approve and Publish
                  </button>
                </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}