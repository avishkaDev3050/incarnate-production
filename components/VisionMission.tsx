"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Target } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function VisionMission() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".vision-card", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
      gsap.from(".mission-card", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-slate-50 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Vision Card */}
        <div className="vision-card bg-white p-10 rounded-3xl shadow-xl border-t-8 border-blue-900 group hover:shadow-2xl transition-all duration-300">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors duration-500">
            <Eye className="text-blue-900" size={32} />
          </div>
          <h2 className="text-3xl font-serif text-blue-900 mb-4 italic">
            Our Vision
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Our Vision Spirituality is very much part of our humanity, as
            western Christians, we experience our faith in a deeply cerebral
            way, applying rational, logic, deep biblical study to our spiritual
            journey. Our vision is to enhance that journey by engaging the whole
            of who we are on that journey. Our soul, the seat of our emotions
            and our body. To encourage emotional and physical engagement as we
            grow in our faith.
          </p>
        </div>

        {/* Mission Card */}
        <div className="mission-card bg-white p-10 rounded-3xl shadow-xl border-t-8 border-yellow-500 group hover:shadow-2xl transition-all duration-300">
          <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-900 transition-colors duration-500">
            <Target
              className="text-yellow-600 group-hover:text-white"
              size={32}
            />
          </div>
          <h2 className="text-3xl font-serif text-blue-900 mb-4 italic">
            Our Mission
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            The Christian faith has so much going for it. The compassionate
            values that are resourced by the Holy Spirit. Love, joy, peace,
            goodness, kindness, gentleness, self-control, patience and
            faithfulness. These qualities and values are deeply spiritual as
            they are fruit of the Holy Spirit. The mission is to encourage
            people dwell on these amazing values, through meditation and action,
            introducing them to our mind, soul and bodies. F
          </p>
        </div>
      </div>
    </section>
  );
}
