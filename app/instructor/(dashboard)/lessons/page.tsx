"use client";
import React, { useState, useEffect } from "react";
import { 
  FileText, Download, Loader2, GraduationCap, 
  AlertCircle, LayoutDashboard, RefreshCcw 
} from "lucide-react";

interface ModuleItem {
  id: number;
  teacher: string;
  module: string;
  pdf_url: string; // මෙය ["/uploads/lessons/..."] ලෙස DB එකේ පවතී
  created_at: string;
}

export default function InstructorModulePage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Backend එකෙන් දත්ත ලබා ගැනීම (Fetch Logic)
  const fetchMyModules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // route.ts එකට GET request එකක් යවයි
      const res = await fetch("/api/instructor/module");
      
      if (res.status === 401) {
        throw new Error("කරුණාකර නැවත Login වන්න (Unauthorized)");
      }

      const result = await res.json();

      if (result.success) {
        setModules(result.data);
      } else {
        throw new Error(result.message || "දත්ත ලබා ගැනීමට අපොහොසත් විය.");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyModules();
  }, []);

  // 2. PDF එක Download කිරීමේ Logic එක
  const handleDownload = (pdfJson: string, moduleName: string) => {
    try {
      // JSON Array එකක් ලෙස ඇති Path එක Parse කිරීම
      const pdfData = typeof pdfJson === "string" ? JSON.parse(pdfJson) : pdfJson;
      const filePath = Array.isArray(pdfData) ? pdfData[0] : pdfData;

      if (!filePath) {
        alert("මෙම Module එකට අදාළ PDF ගොනුව සොයාගත නොහැක.");
        return;
      }

      // Download Link එක සෑදීම
      const link = document.createElement("a");
      link.href = filePath; 
      link.target = "_blank";
      link.setAttribute("download", `${moduleName.replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download Error:", err);
      alert("PDF එක බාගත කිරීමේදී දෝෂයක් ඇති විය.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <LayoutDashboard className="text-blue-600" size={32} />
                Instructor <span className="text-blue-600">Portal</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage and access your uploaded teaching modules.</p>
            </div>
            <button 
              onClick={fetchMyModules}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600"
              title="Refresh Data"
            >
              <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-4xl flex items-center gap-4 mb-8">
            <AlertCircle size={24} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Your Modules...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <FileText size={32} />
                    </div>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                      ID: #{item.id}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.module}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 mb-6">
                      <GraduationCap size={16} />
                      <span className="text-xs font-semibold">
                        Uploaded on {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(item.pdf_url, item.module)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-95"
                  >
                    <Download size={16} /> Download Module PDF
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {modules.length === 0 && !error && (
              <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3.5rem]">
                <div className="max-w-xs mx-auto">
                  <FileText className="mx-auto text-slate-200 mb-4" size={64} />
                  <h3 className="text-lg font-bold text-slate-900">No Modules Found</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">
                    You haven't uploaded any modules yet or they are pending approval.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}