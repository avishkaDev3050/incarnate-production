"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { 
  CheckCircle2, User, Eye, X, Check,
  ShieldCheck, AlertCircle, Info, Mail, Award,
  History as HistoryIcon 
} from "lucide-react";

const MySwal = withReactContent(Swal);

export default function ProfileApprovals() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [pendingEdits, setPendingEdits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEdits();
  }, []);

  const fetchEdits = async () => {
    try {
      const res = await fetch("/api/admin/instructors/ins_edits");
      const json = await res.json();
      if (json.success) {
        setPendingEdits(json.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: View Details Popup ---
  const viewDetails = (item: any) => {
    MySwal.fire({
      title: `<span style="font-family: serif; font-style: italic;">${item.full_name}</span>`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 15px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
            <p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Biography</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">${item.bio || "No biography provided."}</p>
          </div>
          <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
            <p style="font-size: 12px;"><strong>Email:</strong> ${item.email}</p>
            <p style="font-size: 12px;"><strong>Speciality:</strong> ${item.speciality || "N/A"}</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
    });
  };

  const approveRequest = async (id: number, newStatus: number) => {
    try {
      const res = await fetch("/api/admin/instructors/ins_edits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: id, 
          status: newStatus 
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `Instructor status updated to ${newStatus}`,
            timer: 1500,
            showConfirmButton: false
        });
        setSelectedProfile(null);
        fetchEdits();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Action error:", err);
      alert("Failed to connect to the server.");
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
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
      <header className="mb-12 p-6">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Verification Portal</span>
        </div>
        <h1 className="text-4xl font-serif italic text-slate-900">
          Instructor <span className="text-blue-600">Approvals</span>
        </h1>
      </header>

      <div className="px-6 space-y-4">
        {pendingEdits.map((item) => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{item.full_name}</h3>
                <p className="text-sm text-slate-500">{item.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* --- ADDED VIEW BUTTON --- */}
                <button 
                  onClick={() => viewDetails(item)}
                  className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <Eye size={20} />
                </button>

                <button 
                  onClick={() => approveRequest(item.id, 2)}
                  className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Reject (2)
                </button>
                <button 
                  onClick={() => approveRequest(item.id, 1)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                >
                  Approve (1)
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingEdits.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-serif italic">No pending applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}