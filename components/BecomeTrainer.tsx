"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BecomeTrainer() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/become-trainer")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data) return;

    let ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      gsap.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (loading) return (
    <div className="py-24 flex justify-center items-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-900" size={40} />
    </div>
  );

  if (!data) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT SIDE: Text Content */}
        <div ref={contentRef} className="order-2 lg:order-1 space-y-8">
          <div>
            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-3">
              {data.sub_title}
            </h4>
            <h2 className="text-4xl md:text-6xl font-serif text-blue-900 italic font-bold leading-tight">
              {data.main_title}
            </h2>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            {data.description}
          </p>

          <ul className="space-y-4">
            {Array.isArray(data.features) && data.features.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-4 text-blue-900 font-semibold">
                <div className="bg-yellow-400 p-1 rounded-full">
                  <span className="flex items-center justify-center">
                    <Check size={16} />
                  </span>
                </div>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <button className="bg-blue-900 text-white px-10 py-4 rounded-full font-bold hover:bg-yellow-500 hover:text-blue-900 transition-all shadow-lg hover:shadow-2xl">
              Start Your Application
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div ref={imageRef} className="order-1 lg:order-2 relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 aspect-[4/5]">
            {data.image_url && (
              <Image 
                src={data.image_url} 
                alt="Become a Trainer" 
                fill
                className="object-cover"
              />
            )}
          </div>
          
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-900/5 rounded-full -z-0" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border-4 border-yellow-400 rounded-[2rem] -z-0" />
        </div>

      </div>
    </section>
  );
}