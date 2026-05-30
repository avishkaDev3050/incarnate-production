"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Quote, Plus, Trash2 } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  description: string;
  image_url: string;
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "/api/admin/testimonials";

  // 1. Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setTestimonials(result.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Open modal for creating
  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setPosition("");
    setDescription("");
    setImageFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: Testimonial) => {
    setEditingId(item.id);
    setName(item.name);
    setPosition(item.position);
    setDescription(item.description);
    setPreviewUrl(item.image_url);
    setImageFile(null);
    setIsModalOpen(true);
  };

  // 2. Insert or Update Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("position", position);
      formData.append("description", description);
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
          text: editingId ? "Testimonial updated successfully." : "Testimonial added successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
        setIsModalOpen(false);
        fetchTestimonials();
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

  // 3. Delete Logic
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
              text: "Testimonial has been deleted.",
              icon: "success",
              confirmButtonColor: "#2563eb"
            });
            fetchTestimonials();
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
            text: "Failed to delete testimonial.",
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
        <div>
          <h1 className="text-2xl font-bold">Testimonials Content Manager</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage feedback, user profiles, positions, and layout imagery definitions.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add New Review
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading feedback records...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 border border-dashed border-neutral-700 rounded">No reviews found. Click add new to populate the loop container.</div>
      ) : (
        <div className="overflow-x-auto bg-neutral-800 rounded-xl border border-neutral-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-700 text-neutral-200 text-xs uppercase tracking-wider">
                <th className="p-4 w-20">Avatar</th>
                <th className="p-4 w-1/4">User Meta</th>
                <th className="p-4">Message Segment</th>
                <th className="p-4 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700 text-sm">
              {testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-750 transition">
                  <td className="p-4">
                    <div className="relative w-12 h-12 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700">
                      <img 
                        src={item.image_url || `https://ui-avatars.com/api/?name=${item.name}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-yellow-500 font-medium">{item.position}</div>
                  </td>
                  <td className="p-4 text-neutral-400 max-w-md truncate italic">
                    "{item.description}"
                  </td>
                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-neutral-900 border border-neutral-700 text-neutral-400 p-1.5 rounded-lg hover:text-red-400 hover:border-red-500/30 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CONTAINER FRAME */}
      {isModalOpen && (
        <div 
          style={{ zIndex: 99999 }} 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            style={{ zIndex: 100000 }} 
            className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl w-full max-w-4xl shadow-2xl relative my-auto flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* LEFT AREA: Form controls inputs */}
            <div className="flex-1 min-w-0 space-y-3">
              <h2 className="text-xl font-bold text-blue-500">
                {editingId ? "✏️ Modify Review Statement" : "🚀 Insert Client Testimonial"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name and Position row structure layout */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">User Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-0.5">Corporate Role / Position</label>
                    <input 
                      type="text" 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Managing Director"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-0.5">Statement / Description Message</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Type client feedback here..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 h-16 resize-none text-sm"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-0.5">Profile Picture File</label>
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
                    {submitting ? "Processing..." : editingId ? "Update Data" : "Save Record"}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT AREA: Real-time UI Presentation frame matching frontend container specs */}
            <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-neutral-700 pt-4 md:pt-0 md:pl-5 flex flex-col justify-center bg-gradient-to-br from-blue-950 to-blue-900 p-4 rounded-xl">
              <h3 className="text-xs font-semibold text-blue-300 mb-3 uppercase tracking-wider">🎯 Live Client Component Preview</h3>
              
              <div className="w-full bg-white p-6 rounded-2xl text-slate-900 shadow-xl border-b-4 border-yellow-500 relative flex flex-col items-center max-w-sm mx-auto">
                <Quote className="absolute top-4 left-4 text-slate-100" size={40} />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 mb-3 shadow-md relative">
                    <img 
                      src={previewUrl || `https://ui-avatars.com/api/?name=${name || "User"}`} 
                      alt="Avatar Live Frame" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed italic mb-4 max-h-24 overflow-y-auto pr-0.5">
                    "{description || "Client review description block render contexts will flow dynamically within this container box styling frames..."}"
                  </p>
                  
                  <h5 className="text-blue-900 font-bold text-sm">{name || "Client Name"}</h5>
                  <p className="text-yellow-600 font-semibold text-[10px] uppercase tracking-wider">{position || "Designation / Position"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}