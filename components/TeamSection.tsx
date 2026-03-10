"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  // Static Data
  const data = {
    title1: "Hello I am",
    names_highlight: "Andy Au",
    footer_name: "Andy Au - Founder of Incarnate",
    image_url: "/uploads/team/andy.png", 
    paragraphs: [
      {
        id: 1,
        content: "Andy Au is the founder of ‘Incarnate’, it has been his brainchild for eight years, but only recently has gathered a team to help him develop it."
      },
      {
        id: 2,
        content: "Andy started moving in worship in the early 80’s, through an incredible worship experience, given movements he had never done before as he began to give his mind, soul/spirit and body in adoration to God. He then under the guidance of spiritual oversight from John & Christine Noble grew in confidence and was asked to worship in churches and conferences throughout the UK and beyond."
      },
      {
        id: 3,
        content: "Andy founded ‘Movement In Worship’ (MIW) (www.miw.org.uk) in the 80’s Now it is an international family and community, with bases stretching from India, Sri Lanka through Europe, UK and to the USA. MIW, has 30 licensed teachers across UK & Europe."
      }
    ]
  };

  // GSAP Animation
  useEffect(() => {
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
  }, []);

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
                src={data.image_url}
                alt={data.footer_name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
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
              {data.paragraphs.map((para, index) => (
                <p 
                  key={para.id} 
                  className={`${index === 0 ? "text-slate-700 text-xl font-medium" : "text-slate-600 text-lg"} leading-relaxed`}
                >
                  {para.content}
                </p>
              ))}
            </div>

            {/* Link to MIW - Optional addition */}
            <div className="pt-4">
              <a 
                href="https://www.miw.org.uk" 
                target="_blank" 
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