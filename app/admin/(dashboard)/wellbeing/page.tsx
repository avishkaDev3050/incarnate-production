"use client";
import React, { useState, useEffect } from "react";
import { Save, Loader2, Heart, AlignLeft, Sparkles, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function ManageWellbeing() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    title: "",
    paragraph1: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/wellbeing");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            title: json.data.title || "",
            paragraph1: json.data.paragraph1 || "",
          });
        }
      } catch (err) {
        console.error("Error fetching wellbeing data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/wellbeing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Wellbeing journey content has been updated.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to save data", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="text-rose-500" fill="currentColor" /> Wellbeing Journey
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the hero section content of the Wellbeing page.</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 md:p-12 space-y-8">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              <Sparkles size={16} className="text-amber-500" /> Main Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none transition-all text-lg font-medium"
              placeholder="e.g., Wellbeing Journey"
            />
          </div>

          <hr className="border-slate-50" />

          {/* Paragraphs Inputs */}
          <div className="space-y-6">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
              <AlignLeft size={16} className="text-blue-500" /> Content Paragraphs
            </label>
            
            <div className="space-y-4">
              <textarea
                rows={3}
                value={formData.paragraph1}
                onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl outline-none transition-all"
                placeholder="First Paragraph..."
              />  
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-slate-900 transition-all disabled:bg-slate-300"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Save size={20} /> Update Website Content
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preview Note */}
      <div className="mt-8 flex items-center gap-2 text-slate-400 justify-center text-sm italic">
        <CheckCircle size={14} /> Changes will reflect on the live website immediately after saving.
      </div>
    </div>
  );
}