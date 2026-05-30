"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";

interface Paragraph {
  id?: number;
  content: string;
}

export default function WelcomeManager() {
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([{ content: "" }]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "/api/admin/welcome";

  useEffect(() => {
    const fetchWelcomeData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success && result.data) {
          const d = result.data;
          setTitle1(d.title1 || "");
          setTitle2(d.title2 || "");
          setPreviewUrl(d.image_url || "");
          if (d.paragraphs && d.paragraphs.length > 0) {
            setParagraphs(d.paragraphs);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index].content = value;
    setParagraphs(updated);
  };

  const addParagraphField = () => {
    setParagraphs([...paragraphs, { content: "" }]);
  };

  const removeParagraphField = (index: number) => {
    if (paragraphs.length === 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title1", title1);
      formData.append("title2", title2);
      formData.append("paragraphs", JSON.stringify(paragraphs));
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Welcome section updated successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Could not connect to the server.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-neutral-400 bg-neutral-900 min-h-screen flex items-center justify-center">
        Loading Section Content...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-neutral-900 text-white min-h-screen rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome Section Manager</h1>
        <p className="text-xs text-neutral-400 mt-1">Manage the core intro details, dynamic paragraphs, and graphics display context.</p>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
        
        <div className="flex-1 min-w-0 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500">⚙️ Component Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-300 mb-0.5">Main Title Line (title1)</label>
                <input 
                  type="text" 
                  value={title1} 
                  onChange={(e) => setTitle1(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-300 mb-0.5">Highlight Title (title2)</label>
                <input 
                  type="text" 
                  value={title2} 
                  onChange={(e) => setTitle2(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs text-neutral-300">Dynamic Text Paragraphs</label>
                <button 
                  type="button"
                  onClick={addParagraphField}
                  className="flex items-center gap-1 text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  <Plus size={10} /> Add Paragraph
                </button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <textarea 
                      value={para.content}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      placeholder={`Paragraph ${idx + 1} content text blocks...`}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 h-14 resize-none text-xs"
                      required
                    />
                    <button
                      type="button"
                      disabled={paragraphs.length === 1}
                      onClick={() => removeParagraphField(idx)}
                      className="bg-neutral-900 border border-neutral-700 text-neutral-400 p-2.5 rounded hover:text-red-400 hover:border-red-500/30 disabled:opacity-40 transition5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 mb-0.5">Cover Showcase Graphic File</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-neutral-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-650 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition tracking-wider shadow-lg"
                disabled={submitting}
              >
                {submitting ? "Processing Storage Update..." : "💾 Save Changes & Update Layout"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1 min-w-0 border-t lg:border-t-0 lg:border-l border-neutral-700 pt-4 lg:pt-0 lg:pl-5 flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">🎯 Live Container Visual Preview</h3>
          
          <div className="w-full bg-white p-4 rounded-xl text-slate-900 overflow-hidden shadow-inner border border-neutral-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center scale-95 origin-center">
              
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-[1px] bg-blue-600" />
                  <h4 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[8px]">
                    Our Journey
                  </h4>
                </div>

                <h2 className="text-base sm:text-lg font-serif text-blue-950 font-bold leading-tight break-words">
                  {title1 || "Main Presentation Title"} <br />
                  <span className="text-yellow-600 italic font-light">
                    {title2 || "Sub Highlight Text Context"}
                  </span>
                </h2>

                <div className="space-y-1 max-h-32 overflow-y-auto text-[10px] text-slate-600 leading-relaxed font-light pr-1">
                  {paragraphs.map((p, i) => p.content ? (
                    <p key={i} className="break-words mb-1">{p.content}</p>
                  ) : null)}
                  {!paragraphs.some(p => p.content) && (
                    <p className="text-neutral-400 italic">Dynamic system paragraphs visualization container blocks...</p>
                  )}
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-md border-4 border-neutral-100 aspect-[4/5] bg-slate-200 w-full max-w-[120px]">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Live frame view" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-[9px] bg-neutral-200">
                      No Media Bound
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}