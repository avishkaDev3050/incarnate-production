"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Quote } from "lucide-react";

// interface එකක් හදමු data structure එකට අනුව
interface TestimonialData {
  id: number;
  name: string;
  position: string;
  description: string;
  image_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/admin/testimonials");
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  // 2. GSAP Animation (Testimonials load වුණාට පස්සේ විතරක් run වෙන්න ඕනේ)
  useEffect(() => {
    if (testimonials.length === 0) return;

    const cards = gsap.utils.toArray(".testimonial-card");
    
    // කලින් තිබුණ timeline එකමයි, හැබැයි dynamic cards සඳහා
    let tl = gsap.timeline({ repeat: -1 });

    cards.forEach((card: any) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        display: "block",
        ease: "power2.out",
      })
      .to(card, {
        opacity: 0,
        y: -20,
        duration: 1,
        delay: 4, // තත්පර 4ක් පෙන්වයි
        display: "none",
        ease: "power2.in",
      });
    });

    return () => {
      tl.kill(); // Component එක unmount වෙද්දී animation එක නවත්වන්න
    };
  }, [testimonials]); // testimonials update වුණාම animation එක reset වෙනවා

  // දත්ත ලැබෙන තුරු loading එකක් පෙන්වමු
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-blue-900 overflow-hidden text-center px-6">
      <div className="max-w-4xl mx-auto">
        <h4 className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">
          Testimonials
        </h4>
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 italic">
          What People Say
        </h2>

        <div className="relative h-[450px] md:h-[400px] flex items-center justify-center" ref={containerRef}>
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="testimonial-card absolute hidden opacity-0 translate-y-10 w-full"
            >
              <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl border-b-8 border-yellow-500 relative">
                <Quote className="absolute top-8 left-8 text-blue-50/50" size={60} />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 mb-6 shadow-lg">
                    {/* Database එකේ image එකක් නැත්නම් default avatar එකක් පෙන්වන්න */}
                    <img 
                      src={item.image_url || "https://ui-avatars.com/api/?name=" + item.name} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <p className="text-gray-600 text-lg md:text-2xl leading-relaxed italic mb-8">
                    "{item.description}"
                  </p>
                  
                  <h5 className="text-blue-900 font-bold text-lg">{item.name}</h5>
                  <p className="text-yellow-600 font-medium text-sm uppercase tracking-wider">{item.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}