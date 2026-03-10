"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setLoading(false), // Animation එක ඉවර වුණාම component එක ඉවත් කරන්න
    });

    // 1. Initial State: සැඟවීම
    gsap.set([logoRef.current, textRef.current], { opacity: 0, y: 20 });

    // 2. Animation sequence
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.5,
    })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.4")
      // Logo එක පණ ගැන්වීමට පොඩි pulse එකක්
      .to(logoRef.current, {
        scale: 1.05,
        duration: 0.8,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      })
      // 3. Curtain Lift Effect: මුළු screen එකම උඩට යාම
      .to(containerRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.5,
      });

    return () => {
      tl.kill();
    };
  }, []);

  // Loading False වුණත් animation එක ඉවර වෙනකම් DOM එකේ තියෙන්න ඕනේ
  // ඒත් මේ component එක return null කරන්නේ tl.onComplete එකෙන් පස්සේ

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      <div className="relative flex flex-col items-center">
        
        {/* Logo Container */}
        <div ref={logoRef} className="relative w-48 h-48 mb-6">
          <Image
            src="/logo2.png"
            alt="Psalms and Stretches Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text with Letter Spacing */}
        <div ref={textRef} className="overflow-hidden">
           <p className="text-blue-900 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs italic">
            Nourishing Body & Soul
          </p>
          {/* Progress bar line (Optional) */}
          <div className="w-full h-[2px] bg-slate-100 mt-4 overflow-hidden">
             <div className="bg-yellow-400 h-full w-full origin-left animate-progress-line"></div>
          </div>
        </div>
      </div>

      {/* Tailwind config එකට මේක දාන්න (Optional) නැත්නම් inline style එකක් */}
      <style jsx>{`
        @keyframes progress-line {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress-line {
          animation: progress-line 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}