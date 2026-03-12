"use client";
import { Camera, CheckCircle2, Save, Trash2, LayoutPanelLeft, Megaphone, HeartHandshake, Plus, X, MessageSquareQuote, Images, Users, Info, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

// Interfaces
interface SliderData { id: number; main_title: string; sub_title: string; image_url: string; }
interface PromotionData { id: number; title1: string; title2: string; description: string; flag: string; btn_text: string; btn_url: string; image_url: string; }
interface WelcomeData { id?: number; title1: string; title2: string; btn_text: string; btn_url: string; experience_text: string; image_url: string; paragraphs: { id?: number; content: string }[]; }
interface TestimonialData { id: number; name: string; position: string; description: string; image_url: string; }
interface GalleryData { id: number; image_url: string; }
interface TeamIntroData { id?: number; title1: string; names_highlight: string; footer_name: string; image_url: string; paragraphs: { id?: number; content: string }[]; }
interface AboutData { id?: number; title1: string; title2: string; image_url: string; paragraphs: { id?: number; content: string }[]; }

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
        else if (activeTab === "welcome" && data.data) setWelcomeData({ ...data.data, paragraphs: data.data.paragraphs || [{ content: "" }] });
        else if (activeTab === "team" && data.data) setTeamData({ ...data.data, paragraphs: data.data.paragraphs || [{ content: "" }] });
        else if (activeTab === "about" && data.data) setAboutData({ ...data.data, paragraphs: data.data.paragraphs || [{ content: "" }] });
        
        if (data.data?.image_url) setPreviewImage(data.data.image_url);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setPreviewImage(null);
    setSelectedFile(null);
    resetForm();
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

  const addParagraph = () => {
    if(activeTab === "welcome") setWelcomeData({ ...welcomeData, paragraphs: [...welcomeData.paragraphs, { content: "" }] });
    else if(activeTab === "about") setAboutData({ ...aboutData, paragraphs: [...aboutData.paragraphs, { content: "" }] });
    else setTeamData({ ...teamData, paragraphs: [...teamData.paragraphs, { content: "" }] });
  };

  const removeParagraph = (index: number) => {
    if(activeTab === "welcome") setWelcomeData({ ...welcomeData, paragraphs: welcomeData.paragraphs.filter((_, i) => i !== index) });
    else if(activeTab === "about") setAboutData({ ...aboutData, paragraphs: aboutData.paragraphs.filter((_, i) => i !== index) });
    else setTeamData({ ...teamData, paragraphs: teamData.paragraphs.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    // Validation
    if (activeTab === "gallery" && !selectedFile) return showWarning();
    if (activeTab === "hero" && !mainTitle) return showWarning();
    if (activeTab === "promotion" && !title1) return showWarning();

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
      } else if (activeTab === "welcome") {
        endpoint = "/api/admin/welcome";
        formData.append("title1", welcomeData.title1);
        formData.append("title2", welcomeData.title2);
        formData.append("btn_text", welcomeData.btn_text);
        formData.append("btn_url", welcomeData.btn_url);
        formData.append("experience_text", welcomeData.experience_text);
        formData.append("paragraphs", JSON.stringify(welcomeData.paragraphs));
      } else if (activeTab === "about") {
        endpoint = "/api/admin/about";
        formData.append("title1", aboutData.title1);
        formData.append("title2", aboutData.title2);
        formData.append("paragraphs", JSON.stringify(aboutData.paragraphs));
      } else if (activeTab === "team") {
        endpoint = "/api/admin/team-intro";
        formData.append("title1", teamData.title1);
        formData.append("names_highlight", teamData.names_highlight);
        formData.append("footer_name", teamData.footer_name);
        formData.append("paragraphs", JSON.stringify(teamData.paragraphs));
      } else if (activeTab === "testimonials") {
        endpoint = "/api/admin/testimonials";
        formData.append("name", testiName);
        formData.append("position", testiPosition);
        formData.append("description", testiDesc);
      } else if (activeTab === "gallery") {
        endpoint = "/api/admin/gallery";
        // Gallery වලදී යවන්නේ image එක විතරයි
      }

      if (selectedFile) formData.append("image", selectedFile);

      const res = await fetch(endpoint, { method: "POST", body: formData });
      const result = await res.json();
      
      if (result.success) {
        setIsSaved(true);
        if (activeTab === "hero") setSliders(prev => [result.data, ...prev]);
        if (activeTab === "promotion") setPromotions(prev => [result.data, ...prev]);
        if (activeTab === "testimonials") setTestimonials(prev => [result.data, ...prev]);
        if (activeTab === "gallery") setGallery(prev => [result.data, ...prev]);
        
        resetForm();
        Swal.fire({ icon: "success", title: "Saved successfully!", timer: 1500, showConfirmButton: false });
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      Swal.fire("Error", "Save failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({ title: "Delete?", text: "This will be permanently removed.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444" });
    if (confirm.isConfirmed) {
      try {
        const endpoint = `/api/admin/${activeTab === "hero" ? "slider" : activeTab}/${id}`;
        await fetch(endpoint, { method: "DELETE" });
        if (activeTab === "hero") setSliders(prev => prev.filter(i => i.id !== id));
        if (activeTab === "promotion") setPromotions(prev => prev.filter(i => i.id !== id));
        if (activeTab === "testimonials") setTestimonials(prev => prev.filter(i => i.id !== id));
        if (activeTab === "gallery") setGallery(prev => prev.filter(i => i.id !== id));
        Swal.fire("Deleted!", "", "success");
      } catch (error) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  const resetForm = () => {
    setMainTitle(""); setSubTitle(""); setTitle1(""); setTitle2(""); setDescription(""); 
    setFlag(""); setBtnText(""); setBtnUrl(""); setTestiName(""); setTestiPosition(""); setTestiDesc("");
    setSelectedFile(null); setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showWarning = () => Swal.fire({ icon: "warning", title: "Missing Data", text: "Please provide all required information." });

  return (
    <div className="max-w-6xl mx-auto pb-20 p-4">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif italic text-slate-900">Content Management</h1>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
            <button onClick={() => setActiveTab("hero")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "hero" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><LayoutPanelLeft size={16} /> Hero</button>
            <button onClick={() => setActiveTab("promotion")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "promotion" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Megaphone size={16} /> Promotions</button>
            <button onClick={() => setActiveTab("welcome")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "welcome" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><HeartHandshake size={16} /> Welcome</button>
            <button onClick={() => setActiveTab("about")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "about" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Info size={16} /> About</button>
            <button onClick={() => setActiveTab("team")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "team" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Users size={16} /> Team</button>
            <button onClick={() => setActiveTab("testimonials")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "testimonials" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><MessageSquareQuote size={16} /> Testimonials</button>
            <button onClick={() => setActiveTab("gallery")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === "gallery" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200"}`}><Images size={16} /> Gallery</button>
          </div>
        </div>
        <button onClick={handleSave} disabled={isLoading} className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${isLoading ? "bg-slate-400" : "bg-blue-600 text-white hover:bg-slate-900 shadow-xl"}`}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {activeTab === "gallery" ? "Upload Photo" : "Save Changes"}
        </button>
      </header>

      <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-sm mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Inputs */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif italic border-l-4 border-blue-600 pl-4 capitalize">{activeTab} Details</h3>
            
            {activeTab === "gallery" ? (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Gallery Mode:</strong> No text fields required. Just select a high-quality image and click the <strong>Upload Photo</strong> button.
                </p>
              </div>
            ) : activeTab === "hero" ? (
              <div className="space-y-4">
                <input type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} placeholder="Main Title" className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-transparent focus:border-blue-200 transition-all" />
                <textarea rows={3} value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="Sub Title" className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-transparent focus:border-blue-200 transition-all" />
              </div>
            ) : activeTab === "promotion" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={title1} onChange={(e) => setTitle1(e.target.value)} placeholder="Title 1" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={title2} onChange={(e) => setTitle2(e.target.value)} placeholder="Title 2" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
                <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="Flag (e.g. Advert)" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="Btn Text" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  <input type="text" value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} placeholder="Btn URL" className="bg-slate-50 p-4 rounded-xl outline-none" />
                </div>
              </div>
            ) : activeTab === "testimonials" ? (
              <div className="space-y-4">
                <input type="text" value={testiName} onChange={(e) => setTestiName(e.target.value)} placeholder="Name" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <input type="text" value={testiPosition} onChange={(e) => setTestiPosition(e.target.value)} placeholder="Position" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                <textarea rows={4} value={testiDesc} onChange={(e) => setTestiDesc(e.target.value)} placeholder="Their Story..." className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            ) : (
              /* Welcome, Team, About Sections */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={activeTab === 'team' ? teamData.title1 : activeTab === 'about' ? aboutData.title1 : welcomeData.title1} onChange={e => activeTab === 'team' ? setTeamData({...teamData, title1: e.target.value}) : activeTab === 'about' ? setAboutData({...aboutData, title1: e.target.value}) : setWelcomeData({...welcomeData, title1: e.target.value})} placeholder="Title 1" className="bg-slate-50 p-4 rounded-xl outline-none" />
                  {activeTab !== 'team' && <input type="text" value={activeTab === 'about' ? aboutData.title2 : welcomeData.title2} onChange={e => activeTab === 'about' ? setAboutData({...aboutData, title2: e.target.value}) : setWelcomeData({...welcomeData, title2: e.target.value})} placeholder="Title 2" className="bg-slate-50 p-4 rounded-xl outline-none" />}
                  {activeTab === 'team' && <input type="text" value={teamData.names_highlight} onChange={e => setTeamData({...teamData, names_highlight: e.target.value})} placeholder="Names Highlight" className="bg-slate-50 p-4 rounded-xl outline-none" />}
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Paragraphs</label>
                  {(activeTab === 'welcome' ? welcomeData.paragraphs : activeTab === 'about' ? aboutData.paragraphs : teamData.paragraphs).map((para, idx) => (
                    <div key={idx} className="flex gap-2 group">
                      <textarea className="w-full bg-slate-50 p-4 rounded-xl outline-none text-sm border border-transparent focus:border-blue-100" rows={2} value={para.content} onChange={e => handleParaChange(idx, e.target.value)} placeholder={`Paragraph ${idx + 1}`} />
                      <button onClick={() => removeParagraph(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={18}/></button>
                    </div>
                  ))}
                  <button onClick={addParagraph} className="flex items-center gap-2 text-blue-600 font-bold text-[10px] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"><Plus size={14}/> ADD NEW PARAGRAPH</button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-500 ml-1">Featured Image</label>
            <div onClick={triggerImageUpload} className="group relative aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-slate-100 hover:border-blue-300">
              {previewImage ? (
                <>
                  <img src={previewImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <Camera size={40} className="text-white opacity-70 group-hover:scale-110 transition-transform" />
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <div className="bg-white p-4 rounded-full shadow-sm mx-auto w-fit text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Camera size={30} />
                  </div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Click to select photo</p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">Best resolution: 1920x1080px (Slider) | 800x1000px (Content)</p>
          </div>
        </div>
      </div>

      {/* Existing Records Section */}
      {["hero", "promotion", "testimonials", "gallery"].includes(activeTab) && (
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif italic border-l-4 border-slate-900 pl-4 capitalize">Existing {activeTab}</h3>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Count: {activeTab === 'hero' ? sliders.length : activeTab === 'promotion' ? promotions.length : activeTab === 'testimonials' ? testimonials.length : gallery.length}</span>
          </div>

          {activeTab === "gallery" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                  <img src={img.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-4">
                    <button onClick={() => handleDelete(img.id)} className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-red-500 transition-all hover:scale-110"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <div className="col-span-full py-10 text-center text-slate-400 italic">No gallery photos yet.</div>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="pb-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Visual</th>
                    <th className="pb-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Main Info</th>
                    <th className="pb-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(activeTab === "hero" ? sliders : activeTab === "promotion" ? promotions : testimonials).map((item: any) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                          <img src={item.image_url} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-5">
                        <p className="font-bold text-slate-900 text-sm">{activeTab === "hero" ? item.main_title : activeTab === "promotion" ? item.title1 : item.name}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{activeTab === "hero" ? item.sub_title : item.description}</p>
                      </td>
                      <td className="py-5 text-right">
                        <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(activeTab === "hero" ? sliders : activeTab === "promotion" ? promotions : testimonials).length === 0 && <div className="py-12 text-center text-slate-400 italic">List is empty. Add some content!</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}