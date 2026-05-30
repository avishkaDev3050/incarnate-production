"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

interface Slide {
  id: number;
  main_title: string;
  sub_title: string;
  image_url: string;
}

export default function SliderManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "/api/admin/slider";

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setSlides(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
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
    setTitle("");
    setSubTitle("");
    setImageFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingId(slide.id);
    setTitle(slide.main_title);
    setSubTitle(slide.sub_title);
    setPreviewUrl(slide.image_url);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
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
          text: editingId ? "Slider updated successfully." : "New slider added successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
        setIsModalOpen(false);
        fetchSliders();
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
              text: "The slide has been deleted.",
              icon: "success",
              confirmButtonColor: "#2563eb"
            });
            fetchSliders();
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
            text: "Failed to delete slide.",
            icon: "error",
            confirmButtonColor: "#2563eb"
          });
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-neutral-900 text-white min-h-screen rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hero Slider Manager</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
        >
          + Add New Slide
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading sliders...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 border border-dashed border-neutral-700 rounded">No slides found. Create one!</div>
      ) : (
        <div className="overflow-x-auto bg-neutral-800 rounded-lg border border-neutral-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-700 text-neutral-200">
                <th className="p-4">Image</th>
                <th className="p-4">Main Title</th>
                <th className="p-4">Sub Title</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-neutral-750 transition">
                  <td className="p-4">
                    <div className="relative w-24 h-14 bg-neutral-900 rounded overflow-hidden">
                      <Image src={slide.image_url} alt={slide.main_title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-semibold max-w-xs truncate">{slide.main_title}</td>
                  <td className="p-4 text-neutral-400 max-w-xs truncate">{slide.sub_title}</td>
                  <td className="p-4 text-center space-x-2">
                    <button 
                      onClick={() => openEditModal(slide)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(slide.id)}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg w-full max-w-4xl lg:max-w-5xl shadow-2xl relative my-auto flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-4 text-blue-500">
                {editingId ? "✏️ Edit Slider" : "🚀 Add New Slider"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Main Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Sub Title</label>
                  <textarea 
                    value={subTitle} 
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Slider Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-650 cursor-pointer"
                    required={!editingId}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : editingId ? "Update Slide" : "Save Slide"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-700 pt-6 md:pt-0 md:pl-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Frontend Live Preview</h3>
                
                <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-inner border border-neutral-700 group">
                  {previewUrl ? (
                    <>
                      <Image src={previewUrl} alt="Live Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 z-10" />
                      
                      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 text-center">
                        <div className="max-w-md w-full px-2">
                          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 break-words drop-shadow-lg line-clamp-2">
                            {title || "Main Title Appears Here"}
                          </h2>
                          <p className="text-[10px] sm:text-xs md:text-sm text-slate-100 font-light italic break-words drop-shadow-md line-clamp-3">
                            {subTitle || "Sub title text appears here in real-time."}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Upload an image to see live preview</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-neutral-400 mt-4 bg-neutral-900/50 p-3 rounded border border-neutral-800">
                💡 <strong>Tip:</strong> This shows how your content layout, font readability, and the dark overlay will appear on the main website container before saving.
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}