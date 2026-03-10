"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideosHero from "@/components/PageHero";
import VideoSection from "@/components/VideoSection";

gsap.registerPlugin(ScrollTrigger);

export default function VideosPage() {
    const mainRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            mainRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        );
    }, []);

    return (
        <main
            ref={mainRef}
            className="min-h-screen bg-white pt-24 pb-20 px-6 md:px-12"
        >
            <VideosHero
                image="/back.png"
                title="Our Videos"
            />
            <div className="reveal-section">
                <VideoSection />
            </div>
        </main>
    );
}