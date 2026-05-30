"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Check } from "lucide-react";

interface Promotion {
  id: number;
  title1: string;
  title2: string;
  description: string;
  flag: string;
  btn_text: string;
  btn_url: string;
  image_url: string;
}

export default function PromotionManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState("");
  const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "/api/admin/promotions";

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setPromotions(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle1("");
    setTitle2("");
    setDescription("");
    setFlag("");
    setBtnText("");
    setBtnUrl("");
    setImageFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (promo: Promotion) => {
    setEditingId(promo.id);
    setTitle1(promo.title1);
    setTitle2(promo.title2);
    setDescription(promo.description);
    setFlag(promo.flag || "");
    setBtnText(promo.btn_text || "");
    setBtnUrl(promo.btn_url || "");
    setPreviewUrl(promo.image_url);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title1", title1);
      formData.append("title2", title2);
      formData.append("description", description);
      formData.append("flag", flag);
      formData.append("btn_text", btnText);
      formData.append("btn_url", btnUrl);
      if (imageFile) formData.append("image", imageFile);

      let response;
      
      if (editingId) {
        formData.append("id", editingId.toString());
        response = await fetch(API_URL, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: editingId ? "Promotion updated successfully." : "New promotion added successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
        setIsModalOpen(false);
        fetchPromotions();
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

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}?id=${id}`, {
            method: "DELETE",
          });
          const resData = await response.json();

          if (resData.success) {
            Swal.fire({
              title: "Deleted!",
              text: "The promotion has been deleted.",
              icon: "success",
              confirmButtonColor: "#2563eb"
            });
            fetchPromotions();
          } else {
            Swal.fire({
              title: "Failed!",
              text: resData.message,
              icon: "error",
              confirmButtonColor: "#2563eb"
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete promotion.",
            icon: "error",
            confirmButtonColor: "#2563eb"
          });
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-neutral-900 text-white min-h-screen rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions Manager</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
        >
          + Add New Promotion
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading promotions...</div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 border border-dashed border-neutral-700 rounded">No promotions found. Create one!</div>
      ) : (
        <div className="overflow-x-auto bg-neutral-800 rounded-lg border border-neutral-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-700 text-neutral-200">
                <th className="p-4">Image</th>
                <th className="p-4">Titles</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-neutral-750 transition">
                  <td className="p-4">
                    <div className="relative w-20 h-20 bg-neutral-900 rounded-xl overflow-hidden">
                      <Image src={promo.image_url} alt={promo.title1} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-xs text-yellow-500 font-bold uppercase">{promo.title1}</div>
                    <div className="font-semibold truncate text-white">{promo.title2}</div>
                    {promo.flag && <span className="inline-block mt-1 text-[10px] bg-neutral-700 px-2 py-0.5 rounded text-neutral-300">{promo.flag}</span>}
                  </td>
                  <td className="p-4 text-neutral-400 max-w-sm truncate text-sm">{promo.description}</td>
                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => openEditModal(promo)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(promo.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div 
          style={{ zIndex: 99999 }} 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            style={{ zIndex: 100000 }} 
            className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl w-full max-w-4xl shadow-2xl relative my-auto flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* LEFT SIDE: Input Form (Height optimized) */}
            <div className="flex-1 min-w-0 space-y-3">
              <h2 className="text-xl font-bold text-blue-500">
                {editingId ? "✏️ Edit Promotion" : "🚀 Add New Promotion"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Title 1 and Title 2 fields inside a row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">Sub Title (title1)</label>
                    <input 
                      type="text" 
                      value={title1} 
                      onChange={(e) => setTitle1(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">Main Title (title2)</label>
                    <input 
                      type="text" 
                      value={title2} 
                      onChange={(e) => setTitle2(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-0.5">Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 h-14 resize-none text-sm"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-0.5">Features (Comma separated values)</label>
                  <input 
                    type="text" 
                    value={flag} 
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="Expert Coaching, Flexible Hours, Certification"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">Button Text</label>
                    <input 
                      type="text" 
                      value={btnText} 
                      onChange={(e) => setBtnText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">Button URL</label>
                    <input 
                      type="text" 
                      value={btnUrl} 
                      onChange={(e) => setBtnUrl(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-0.5">Promotion Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-neutral-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-650 cursor-pointer"
                    required={!editingId}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-1.5 rounded-lg text-sm transition"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : editingId ? "Update Promotion" : "Save Promotion"}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: Crystal Clear Preview Grid */}
            <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-neutral-700 pt-4 md:pt-0 md:pl-5 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Frontend Design Live Preview</h3>
              
              <div className="w-full bg-slate-50 p-4 rounded-xl text-slate-900 overflow-hidden shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-[9px] mb-0.5 break-words line-clamp-1">
                        {title1 || "SUB TITLE APPEARS HERE"}
                      </h4>
                      <h2 className="text-base sm:text-lg font-serif text-blue-900 italic font-bold leading-tight break-words line-clamp-2">
                        {title2 || "Main Layout Title"}
                      </h2>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed break-words line-clamp-3">
                      {description || "Your container description typography will stack and scale here dynamically inside the dashboard frame context."}
                    </p>

                    <ul className="space-y-1">
                      {flag ? (
                        flag.split(",").map((item: string, i: number) => item.trim() && (
                          <li key={i} className="flex items-center gap-1.5 text-blue-900 font-semibold text-[10px]">
                            <div className="bg-yellow-400 p-0.5 rounded-full text-slate-900 flex-shrink-0">
                              <Check size={8} />
                            </div>
                            <span className="truncate">{item.trim()}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-neutral-400 text-[10px] italic">Features dynamic list rendering...</li>
                      )}
                    </ul>

                    <div className="pt-0.5">
                      <button type="button" className="bg-blue-900 text-white px-3 py-1 rounded-full text-[10px] font-bold pointer-events-none shadow-sm">
                        {btnText || "Start Your Application"}
                      </button>
                    </div>
                  </div>

                  <div className="relative flex justify-center">
                    <div className="relative z-10 rounded-xl overflow-hidden shadow-md rotate-2 aspect-[4/5] bg-slate-200 w-full max-w-[120px]">
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 bg-neutral-200">
                          <span className="text-[9px]">No Image Loaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}