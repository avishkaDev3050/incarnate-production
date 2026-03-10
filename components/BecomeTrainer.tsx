"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BecomeTrainer() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // වම් පැත්තේ Content එක වමේ සිට ඇතුළට එන animation එක
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

      // දකුණු පැත්තේ පින්තූරය දකුණේ සිට ඇතුළට එන animation එක
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
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT SIDE: Text Content */}
        <div ref={contentRef} className="order-2 lg:order-1 space-y-8">
          <div>
            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-3">
              Step Into Leadership
            </h4>
            <h2 className="text-4xl md:text-6xl font-serif text-blue-900 italic font-bold leading-tight">
              Ready to Lead Your Own Classes?
            </h2>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            Our Become a Trainer program is a structured pathway for experienced 
            practitioners to transition into certified leadership. We provide you 
            with a complete toolkit of resources, spiritual guidance, and 
            business support.
          </p>

          <ul className="space-y-4">
            {["In-depth Theological Study", "Advanced Anatomy Training", "Marketing & Growth Support"].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-blue-900 font-semibold">
                <div className="bg-yellow-400 p-1 rounded-full">
                  <Check size={16} />
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

        {/* RIGHT SIDE: Image with Custom Shape */}
        <div ref={imageRef} className="order-1 lg:order-2 relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image 
              src="https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?q=80&w=800" 
              alt="Become a Trainer" 
              width={800}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-900/5 rounded-full -z-0" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border-4 border-yellow-400 rounded-[2rem] -z-0" />
        </div>

      </div>
    </section>
  );
}