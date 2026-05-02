"use client";
import React, { useState, useEffect } from "react";
import { Save, Loader2, Upload, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function TrainingExploreAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    journey_text: "",
    title_main: "",
    title_highlight: "",
    quote: "",
    description: "",
    features: [] as string[],
    image_url: ""
  });

  useEffect(() => {
    fetch("/api/admin/training-explore")
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setFormData(json.data);
          setPreview(json.data.image_url);
        }
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();
    data.append("journey_text", formData.journey_text);
    data.append("title_main", formData.title_main);
    data.append("title_highlight", formData.title_highlight);
    data.append("quote", formData.quote);
    data.append("description", formData.description);
    data.append("features", JSON.stringify(formData.features));
    data.append("existing_image", formData.image_url);
    if (file) data.append("file", file);

    try {
      const res = await fetch("/api/admin/training-explore", {
        method: "POST",
        body: data,
      });
      const resJson = await res.json();
      if (resJson.success) {
        Swal.fire("Success", "Data updated successfully!", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-sm mt-10 border border-slate-100">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-blue-900">Edit Training Intro</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-900 text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-blue-800 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Journey Text</label>
            <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-900" value={formData.journey_text} onChange={e => setFormData({...formData, journey_text: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title Main</label>
               <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-900" value={formData.title_main} onChange={e => setFormData({...formData, title_main: e.target.value})} />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Highlight</label>
               <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-900" value={formData.title_highlight} onChange={e => setFormData({...formData, title_highlight: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quote</label>
            <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-900 h-24" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} />
          </div>
        </div>

        {/* Right Side: Image Upload */}
        <div className="space-y-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Featured Image</label>
          <div className="relative group aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] overflow-hidden flex items-center justify-center">
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <label className="cursor-pointer bg-white p-4 rounded-full text-blue-900">
                    <Upload size={24} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="text-slate-300 mb-2" size={40} />
                <span className="text-slate-400 font-bold">Choose Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
        <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-900 h-40" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>

      {/* Features Management */}
      <div className="mt-10 p-6 bg-slate-50 rounded-3xl">
        <div className="flex justify-between mb-4">
          <label className="font-bold text-blue-900">Curriculum Features</label>
          <button onClick={() => setFormData({...formData, features: [...formData.features, ""]})} className="text-blue-900 font-bold text-sm flex items-center gap-1">
            <Plus size={16} /> Add Feature
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input 
                className="flex-1 p-3 bg-white border rounded-xl" 
                value={f} 
                onChange={(e) => {
                  const newF = [...formData.features];
                  newF[i] = e.target.value;
                  setFormData({...formData, features: newF});
                }} 
              />
              <button onClick={() => setFormData({...formData, features: formData.features.filter((_, idx) => idx !== i)})} className="text-red-400">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}