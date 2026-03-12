"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Paragraph {
  id: number;
  content: string;
}

interface TeamData {
  id: number;
  title1: string;
  names_highlight: string;
  footer_name: string;
  image_url: string;
  paragraphs: Paragraph[];
}

export default function TeamSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/admin/team-intro");
        const result = await res.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // 2. GSAP Animation
  useEffect(() => {
    if (!loading && data) {
      const ctx = gsap.context(() => {
        gsap.from(imageRef.current, {
          x: -80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        });

        gsap.from(contentRef.current, {
          x: 80,
          opacity: 0,
          duration: 1.2,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-900" size={32} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-white text-slate-900 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 italic text-blue-900">
          Meet The Founder
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left: Team Image */}
          <div ref={imageRef} className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
              <Image
                src={data.image_url || "/uploads/team/andy.png"}
                alt={data.footer_name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="mt-6 text-center text-sm font-medium text-blue-900/60 italic">
              {data.footer_name}
            </p>
          </div>

          {/* Right: Team Content */}
          <div ref={contentRef} className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <h3 className="text-3xl font-bold text-blue-900">
              {data.title1} <span className="text-yellow-600 underline decoration-yellow-400 decoration-4 underline-offset-4">{data.names_highlight}</span>
            </h3>
            
            <div className="space-y-4">
              {data.paragraphs && data.paragraphs.map((para, index) => (
                <p 
                  key={para.id || index} 
                  className={`${index === 0 ? "text-slate-700 text-xl font-medium" : "text-slate-600 text-lg"} leading-relaxed`}
                >
                  {para.content}
                </p>
              ))}
            </div>

            <div className="pt-4">
              <a 
                href="https://www.miw.org.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:text-yellow-600 transition-colors border-b-2 border-blue-100 hover:border-yellow-200"
              >
                Visit Movement In Worship
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}