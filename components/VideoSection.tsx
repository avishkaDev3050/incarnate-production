"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // YouTube Link එක Embed Link එකකට පරිවර්තනය කිරීම
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0` 
      : url;
  };

  useEffect(() => {
    // API එකෙන් දත්ත ලබා ගැනීම
    const fetchLatestVideo = async () => {
      try {
        const res = await fetch("/api/admin/video");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          // අන්තිමටම දාපු වීඩියෝ එක ගන්නවා
          setVideoData(json.data[0]);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVideo();

    // GSAP Animation
    if (videoContainerRef.current) {
      gsap.fromTo(videoContainerRef.current, 
        { scale: 0.8, opacity: 0, y: 50 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 1.5, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Header Section */}
        <div className="mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full">
             <h4 className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">
               Featured Content
             </h4>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {videoData?.title || "Watch Our Journey"}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            {videoData?.description || "Explore our latest insights and stories through this exclusive video showcase."}
          </p>
        </div>

        {/* Video Frame */}
        <div 
          ref={videoContainerRef}
          className="relative group aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border-12 border-white bg-slate-200"
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : videoData ? (
            <iframe
              src={getEmbedUrl(videoData.video_url)}
              title={videoData.title}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Play size={48} className="mb-2 opacity-20" />
              <p>No video content available</p>
            </div>
          )}

          {/* Overlay Decoration (Optional - subtle gradient) */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
        </div>

      </div>
    </section>
  );
}