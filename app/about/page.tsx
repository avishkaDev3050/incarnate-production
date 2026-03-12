"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import TeamSection from "@/components/TeamSection";
import VisionMision from "@/components/VisionMission";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Paragraph {
  content: string;
}

interface AboutData {
  title1: string;
  title2: string;
  image_url: string;
  paragraphs: Paragraph[];
}

export default function AboutUs() {
  const containerRef = useRef(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/admin/about");
        const result = await res.json();
        if (result.success && result.data) {
          setAboutData(result.data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // 2. GSAP Animation Logic (Data load වුණාට පස්සේ run වෙන්න ඕනේ)
  useEffect(() => {
    if (!loading && aboutData) {
      const ctx = gsap.context(() => {
        gsap.from(".reveal-section", {
          scrollTrigger: {
            trigger: ".reveal-section",
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, aboutData]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900" size={40} />
      </div>
    );
  }

  if (!aboutData) return null;

  return (
    <main ref={containerRef} className="bg-white overflow-hidden">
      {/* Page Hero */}
      <PageHero image="/back.png" title="About Us" />

      <section className="reveal-section py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Image */}
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl bg-slate-100 order-1">
            <Image 
              src={aboutData.image_url || "/uploads/about.png"} 
              alt="Our Story" 
              width={600} 
              height={800} 
              className="object-cover w-full h-[500px] transition-transform duration-700 group-hover:scale-105"
              priority 
            />
          </div>
          
          {/* Right Side: Content */}
          <div className="space-y-8 order-2">
            <div className="space-y-2">
              <span className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-sm">
                Since 2020
              </span>
              <h2 className="text-5xl md:text-6xl font-serif italic text-blue-900 leading-tight">
                {aboutData.title1} <br/> 
                <span className="text-yellow-500">{aboutData.title2}</span>
              </h2>
            </div>

            <div className="space-y-6">
              {aboutData.paragraphs && aboutData.paragraphs.map((para, index) => (
                <p key={index} className="text-slate-600 text-lg leading-relaxed font-light">
                  {para.content}
                </p>
              ))}
            </div>
          </div>

        </div>
      </section>

      <VisionMision />
      <TeamSection />
    </main>
  );
}