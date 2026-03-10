"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    // Scroll කරද්දී වීඩියෝ එක පොඩ්ඩක් scale-up වෙලා මතු වෙන animation එක
    gsap.fromTo(videoContainerRef.current, 
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Title & Small Text */}
        <div className="mb-12 space-y-4">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-xs">
            Experience the Flow
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif text-blue-900 italic">
            Watch Our Journey
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            See how we combine the physical art of stretching with the spiritual depth of the Psalms to create a unique wellbeing experience.
          </p>
        </div>

        {/* Video Container */}
        <div 
          ref={videoContainerRef}
          className="relative group aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white bg-slate-100"
        >
          {/* Placeholder Image or Real Video */}
          <video 
            className="w-full h-full object-cover"
            controls
          >
            <source src="/promo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Play Overlay (Optional - Hidden when playing) */}
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20 group-hover:bg-transparent transition-all pointer-events-none">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="text-blue-900 fill-blue-900 ml-1" size={32} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}