"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Plus, Minus, Loader2 } from "lucide-react";

export default function FaqAccordion() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then(res => res.json())
      .then(json => {
        if (json.success) setFaqs(json.data);
        setIsLoading(false);
      });
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    contentRefs.current.forEach((el, idx) => {
      if (el) {
        gsap.to(el, {
          height: activeIndex === idx ? "auto" : 0,
          opacity: activeIndex === idx ? 1 : 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  }, [activeIndex]);

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-900" /></div>;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq: any, index: number) => (
          <div key={faq.id} className={`border-2 rounded-3xl overflow-hidden transition-all ${activeIndex === index ? "border-blue-900 bg-blue-50/30" : "border-slate-100"}`}>
            <button onClick={() => toggleAccordion(index)} className="w-full flex items-center justify-between p-6 text-left">
              <span className={`text-xl font-bold ${activeIndex === index ? "text-blue-900" : "text-slate-700"}`}>{faq.question}</span>
              <div className={`p-2 rounded-full ${activeIndex === index ? "bg-blue-900 text-white" : "bg-yellow-400 text-blue-900"}`}>
                {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>
            <div ref={(el) => { contentRefs.current[index] = el; }} className="px-6 overflow-hidden h-0 opacity-0">
              <p className="text-slate-600 text-lg pb-6 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}