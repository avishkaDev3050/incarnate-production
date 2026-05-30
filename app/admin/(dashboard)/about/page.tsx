"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";

interface Paragraph {
  content: string;
}

export default function AboutManager() {
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([{ content: "" }]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "/api/admin/about";

  // 1. කලින් දත්ත තියෙනවා නම් Fetch කරලා Form එකට දැමීම
  useEffect(() => {
    const fetchAboutData = async () => {
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
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Dynamic Paragraph Operations
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

  // 2. දත්ත Submit කිරීම (Save or Update via ON DUPLICATE KEY)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title1", title1);
      formData.append("title2", title2);
      
      // Backend එක බලාපොරොත්තු වන stringified text array එකක් ලෙස සකස් කිරීම
      formData.append("paragraphs", JSON.stringify(paragraphs));
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image_url", previewUrl);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "About Us content saved successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Could not connect to the database.",
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
        Loading About Section Configuration...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-neutral-900 text-white min-h-screen rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">About Us Content Manager</h1>
        <p className="text-xs text-neutral-400 mt-1">Configure company profiles, multi-paragraph corporate stories, and brand hero graphics.</p>
      </div>

      {/* Grid workspace splitting layout */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
        
        {/* LEFT WORKSPACE: Input Configuration Panel */}
        <div className="flex-1 min-w-0 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500">⚙️ Component Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Horizontal Grid Row for Titles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-300 mb-0.5">Primary Title Line (title1)</label>
                <input 
                  type="text" 
                  value={title1} 
                  onChange={(e) => setTitle1(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-300 mb-0.5">Highlight Title Accent (title2)</label>
                <input 
                  type="text" 
                  value={title2} 
                  onChange={(e) => setTitle2(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required 
                />
              </div>
            </div>

            {/* Dynamic Paragraph Editor Blocks */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs text-neutral-300">Corporate Story Paragraphs</label>
                <button 
                  type="button"
                  onClick={addParagraphField}
                  className="flex items-center gap-1 text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  <Plus size={10} /> Add Paragraph
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <textarea 
                      value={para.content}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      placeholder={`Paragraph block ${idx + 1} narration details...`}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 h-16 resize-none text-xs"
                      required
                    />
                    <button
                      type="button"
                      disabled={paragraphs.length === 1}
                      onClick={() => removeParagraphField(idx)}
                      className="bg-neutral-900 border border-neutral-700 text-neutral-400 p-2.5 rounded hover:text-red-400 hover:border-red-500/30 disabled:opacity-40 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Showcase Media Graphic upload */}
            <div>
              <label className="block text-xs text-neutral-300 mb-0.5">Showcase Media File (Our Story Graphic)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-neutral-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-650 cursor-pointer"
              />
            </div>

            {/* Form Submit Blueprint Actions */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition tracking-wider shadow-lg"
                disabled={submitting}
              >
                {submitting ? "Publishing Database Entry..." : "💾 Update About Content Structure"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDEBAR: Structural Viewport Preview */}
        <div className="flex-1 min-w-0 border-t lg:border-t-0 lg:border-l border-neutral-700 pt-4 lg:pt-0 lg:pl-5 flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">🎯 Frontend Design Live Preview</h3>
          
          <div className="w-full bg-white p-5 rounded-xl text-slate-900 overflow-hidden shadow-inner border border-neutral-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center scale-95 origin-center">
              
              {/* Left Side Visual Frame Mirror */}
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-md aspect-[4/3] sm:aspect-[3/4] bg-slate-100 max-w-[180px] mx-auto w-full">
                {previewUrl ? (
                  <img src={previewUrl} alt="Live content view" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-[10px]">
                    No Media Bound
                  </div>
                )}
              </div>

              {/* Right Side Typography Structure Mirror */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-yellow-600 font-bold uppercase tracking-widest text-[9px] block">
                    Since 2020
                  </span>
                  <h2 className="text-base sm:text-lg font-serif italic text-blue-900 font-bold leading-tight break-words">
                    {title1 || "Main Corporate Title Line"} <br/> 
                    <span className="text-yellow-500">{title2 || "Highlight Accent Target"}</span>
                  </h2>
                </div>

                {/* Looped paragraph container block visualization */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto text-[10px] text-slate-600 leading-relaxed font-light pr-1">
                  {paragraphs.map((p, i) => p.content ? (
                    <p key={i} className="break-words">{p.content}</p>
                  ) : null)}
                  {!paragraphs.some(p => p.content) && (
                    <p className="text-neutral-400 italic">Dynamic narration paragraphs visualization container streams...</p>
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