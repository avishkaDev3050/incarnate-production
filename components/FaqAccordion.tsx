"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqs: FaqItem[] = [
    {
      question: "Do I need prior dance experience?",
      answer: "Not at all! Our instructor training covers everything from the basics of movement to advanced sequencing. We welcome everyone with a passion for worship."
    },
    {
      question: "Is the certification recognized globally?",
      answer: "Yes, our Psalms & Stretches certification is recognized internationally, allowing you to lead sessions in various community and church settings worldwide."
    },
    {
      question: "How long does the training take?",
      answer: "The standard online training is conducted over two full days, followed by a period of practical assignments and a final assessment."
    }
  ];

  const toggleAccordion = (index: number) => {
    const isOpening = activeIndex !== index;
    setActiveIndex(isOpening ? index : null);
  };

  useEffect(() => {
    contentRefs.current.forEach((el, idx) => {
      if (el) {
        if (activeIndex === idx) {
          gsap.to(el, {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            marginTop: 16
          });
        } else {
          gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            marginTop: 0
          });
        }
      }
    });
  }, [activeIndex]);

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-blue-900 italic font-bold">Common Questions</h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-3xl transition-colors duration-300 overflow-hidden ${
                activeIndex === index ? "border-blue-900 bg-blue-50/30" : "border-slate-100 bg-white"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
              >
                <span className={`text-xl font-bold transition-colors ${
                  activeIndex === index ? "text-blue-900" : "text-slate-700"
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-transform duration-300 ${
                  activeIndex === index ? "bg-blue-900 text-white rotate-0" : "bg-yellow-400 text-blue-900"
                }`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="px-6 md:px-8 overflow-hidden h-0 opacity-0"
              >
                <p className="text-slate-600 text-lg leading-relaxed pb-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}