"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Loader2, Video } from "lucide-react";
import Swal from "sweetalert2";

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<any>(null);

  // වීඩියෝ දත්ත ලබා ගැනීම
  const fetchVideos = async () => {
    setIsLoading(true);
    const res = await fetch("/api/admin/video");
    const json = await res.json();
    if (json.success) setVideos(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // දත්ත සේව් කිරීම (Insert/Update)
  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: isEditing?.id,
      title: formData.get("title"),
      description: formData.get("description"),
      video_url: formData.get("video_url"),
    };

    const res = await fetch("/api/admin/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      Swal.fire({
        title: "Saved!",
        text: "Video details have been updated.",
        icon: "success",
        confirmButtonColor: "#0f172a"
      });
      setIsEditing(null);
      fetchVideos();
    }
  };

  // වීඩියෝ එකක් මකා දැමීම
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/admin/video?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Deleted!", "Video has been removed.", "success");
        fetchVideos();
      }
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Videos</h1>
          <p className="text-slate-500">Add and manage your YouTube video links</p>
        </div>
        <button 
          onClick={() => setIsEditing({})} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Add Video
        </button>
      </div>

      {/* Form Section */}
      {isEditing && (
        <form onSubmit={handleSave} className="mb-10 bg-white p-6 rounded-4xl border border-blue-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Video size={18} className="text-blue-500" />
              {isEditing.id ? "Edit Video Details" : "Add New Video"}
            </h2>
            <button type="button" onClick={() => setIsEditing(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="title" 
              defaultValue={isEditing.title} 
              placeholder="Video Title" 
              className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all" 
              required 
            />
            <input 
              name="video_url" 
              defaultValue={isEditing.video_url} 
              placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)" 
              className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all" 
              required 
            />
          </div>
          
          <textarea 
            name="description" 
            defaultValue={isEditing.description} 
            placeholder="Video Description" 
            rows={3} 
            className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all" 
          />
          
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            <Save size={18} /> {isEditing.id ? "Update Video" : "Save Video"}
          </button>
        </form>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-4">Video Info</th>
              <th className="px-6 py-4">URL</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                  <p className="text-slate-400 font-medium">Loading videos...</p>
                </td>
              </tr>
            ) : videos.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-20 text-center text-slate-400">No videos found. Click "Add Video" to start.</td>
              </tr>
            ) : (
              videos.map((video: any) => (
                <tr key={video.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{video.title}</p>
                    <p className="text-sm text-slate-500 line-clamp-1">{video.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                      {video.video_url.substring(0, 30)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setIsEditing(video)} 
                        className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(video.id)} 
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}