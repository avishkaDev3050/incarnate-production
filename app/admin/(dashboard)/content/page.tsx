"use client";
import { Camera, CheckCircle2, Save, Trash2, LayoutPanelLeft, Megaphone, HeartHandshake, Plus, X, MessageSquareQuote, Images, Users, Info } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

// Interfaces
interface SliderData { id: number; main_title: string; sub_title: string; image_url: string; }
interface PromotionData { id: number; title1: string; title2: string; description: string; flag: string; btn_text: string; btn_url: string; image_url: string; }
interface WelcomeData { id?: number; title1: string; title2: string; btn_text: string; btn_url: string; experience_text: string; image_url: string; paragraphs: { id?: number; content: string }[]; }
interface TestimonialData { id: number; name: string; position: string; description: string; image_url: string; }
interface GalleryData { id: number; image_url: string; }
interface TeamIntroData { id?: number; title1: string; names_highlight: string; footer_name: string; image_url: string; paragraphs: { id?: number; content: string }[]; }

interface AboutData { 
    id?: number; 
    title1: string; 
    title2: string; 
    image_url: string; 
    paragraphs: { id?: number; content: string }[]; 
}

export default function SiteContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // States
  const [mainTitle, setMainTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState("");
  const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState("");
  const [promotions, setPromotions] = useState<PromotionData[]>([]);

  const [testiName, setTestiName] = useState("");
  const [testiPosition, setTestiPosition] = useState("");
  const [testiDesc, setTestiDesc] = useState("");
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);

  const [gallery, setGallery] = useState<GalleryData[]>([]);

  const [welcomeData, setWelcomeData] = useState<WelcomeData>({
    title1: "", title2: "", btn_text: "", btn_url: "", experience_text: "", image_url: "",
    paragraphs: [{ content: "" }]
  });

  const [teamData, setTeamData] = useState<TeamIntroData>({
    title1: "", names_highlight: "", footer_name: "", image_url: "",
    paragraphs: [{ content: "" }]
  });

  const [aboutData, setAboutData] = useState<AboutData>({
    title1: "", title2: "", image_url: "",
    paragraphs: [{ content: "" }]
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const endpoint = 
        activeTab === "hero" ? "/api/admin/slider" : 
        activeTab === "promotion" ? "/api/admin/promotions" : 
        activeTab === "testimonials" ? "/api/admin/testimonials" :
        activeTab === "gallery" ? "/api/admin/gallery" :
        activeTab === "team" ? "/api/admin/team-intro" :
        activeTab === "about" ? "/api/admin/about" : 
        "/api/admin/welcome";
      
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        if (activeTab === "hero") setSliders(data.data);
        else if (activeTab === "promotion") setPromotions(data.data);
        else if (activeTab === "testimonials") setTestimonials(data.data);
        else if (activeTab === "gallery") setGallery(data.data);
        else if (activeTab === "welcome" && data.data) {
          setWelcomeData({ ...data.data, paragraphs: data.data.paragraphs || [{ content: "" }] });
          setPreviewImage(data.data.image_url);
        }
        else if (activeTab === "team" && data.data) {
          setTeamData({ ...data.data, paragraphs: data.data.paragraphs || [{ content: "" }] });
          setPreviewImage(data.data.image_url);
        }
        else if (activeTab === "about" && data.data) {
          // Fallback to empty paragraph if none exists
          setAboutData({ 
            ...data.data, 
            paragraphs: Array.isArray(data.data.paragraphs) && data.data.paragraphs.length > 0 
              ? data.data.paragraphs 
              : [{ content: "" }] 
          });
          setPreviewImage(data.data.image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setPreviewImage(null);
    setSelectedFile(null);
  }, [activeTab]);

  const triggerImageUpload = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addParagraph = () => {
    if(activeTab === "welcome") setWelcomeData({ ...welcomeData, paragraphs: [...welcomeData.paragraphs, { content: "" }] });
    else if(activeTab === "about") setAboutData({ ...aboutData, paragraphs: [...aboutData.paragraphs, { content: "" }] });
    else setTeamData({ ...teamData, paragraphs: [...teamData.paragraphs, { content: "" }] });
  };

  const removeParagraph = (index: number) => {
    if(activeTab === "welcome") {
      const updated = welcomeData.paragraphs.filter((_, i) => i !== index);
      setWelcomeData({ ...welcomeData, paragraphs: updated });
    } else if(activeTab === "about") {
      const updated = aboutData.paragraphs.filter((_, i) => i !== index);
      setAboutData({ ...aboutData, paragraphs: updated });
    } else {
      const updated = teamData.paragraphs.filter((_, i) => i !== index);
      setTeamData({ ...teamData, paragraphs: updated });
    }
  };

  const handleParaChange = (index: number, value: string) => {
    if(activeTab === "welcome") {
      const updated = [...welcomeData.paragraphs];
      updated[index].content = value;
      setWelcomeData({ ...welcomeData, paragraphs: updated });
    } else if(activeTab === "about") {
      const updated = [...aboutData.paragraphs];
      updated[index].content = value;
      setAboutData({ ...aboutData, paragraphs: updated });
    } else {
      const updated = [...teamData.paragraphs];
      updated[index].content = value;
      setTeamData({ ...teamData, paragraphs: updated });
    }
  };

  const handleSave = async () => {
    if (activeTab === "hero") { if (!mainTitle || (!selectedFile && !sliders.length)) return showWarning(); }
    else if (activeTab === "promotion") { if (!title1 || (!selectedFile && !promotions.length)) return showWarning(); }
    else if (activeTab === "welcome") { if (!welcomeData.title1) return showWarning(); }
    else if (activeTab === "about") { if (!aboutData.title1) return showWarning(); }
    else if (activeTab === "team") { if (!teamData.title1) return showWarning(); }
    else if (activeTab === "testimonials") { if (!testiName || !testiDesc) return showWarning(); }
    else if (activeTab === "gallery") { if (!selectedFile) return showWarning(); }

    setIsLoading(true);
    try {
      const formData = new FormData();
      let endpoint = "";

      if (activeTab === "hero") {
        endpoint = "/api/admin/slider";
        formData.append("title", mainTitle);
        formData.append("subTitle", subTitle);
      } else if (activeTab === "promotion") {
        endpoint = "/api/admin/promotions";
        formData.append("title1", title1);
        formData.append("title2", title2);
        formData.append("description", description);
        formData.append("flag", flag);
        formData.append("btn_text", btnText);
        formData.append("btn_url", btnUrl);
      } else if (activeTab === "about") {
        endpoint = "/api/admin/about";
        formData.append("title1", aboutData.title1);
        formData.append("title2", aboutData.title2);
        formData.append("paragraphs", JSON.stringify(aboutData.paragraphs));
        if (!selectedFile) formData.append("image_url", aboutData.image_url || "");
      } else if (activeTab === "team") {
        endpoint = "/api/admin/team-intro";
        formData.append("title1", teamData.title1);
        formData.append("names_highlight", teamData.names_highlight);
        formData.append("footer_name", teamData.footer_name);
        formData.append("paragraphs", JSON.stringify(teamData.paragraphs));
        if (!selectedFile) formData.append("image_url", teamData.image_url || "");
      } else if (activeTab === "testimonials") {
        endpoint = "/api/admin/testimonials";
        formData.append("name", testiName);
        formData.append("position", testiPosition);
        formData.append("description", testiDesc);
      } else if (activeTab === "gallery") {
        endpoint = "/api/admin/gallery";
      } else {
        endpoint = "/api/admin/welcome";
        formData.append("title1", welcomeData.title1);
        formData.append("title2", welcomeData.title2);
        formData.append("btn_text", welcomeData.btn_text);
        formData.append("btn_url", welcomeData.btn_url);
        formData.append("experience_text", welcomeData.experience_text);
        formData.append("paragraphs", JSON.stringify(welcomeData.paragraphs));
        if (!selectedFile) formData.append("image_url", welcomeData.image_url || "");
      }

      if (selectedFile) formData.append("image", selectedFile);

      const res = await fetch(endpoint, { method: "POST", body: formData });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setIsSaved(true);
        
        // Real-time update: Add new item to existing list immediately
        if (activeTab === "hero" && result.data) {
          setSliders(prev => [result.data, ...prev]);
        } else if (activeTab === "promotion" && result.data) {
          setPromotions(prev => [result.data, ...prev]);
        } else if (activeTab === "testimonials" && result.data) {
          setTestimonials(prev => [result.data, ...prev]);
        } else if (activeTab === "gallery" && result.data) {
          setGallery(prev => [result.data, ...prev]);
        }
        
        if (activeTab === "hero" || activeTab === "promotion" || activeTab === "testimonials" || activeTab === "gallery") {
          resetForm();
        }
        
        Swal.fire({ icon: "success", title: "Saved!", timer: 2000, showConfirmButton: false });
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        throw new Error(result.message || 'Save failed');
      }
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
      try {
        let endpoint = "";
        if(activeTab === "hero") endpoint = `/api/admin/slider/${id}`;
        else if(activeTab === "promotion") endpoint = `/api/admin/promotions/${id}`;
        else if(activeTab === "testimonials") endpoint = `/api/admin/testimonials/${id}`;
        else if(activeTab === "gallery") endpoint = `/api/admin/gallery/${id}`;
        
        const res = await fetch(endpoint, { method: "DELETE" });
        if (res.ok) { 
          // Real-time update: Remove item from list immediately
          if(activeTab === "hero") setSliders(prev => prev.filter(item => item.id !== id));
          else if(activeTab === "promotion") setPromotions(prev => prev.filter(item => item.id !== id));
          else if(activeTab === "testimonials") setTestimonials(prev => prev.filter(item => item.id !== id));
          else if(activeTab === "gallery") setGallery(prev => prev.filter(item => item.id !== id));
          
          Swal.fire("Deleted!", "Item has been removed.", "success"); 
        }
      } catch (error: any) {
        Swal.fire("Error", "Could not delete", "error");
      }
    }
  };

  const resetForm = () => {
    setMainTitle(""); setSubTitle(""); setTitle1(""); setTitle2(""); setDescription(""); 
    setFlag(""); setBtnText(""); setBtnUrl(""); setTestiName(""); setTestiPosition(""); setTestiDesc("");
    setSelectedFile(null); setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showWarning = () => Swal.fire({ icon: "warning", title: "Required Fields", text: "Please fill required fields." });

  return (
    <div className="max-w-6xl mx-auto pb-20 p-4">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif italic text-slate-900">Content Management</h1>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab("hero")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "hero" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><LayoutPanelLeft size={16} /> Hero Slider</button>
            <button onClick={() => setActiveTab("promotion")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "promotion" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Megaphone size={16} /> Promotions</button>
            <button onClick={() => setActiveTab("welcome")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "welcome" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><HeartHandshake size={16} /> Welcome Section</button>
            <button onClick={() => setActiveTab("about")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "about" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Info size={16} /> About Section</button>
            <button onClick={() => setActiveTab("team")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "team" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Users size={16} /> Team Intro</button>
            <button onClick={() => setActiveTab("testimonials")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "testimonials" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><MessageSquareQuote size={16} /> Testimonials</button>
            <button onClick={() => setActiveTab("gallery")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "gallery" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Images size={16} /> Gallery</button>
          </div>
        </div>
        <button onClick={handleSave} disabled={isLoading} className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${isLoading ? "bg-slate-400" : "bg-blue-600 text-white hover:bg-slate-900 shadow-xl"}`}>
          {isLoading ? "Wait..." : isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {activeTab === "hero" ? "Add Slider" : activeTab === "promotion" ? "Add Promotion" : activeTab === "testimonials" ? "Add Testimonial" : activeTab === "gallery" ? "Add to Gallery" : activeTab === "team" ? "Save Team Intro" : activeTab === "about" ? "Save About Content" : "Save Welcome Content"}
        </button>
      </header>

      <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-sm mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif italic border-l-4 border-blue-600 pl-4">{activeTab.toUpperCase()} Details</h3>
            
            {activeTab === "hero" ? (
              <div className="space-y-4">
                <input type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} placeholder="Main Title" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <textarea rows={3} value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="Sub Title" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            ) : activeTab === "promotion" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={title1} onChange={(e) => setTitle1(e.target.value)} placeholder="Title 1" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={title2} onChange={(e) => setTitle2(e.target.value)} placeholder="Title 2" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="Flag" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="Button Text" className="bg-slate-50 p-4 rounded-xl outline-none" />
                    <input type="text" value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} placeholder="Button URL" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
              </div>
            ) : activeTab === "about" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={aboutData.title1} onChange={e => setAboutData({...aboutData, title1: e.target.value})} placeholder="Title 1 (e.g. Moving with)" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={aboutData.title2} onChange={e => setAboutData({...aboutData, title2: e.target.value})} placeholder="Title 2 (e.g. Purpose & Grace)" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">About Paragraphs</label>
                  {aboutData.paragraphs.map((para, idx) => (
                    <div key={idx} className="flex gap-2">
                      <textarea className="w-full bg-slate-50 p-3 rounded-xl outline-none text-sm" rows={2} value={para.content} onChange={e => handleParaChange(idx, e.target.value)} placeholder={`Paragraph ${idx + 1}`} />
                      <button onClick={() => removeParagraph(idx)} className="text-slate-300 hover:text-red-500"><X size={18}/></button>
                    </div>
                  ))}
                  <button onClick={addParagraph} className="flex items-center gap-1 text-blue-600 font-bold text-[10px]"><Plus size={14}/> ADD PARAGRAPH</button>
                </div>
              </div>
            ) : activeTab === "team" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={teamData.title1} onChange={e => setTeamData({...teamData, title1: e.target.value})} placeholder="Greeting" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={teamData.names_highlight} onChange={e => setTeamData({...teamData, names_highlight: e.target.value})} placeholder="Names Highlight" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Team Paragraphs</label>
                  {teamData.paragraphs.map((para, idx) => (
                    <div key={idx} className="flex gap-2">
                      <textarea className="w-full bg-slate-50 p-3 rounded-xl outline-none text-sm" rows={2} value={para.content} onChange={e => handleParaChange(idx, e.target.value)} placeholder={`Paragraph ${idx + 1}`} />
                      <button onClick={() => removeParagraph(idx)} className="text-slate-300 hover:text-red-500"><X size={18}/></button>
                    </div>
                  ))}
                  <button onClick={addParagraph} className="flex items-center gap-1 text-blue-600 font-bold text-[10px]"><Plus size={14}/> ADD PARAGRAPH</button>
                </div>
                <input type="text" value={teamData.footer_name} onChange={e => setTeamData({...teamData, footer_name: e.target.value})} placeholder="Footer Image Text" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            ) : activeTab === "testimonials" ? (
              <div className="space-y-4">
                <input type="text" value={testiName} onChange={(e) => setTestiName(e.target.value)} placeholder="Customer Name" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <input type="text" value={testiPosition} onChange={(e) => setTestiPosition(e.target.value)} placeholder="Position" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <textarea rows={4} value={testiDesc} onChange={(e) => setTestiDesc(e.target.value)} placeholder="Review Description" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={welcomeData.title1} onChange={e => setWelcomeData({...welcomeData, title1: e.target.value})} placeholder="Title 1" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={welcomeData.title2} onChange={e => setWelcomeData({...welcomeData, title2: e.target.value})} placeholder="Title 2" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Description Paragraphs</label>
                  {welcomeData.paragraphs.map((para, idx) => (
                    <div key={idx} className="flex gap-2">
                      <textarea className="w-full bg-slate-50 p-3 rounded-xl outline-none text-sm" rows={2} value={para.content} onChange={e => handleParaChange(idx, e.target.value)} placeholder={`Paragraph ${idx + 1}`} />
                      <button onClick={() => removeParagraph(idx)} className="text-slate-300 hover:text-red-500"><X size={18}/></button>
                    </div>
                  ))}
                  <button onClick={addParagraph} className="flex items-center gap-1 text-blue-600 font-bold text-[10px]"><Plus size={14}/> ADD PARAGRAPH</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={welcomeData.experience_text} onChange={e => setWelcomeData({...welcomeData, experience_text: e.target.value})} placeholder="Experience" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={welcomeData.btn_text} onChange={e => setWelcomeData({...welcomeData, btn_text: e.target.value})} placeholder="Button Text" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <input type="text" value={welcomeData.btn_url} onChange={e => setWelcomeData({...welcomeData, btn_url: e.target.value})} placeholder="Button URL" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-500">Feature/Profile Image</label>
            <div onClick={triggerImageUpload} className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden">
              {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <Camera size={30} className="text-slate-300" />}
            </div>
          </div>
        </div>
      </div>

      {activeTab !== "welcome" && activeTab !== "team" && activeTab !== "about" && (
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl font-serif italic mb-8 border-l-4 border-slate-900 pl-4">Existing Records</h3>
          {activeTab === "gallery" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100">
                  <img src={img.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete(img.id)} className="bg-white p-2 rounded-full text-red-500 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="pb-4 font-medium text-slate-400">Preview</th>
                    <th className="pb-4 font-medium text-slate-400">Content</th>
                    <th className="pb-4 font-medium text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "hero" ? sliders : activeTab === "promotion" ? promotions : testimonials).map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-none">
                      <td className="py-4"><img src={item.image_url} className="w-12 h-12 object-cover rounded-full border shadow-sm" /></td>
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{activeTab === "hero" ? item.main_title : activeTab === "promotion" ? item.title1 : item.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{activeTab === "hero" ? item.sub_title : activeTab === "promotion" ? item.description : item.description}</p>
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}