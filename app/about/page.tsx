"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import TeamSection from "@/components/TeamSection";
import VisionMision from "@/components/VisionMission";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const containerRef = useRef(null);

  // Static Data
  const aboutData = {
    title1: "Learn More About",
    title2: "Incarnate",
    image_url: "/uploads/about.png",
    paragraphs: [
      {
        content: "Incarnate was birthed from the desire to weave my spirituality into the whole of my life. Experiencing the spiritual through faith, through encounters and through the supernatural posses a huge amount of challenges and questions. How does it all fit into this world that I am living in."
      }
    ]
  };

  // GSAP Animation Logic
  useEffect(() => {
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
  }, []);

  return (
    <main ref={containerRef} className="bg-white overflow-hidden">
      {/* Page Hero - Background image එක /back.png ලෙසම තබා ඇත */}
      <PageHero image="/back.png" title="About Us" />

      <section className="reveal-section py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Image */}
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl bg-slate-100 order-1">
            <Image 
              src={aboutData.image_url} 
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
              {aboutData.paragraphs.map((para, index) => (
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