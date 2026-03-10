"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BannerProps {
  image: string;
  title: string;
}

export default function AboutHero({ image, title }: BannerProps) {
  const titleRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Banner zoom animation
    tl.fromTo(bannerRef.current,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    // Text reveal animation
    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" },
      "-=0.8"
    );
  }, []);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Banner */}
      <div
        ref={bannerRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          // මෙන්න මෙතන තමයි fix එක තියෙන්නේ:
          backgroundImage: `url('${image}')`, 
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-serif font-bold text-white italic drop-shadow-2xl"
        >
          {title}
        </h1>
        {/* Decoration Line */}
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6 rounded-full" />
      </div>
    </section>
  );
}