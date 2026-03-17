"use client";
import React, { useEffect, useState } from "react";
import { Users, Clock, CheckCircle, AlertCircle, ArrowUpRight, Mail, Check, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

// TypeScript interfaces
interface CourseRequest {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  const fetchRequests = async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/requests");
      const result = await res.json();
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Done (Delete & Email) Action with proper types
  const handleDone = async (id: number, email: string, fullName: string): Promise<void> => {
    const confirm = await Swal.fire({
      title: "Mark as Completed?",
      text: `Confirming this will contact ${fullName} and remove the entry.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      confirmButtonText: "Yes, Done!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (result.success) {
          Swal.fire({
            title: "Success",
            text: "Request processed successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          
          fetchRequests(); // Refresh data
        }
      } catch (error) {
        Swal.fire("Error", "Could not delete the request.", "error");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 p-3.5 rounded-2xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Pending Requests</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{requests.length}</h3>
          </div>
        </div>
        {/* අනෙක් stats cards මෙතනට... */}
      </div>

      {/* REQUESTS TABLE SECTION */}
      <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-serif italic text-slate-900">Course Requests</h3>
            <div className="h-1 w-12 bg-yellow-400 mt-1 rounded-full"></div>
          </div>
          <button 
            onClick={fetchRequests} 
            className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
          >
            Refresh List
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">No new requests found.</div>
          ) : (
            requests.map((req: CourseRequest) => (
              <div 
                key={req.id} 
                className="flex items-center justify-between p-5 bg-blue-50/20 border border-blue-50/50 rounded-[2.2rem] hover:bg-white hover:border-yellow-400/50 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-xl border border-blue-50 flex items-center justify-center text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{req.fullName}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                      {req.mobile} • {req.email}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDone(req.id, req.email, req.fullName)}
                  className="px-6 py-3 bg-blue-600 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Check size={14} /> Done
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}