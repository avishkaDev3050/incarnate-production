"use client";
import React from "react";
import { 
  BookOpen, Users, Clock, Plus, 
  ArrowRight, PlayCircle, MapPin 
} from "lucide-react";

export default function InstructorDashboard() {
  // අද දිනට අදාළ පන්ති ලැයිස්තුව
  const todayClasses = [
    { 
      id: 1, 
      name: "Morning Vinyasa Flow", 
      time: "06:00 AM - 07:30 AM", 
      students: 45, 
      location: "Studio A",
      isLive: true 
    },
    { 
      id: 2, 
      name: "Beginner Meditation", 
      time: "10:30 AM - 11:30 AM", 
      students: 28, 
      location: "Online / Zoom",
      isLive: false 
    },
    { 
      id: 3, 
      name: "Healing Sound Bath", 
      time: "05:00 PM - 06:30 PM", 
      students: 15, 
      location: "Main Hall",
      isLive: false 
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 space-y-12">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">February 03, 2026</p>
          <h2 className="text-4xl font-serif italic text-slate-900">Today's <span className="text-yellow-500">Schedule</span></h2>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all flex items-center gap-2">
          <Plus size={16} strokeWidth={3}/> New Class
        </button>
      </header>

      {/* --- TODAY'S CLASSES LIST --- */}
      <div className="space-y-4">
        {todayClasses.map((cls) => (
          <div 
            key={cls.id} 
            className={`relative overflow-hidden bg-white border rounded-[2.5rem] p-6 md:p-8 transition-all hover:shadow-xl hover:shadow-blue-100/20 group
              ${cls.isLive ? "border-blue-200 ring-2 ring-blue-50" : "border-slate-100"}
            `}
          >
            {/* Live Indicator Decor */}
            {cls.isLive && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                Live Now
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Time Box */}
                <div className={`hidden sm:flex flex-col items-center justify-center w-24 h-24 rounded-3xl border 
                  ${cls.isLive ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-100 text-slate-400"}
                `}>
                  <Clock size={20} className="mb-1" />
                  <p className="text-[9px] font-bold text-center px-2">{cls.time.split(' - ')[0]}</p>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-yellow-500" /> {cls.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Users size={14} className="text-blue-400" /> {cls.students} Students Joined
                    </span>
                    <span className="sm:hidden flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      <Clock size={14} /> {cls.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {cls.isLive ? (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-yellow-400 text-blue-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-yellow-100 flex items-center justify-center gap-2">
                    <PlayCircle size={18} /> Start Session
                  </button>
                ) : (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    View Details <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- QUICK ANALYTICS PREVIEW --- */}
      <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-blue-200">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif italic mb-2">Weekly Summary</h3>
          <p className="text-slate-400 text-sm">You have 4 more classes scheduled for this week.</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center bg-white/5 p-4 rounded-3xl min-w-[100px] border border-white/10">
              <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Total Hours</p>
              <p className="text-2xl font-bold">12.5</p>
           </div>
           <div className="text-center bg-white/5 p-4 rounded-3xl min-w-[100px] border border-white/10">
              <p className="text-[9px] font-bold text-yellow-400 uppercase mb-1">New Students</p>
              <p className="text-2xl font-bold">+08</p>
           </div>
        </div>
      </div>

    </div>
  );
}