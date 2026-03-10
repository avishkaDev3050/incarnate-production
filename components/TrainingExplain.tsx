"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function InstructorTrainingIntro() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Title සහ Text Animation
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

      // 2. Image Reveal Animation
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

      // 3. Floating Animation (පින්තූරය දිගටම පොඩ්ඩක් පාවෙනවා වගේ පේන්න)
      gsap.to(imageRef.current, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16">
          <h4 className="anim-content text-yellow-600 font-bold uppercase tracking-[0.3em] text-xs mb-3">
            Your Journey Starts Here
          </h4>
          <h2 className="anim-content text-5xl md:text-7xl font-serif text-blue-900 italic font-bold">
            Instructor <span className="text-slate-200">/</span> Training
          </h2>
        </div>

{/* Explaination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Image with Effect (5 Columns) */}
          <div className="lg:col-span-5 relative">
            <div 
              ref={imageRef} 
              className="relative z-10 rounded-full aspect-square md:aspect-[4/5] md:rounded-[4rem] overflow-hidden shadow-2xl border-[15px] border-slate-50"
            >
              <Image 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800" 
                alt="Training" 
                fill
                className="object-cover"
              />
            </div>
            {/* Background Decorative Element */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -z-0" />
          </div>

          {/* Right Side: Description (7 Columns) */}
          <div className="lg:col-span-7 space-y-8 lg:pl-10">
            <p className="anim-content text-2xl text-blue-900/80 font-serif leading-relaxed italic">
              "Transform your passion into a meaningful career. Our instructor training provides a unique blend of physical excellence and spiritual depth."
            </p>
            
            <div className="anim-content space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Our comprehensive program is more than a certification; it's a deep dive into the 
                theology of movement. You will learn how to guide others through the Psalms 
                while maintaining a high standard of physical safety and anatomical awareness.
              </p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-blue-900 uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-yellow-400"></span> Online & In-person
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-yellow-400"></span> Global Recognition
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-yellow-400"></span> Ongoing Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-yellow-400"></span> Community Access
                </li>
              </ul>
            </div>

            <div className="anim-content pt-6">
              <button className="group flex items-center gap-4 text-blue-900 font-bold text-lg">
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