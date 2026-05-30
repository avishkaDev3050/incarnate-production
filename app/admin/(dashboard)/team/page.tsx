"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Paragraph {
  id?: number;
  content: string;
}

export default function TeamAdminPage() {
  const [title1, setTitle1] = useState("");
  const [namesHighlight, setNamesHighlight] = useState("");
  const [footerName, setFooterName] = useState("");
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([{ content: "" }]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch("/api/admin/team-intro");
        const result = await res.json();
        
        if (result.success && result.data) {
          const { title1, names_highlight, footer_name, image_url, paragraphs } = result.data;
          setTitle1(title1 || "");
          setNamesHighlight(names_highlight || "");
          setFooterName(footer_name || "");
          setExistingImageUrl(image_url || "");
          
          if (paragraphs && paragraphs.length > 0) {
            setParagraphs(paragraphs);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // 2. Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 3. Dynamic Paragraph Handlers
  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index].content = value;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { content: "" }]);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length === 1) {
      setParagraphs([{ content: "" }]);
    } else {
      setParagraphs(paragraphs.filter((_, i) => i !== index));
    }
  };

  // 4. Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("title1", title1);
      formData.append("names_highlight", namesHighlight);
      formData.append("footer_name", footerName);
      formData.append("image_url", existingImageUrl);
      
      // Filter out empty paragraphs before sending
      const filteredParagraphs = paragraphs.filter(p => p.content.trim() !== "");
      formData.append("paragraphs", JSON.stringify(filteredParagraphs));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/admin/team-intro", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setStatus({ type: "success", message: "Team introduction updated successfully!" });
        // Refresh existing image if newly uploaded
        if (imageFile && result.image_url) {
          setExistingImageUrl(result.image_url);
          setImageFile(null);
          setImagePreview(null);
        }
      } else {
        setStatus({ type: "error", message: result.message || "Something went wrong." });
      }
    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "Failed to update team intro." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-900" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Manage Team Introduction</h1>
          <p className="text-blue-200 text-sm mt-1">Update founder details, image, and paragraphs dynamically.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Status Messages */}
          {status && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              status.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: General Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Main Title</label>
                <input
                  type="text"
                  value={title1}
                  onChange={(e) => setTitle1(e.target.value)}
                  placeholder="e.g., Meet Our Founder"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Highlighted Name / Text</label>
                <input
                  type="text"
                  value={namesHighlight}
                  onChange={(e) => setNamesHighlight(e.target.value)}
                  placeholder="e.g., Andy Anderson"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Name (Caption)</label>
                <input
                  type="text"
                  value={footerName}
                  onChange={(e) => setFooterName(e.target.value)}
                  placeholder="e.g., Andy Anderson (Founder)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Right Side: Image Management */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Founder Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative min-h-[240px]">
                
                {imagePreview || existingImageUrl ? (
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={imagePreview || existingImageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <label htmlFor="image-upload" className="absolute bottom-3 right-3 bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white shadow transition-all flex items-center gap-1.5 backdrop-blur-sm">
                      <Upload size={14} /> Change Image
                    </label>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer text-center p-6 w-full h-full">
                    <Upload size={32} className="text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                    <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
                  </label>
                )}

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Dynamic Paragraphs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-semibold text-slate-800">Introduction Paragraphs</h3>
                <p className="text-xs text-slate-400">The first paragraph will automatically stand out in a larger font on the frontend.</p>
              </div>
              <button
                type="button"
                onClick={addParagraph}
                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>

            <div className="space-y-3">
              {paragraphs.map((p, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <span className="bg-slate-100 text-slate-500 font-mono text-xs w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-3">
                    {index + 1}
                  </span>
                  <textarea
                    value={p.content}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1} content...`}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all outline-none text-sm resize-y"
                    required={index === 0} // Require at least the first one
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="p-2.5 mt-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-900 text-white rounded-xl font-semibold text-sm hover:bg-blue-950 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2 shadow-md shadow-blue-900/10"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}