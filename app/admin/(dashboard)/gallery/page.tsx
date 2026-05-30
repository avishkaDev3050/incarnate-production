"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

interface GalleryItem {
  id: number;
  image_url: string;
  created_at?: string;
}

export default function GalleryAdminSection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery"); // ඔයාගේ Tabs අතරින් Gallery එක active කියලා හිතමු

  // 1. Fetch Images (GET - /api/admin/gallery)
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const result = await res.json();
      if (result.success) {
        setGallery(result.data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 2. Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 3. Upload Image (POST - /api/admin/gallery)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Uploaded!",
          text: "Image successfully added to gallery.",
          confirmButtonColor: "#1e3a8a",
        });

        setImageFile(null);
        setImagePreview(null);
        fetchGallery(); // Grid එක refresh කරනවා
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: result.message || "Failed to upload image.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setUploading(false);
    }
  };

  // 4. Fixed Delete Function (DELETE - /api/admin/gallery/[id])
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      text: "This will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        // Dynamic Route URL එක නිවැරදිව සාදා ගැනීම (/api/admin/gallery/8)
        const endpoint = `/api/admin/${activeTab === "hero" ? "slider" : activeTab}/${id}`;
        
        const response = await fetch(endpoint, { 
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const resData = await response.json();

        // පිළිතුර සාර්ථක නැත්නම් error එකක් throw කරනවා
        if (!response.ok || !resData.success) {
          throw new Error(resData.message || "Delete failed from server");
        }

        // UI Arrays Update කිරීම
        if (activeTab === "gallery") {
          setGallery((prev) => prev.filter((i) => i.id !== id));
        }
        // (ඔයාගේ අනෙක් Tab States තියෙනවා නම් මෙතනට දාන්න පුළුවන්)
        // if (activeTab === "hero") setSliders((prev) => prev.filter((i) => i.id !== id));

        Swal.fire("Deleted!", "Your image has been removed.", "success");

      } catch (error: any) {
        console.error("Delete Error:", error);
        Swal.fire("Error", error.message || "Delete failed", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-950" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon size={22} /> Gallery Management
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage your application dynamic gallery photos.</p>
        </div>
        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono px-3 py-1.5 rounded-lg text-xs">
          Total: {gallery.length} Images
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Form: Add Image */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900">Upload to Gallery</h3>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative min-h-[200px]">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={imagePreview}
                    alt="Upload Preview"
                    fill
                    className="object-cover"
                  />
                  <label htmlFor="gallery-file-input" className="absolute bottom-2 right-2 bg-white text-slate-800 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-slate-100 shadow flex items-center gap-1">
                    <Upload size={12} /> Change
                  </label>
                </div>
              ) : (
                <label htmlFor="gallery-file-input" className="flex flex-col items-center justify-center cursor-pointer text-center p-4 w-full h-full">
                  <Upload size={26} className="text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-600">Choose Image File</span>
                  <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP</span>
                </label>
              )}

              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !imageFile}
              className="w-full py-2.5 bg-blue-950 text-white rounded-xl font-medium text-xs hover:bg-blue-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Uploading...
                </>
              ) : (
                "Add Image"
              )}
            </button>
          </form>
        </div>

        {/* Right Content: Images Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-md font-bold text-slate-900 mb-5">Current Gallery</h3>
          
          {gallery.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <ImageIcon size={36} className="mx-auto text-slate-300 mb-1.5" />
              <p className="text-slate-400 text-xs">No images available in gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 bg-slate-50 shadow-sm">
                  <Image
                    src={img.image_url}
                    alt="Gallery Item"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                  
                  {/* Delete Hover Action */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="p-2.5 bg-white text-rose-600 rounded-xl hover:bg-rose-50 transition-all shadow-md"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}