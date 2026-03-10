"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroSlider from "@/components/HeroSliderDynamic";
import NewsBar from "@/components/News";
import WelcomeSection from "@/components/welcome";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import TeamSection from "@/components/TeamSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".reveal-section");

    sections.forEach((section: any) => {
      // Crazy Animation Timeline
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 150,
          scale: 0.8, // කුඩාවට පටන් ගන්නවා
          rotationX: 15, // මඳක් ඇලවී (Perspective) පටන් ගන්නවා
          clipPath: "inset(20% 10% 20% 10% rounded 50px)", // ඇතුළට නෙරා ගිය හැඩයක්
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          clipPath: "inset(0% 0% 0% 0% rounded 0px)",
          duration: 2,
          ease: "expo.out", // වඩාත් smooth cinematic පහළට ඒමක්
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 30%",
            scrub: 1.5, // 1.5 දුන්නම සිනිඳු "delay" ගතියක් එක්ක scroll වෙනවා
            markers: false, // Debugging කරන්න ඕන නම් true කරන්න
          },
        }
      );
    });

    // Background Color Change Effect (Bonus crazy effect)
    // Scroll කරද්දී මුළු පිටුවේම පසුබිම ලාවට වෙනස් වීම
    gsap.to(mainRef.current, {
      backgroundColor: "#f8fafc", // ලා අළු/නිල් පාටකට මාරු වීම
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-white overflow-x-hidden perspective-1000">
      <HeroSlider />

      {/* Sections එකින් එක reveal-section class එක හරහා animate වේ */}
      <div className="reveal-section will-change-transform">
        <NewsBar />
      </div>

      <div className="reveal-section will-change-transform">
        <WelcomeSection />
      </div>

      <div className="reveal-section will-change-transform">
        <Testimonials />
      </div>

      <div className="reveal-section will-change-transform">
        <Gallery />
      </div>
      
      {/* CSS Styling for Crazy Effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .reveal-section {
          backface-visibility: hidden;
        }
      `}</style>
    </main>
  );
}