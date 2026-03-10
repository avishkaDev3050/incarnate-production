"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion"; // කලින් හදපු component එක

gsap.registerPlugin(ScrollTrigger);

export default function Frequently() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sections එකින් එක මතු වීමේ animation එක
      gsap.from(".faq-wrapper", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top 80%",
        }
      });
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  // FAQ Sections 5ක් පෙන්වීමට array එකක්
  const faqSections = [1, 2, 3, 4, 5];

  return (
    <main ref={mainRef} className="bg-white pb-20">
      {/* Hero Section */}
      <PageHero 
        image="/back.png"
        title="Frequently Asked Questions"
      />
      
      {/* FAQ Components - 5 Times */}
      <div className="max-w-7xl mx-auto mt-10">
        {faqSections.map((item) => (
          <div key={item} className="faq-wrapper border-b border-slate-50 last:border-none">
            {/* Section එක වෙන් කර හඳුනා ගැනීමට ලකුණක් (Optional) */}
            <div className="px-6 pt-10">
                <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs">
                    Category {item}
                </span>
            </div>
            
            <FaqAccordion />
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="faq-wrapper text-center py-20 px-6">
        <h3 className="text-2xl font-serif text-blue-900 italic font-bold">Still have questions?</h3>
        <p className="text-slate-500 mb-8">We're here to help you on your spiritual journey.</p>
        <button className="bg-blue-900 text-white px-10 py-4 rounded-full font-bold hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-lg">
          Contact Support
        </button>
      </div>
    </main>
  );
}