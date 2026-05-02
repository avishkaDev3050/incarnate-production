"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Data structure එක සඳහා Interface එකක්
interface TrainingData {
  journey_text: string;
  title_main: string;
  title_highlight: string;
  image_url: string;
  quote: string;
  description: string;
  features: string[]; 
}

export default function InstructorTrainingIntro() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  
  // State කළමනාකරණය
  const [data, setData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API එකෙන් දත්ත ලබා ගැනීම
    const fetchExploreData = async () => {
      try {
        const response = await fetch("/api/admin/training-explore");
        const json = await response.json();
        
        if (json.success && json.data) {
          // JSON string එක array එකක් බවට පත් කිරීම (API එකෙන් කරලා නැත්නම්)
          const fetchedData = {
            ...json.data,
            features: typeof json.data.features === "string" 
              ? JSON.parse(json.data.features) 
              : json.data.features
          };
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  useEffect(() => {
    // Data ලැබුණු පසු පමණක් Animation ක්‍රියාත්මක කිරීම
    if (!data) return;

    let ctx = gsap.context(() => {
      gsap.from(".anim-content", {
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      gsap.to(imageRef.current, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // Loading අවස්ථාවේදී පෙන්වන දේ
  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!data) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16">
          <h4 className="anim-content text-yellow-600 font-bold uppercase tracking-[0.3em] text-xs mb-3">
            {data.journey_text}
          </h4>
          <h2 className="anim-content text-5xl md:text-7xl font-serif text-blue-900 italic font-bold leading-tight">
            {data.title_main} <span className="text-slate-200">/</span> {data.title_highlight}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Image Holder */}
          <div className="lg:col-span-5 relative">
            <div 
              ref={imageRef} 
              className="relative z-10 rounded-[2rem] aspect-square md:aspect-[4/5] md:rounded-[4rem] overflow-hidden shadow-2xl border-[15px] border-slate-50"
            >
              <Image 
                src={data.image_url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"} 
                alt="Training" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -z-0" />
          </div>

          {/* Right Side: Content */}
          <div className="lg:col-span-7 space-y-8 lg:pl-10">
            <p className="anim-content text-2xl text-blue-900/80 font-serif leading-relaxed italic border-l-4 border-yellow-400 pl-6">
              "{data.quote}"
            </p>
            
            <div className="anim-content space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>{data.description}</p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-blue-900 uppercase tracking-wider">
                {data.features && data.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-yellow-400"></span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="anim-content pt-6">
              <button className="group flex items-center gap-4 text-blue-900 font-bold text-lg hover:text-yellow-600 transition-colors">
                <span className="bg-yellow-400 w-14 h-14 flex items-center justify-center rounded-full group-hover:bg-blue-900 group-hover:text-white transition-all duration-300">
                  →
                </span>
                Explore Curriculum
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}