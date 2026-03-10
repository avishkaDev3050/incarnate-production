"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Loader2, Trash2, FileText } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  productData?: any;
  onSave: (data: any) => void;
}

export default function ProductModal({ isOpen, onClose, mode, productData, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  // Image states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // --- NEW: PDF states ---
  const [lessonPdf, setLessonPdf] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productData && (mode === "edit" || mode === "view")) {
      setFormData({
        name: productData.name || "",
        category: productData.category || "",
        price: productData.price || "",
        description: productData.description || "",
      });
      setExistingImages(Array.isArray(productData.images) ? productData.images : []);
      // Load existing PDF if available
      setExistingPdf(productData.lessonPdf || null);
    } else {
      setFormData({ name: "", category: "", price: "", description: "" });
      setExistingImages([]);
      setExistingPdf(null);
    }
    setSelectedFiles([]);
    setPreviews([]);
    setLessonPdf(null);
  }, [productData, mode, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLessonPdf(e.target.files[0]);
    }
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("existingImages", JSON.stringify(existingImages));
    
    // Send existing PDF status
    if (existingPdf) data.append("existingPdf", existingPdf);

    // Add image files
    selectedFiles.forEach((file) => {
      data.append("files", file);
    });

    // --- NEW: Add PDF file ---
    if (lessonPdf) {
      data.append("lessonPdf", lessonPdf);
    }

    try {
      const url = mode === "add" ? "/api/admin/products" : `/api/admin/products?id=${productData.id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method: method,
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        onSave(result); 
        onClose();
      } else {
        alert(result.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;
  const isReadOnly = mode === "view";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {mode} Product
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full">
            <X size={20} />
          </button>
        </header>

        <form className="p-8 space-y-6 max-h-[75vh] overflow-y-auto" onSubmit={handleSubmit}>
          {/* ... Name and Category fields (keep as is) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">Name</label>
              <input 
                disabled={isReadOnly}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
              <input 
                type="text"
                disabled={isReadOnly}
                placeholder="Enter category name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Image Section (keep as is) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">Images</label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative w-20 h-20 rounded-xl border overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  {!isReadOnly && (
                    <button type="button" onClick={() => removeExistingImage(index)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {previews.map((url, index) => (
                <div key={`new-${index}`} className="relative w-20 h-20 rounded-xl border-2 border-blue-100 overflow-hidden group">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeNewFile(index)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {!isReadOnly && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all">
                  <Plus size={20} />
                  <span className="text-[8px] font-bold uppercase">Add</span>
                </button>
              )}
            </div>
            <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          </div>

          {/* --- NEW: Module Lesson PDF Upload --- */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">Module Lesson (PDF - Optional)</label>
            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {lessonPdf ? lessonPdf.name : (existingPdf ? "Current Lesson PDF" : "No PDF selected")}
                </p>
                {existingPdf && !lessonPdf && <p className="text-[10px] text-blue-500 font-bold uppercase">File exists on server</p>}
              </div>
              {!isReadOnly && (
                <button 
                  type="button" 
                  onClick={() => pdfInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold uppercase bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  {lessonPdf || existingPdf ? "Change" : "Upload PDF"}
                </button>
              )}
            </div>
            <input 
              type="file" 
              hidden 
              ref={pdfInputRef} 
              onChange={handlePdfChange} 
              accept=".pdf" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">Price ($)</label>
            <input 
              type="number"
              disabled={isReadOnly}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
            <textarea 
              disabled={isReadOnly}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {!isReadOnly && (
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:bg-slate-300"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : mode === "add" ? "Create Product" : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}