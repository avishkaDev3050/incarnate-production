"use client";
import { Users, Clock, CheckCircle, AlertCircle, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  // Color theme updated to White, Blue, and Yellow (Amber)
  const stats = [
    { label: "Pending Instructors", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Class Approvals", value: "08", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Profile Edits", value: "05", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Live Classes", value: "24", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 group relative overflow-hidden">
            {/* Background Accent Decor */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 ${stat.bg} rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 scale-150`} />
            
            <div className="flex justify-between items-start relative z-10">
              <div className={`${stat.bg} p-3.5 rounded-2xl transition-transform group-hover:rotate-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-slate-200 group-hover:text-yellow-500 transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- ACTION SECTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Instructor Approvals Table */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-2xl font-serif italic text-slate-900">Instructor Approvals</h3>
               <div className="h-1 w-12 bg-yellow-400 mt-1 rounded-full"></div>
            </div>
            <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-colors">View All Requests</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-blue-50/20 border border-blue-50/50 rounded-[2.2rem] hover:bg-white hover:border-yellow-400/50 hover:shadow-lg hover:shadow-blue-100/20 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl border-2 border-blue-50 flex items-center justify-center shadow-sm overflow-hidden">
                     <div className="w-full h-full bg-slate-100" /> {/* Placeholder for image */}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Instructor Name {i}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-0.5">Vinyasa Specialist</p>
                  </div>
                </div>
                <button className="px-7 py-3 bg-blue-600 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Site Edit - Dark/Blue Version */}
        <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl shadow-blue-200 relative overflow-hidden group">
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl group-hover:bg-yellow-400/20 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-yellow-400 mb-6">
              <Zap size={20} fill="currentColor" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Live Update</span>
            </div>
            <h3 className="text-3xl font-serif italic mb-3 leading-tight">Headline <br/>Controller</h3>
            <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">Instantly change the hero message on the landing page.</p>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] text-blue-200 font-bold uppercase tracking-[0.2em] ml-1">New Hero Title</label>
                <input 
                  type="text" 
                  placeholder="Spirituality in Motion" 
                  className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl outline-none focus:border-yellow-400 focus:bg-white/20 transition-all text-sm placeholder:text-blue-300" 
                />
              </div>
              <button className="w-full py-5 bg-yellow-400 text-blue-900 font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-blue-900/20">
                Update Home Page
              </button>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center gap-2 mt-8 opacity-60">
             <ShieldCheck size={12} className="text-yellow-400"/>
             <p className="text-[9px] text-blue-100 uppercase tracking-widest font-bold">Secured Admin Action</p>
          </div>
        </div>

      </div>
    </div>
  );
}