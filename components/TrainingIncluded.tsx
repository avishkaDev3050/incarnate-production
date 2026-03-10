"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Star, Sparkles, Award, ShieldCheck, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function TrainingIncluded() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Title SplitText Animation
      const split = new SplitText(titleRef.current, { type: "chars,words" });
      gsap.from(split.chars, {
        opacity: 0,
        x: 20,
        rotateY: 90,
        stagger: 0.02,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        }
      });

      // 2. Feature Cards Stagger Animation
      gsap.from(".feature-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { title: "Theological Foundation", desc: "Understanding the biblical roots of movement and meditation.", icon: <Star className="text-yellow-500" size={24} /> },
    { title: "Physical Anatomy", desc: "Comprehensive training in safety, alignment, and body awareness.", icon: <ShieldCheck className="text-blue-900" size={24} /> },
    { title: "Class Sequencing", desc: "How to structure a session from opening prayer to final stretch.", icon: <Zap className="text-yellow-500" size={24} /> },
    { title: "Marketing Kit", desc: "Professional templates to help you launch and grow your classes.", icon: <Sparkles className="text-blue-900" size={24} /> },
    { title: "Official Certification", desc: "A globally recognized certificate to lead P&S sessions.", icon: <Award className="text-yellow-500" size={24} /> },
    { title: "Ongoing Mentorship", desc: "Direct access to our senior trainers for continuous guidance.", icon: <Star className="text-blue-900" size={24} /> },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-20">
          <h4 className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">
            Everything you need
          </h4>
          <h2 
            ref={titleRef} 
            className="text-5xl md:text-7xl font-serif text-blue-900 italic font-bold max-w-3xl leading-tight"
          >
            What's Included in Your Training
          </h2>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((item, index) => (
            <div key={index} className="feature-item group border-l-2 border-slate-100 pl-8 hover:border-yellow-400 transition-colors duration-500">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-serif text-blue-900 italic font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-[16px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Simple Bottom Line Decor */}
        <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}