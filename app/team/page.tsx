"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamHero from "@/components/PageHero";
import MemberCard from "@/components/MemberCards";

gsap.registerPlugin(ScrollTrigger);

// 1. Define an Interface for your Instructor data
interface Instructor {
    id: string;
    full_name: string;
    speciality: string;
    bio: string;
    image_url: string;
}

export default function TeamPage() {
    const mainRef = useRef(null);
    const gridRef = useRef(null);
    
    // 2. State to hold the fetched data
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 3. Fetch data from your API
        const fetchInstructors = async () => {
            try {
                const response = await fetch("/api/public/team/"); 
                const result = await response.json();
                if (result.success) {
                    setInstructors(result.data);
                }
            } catch (error) {
                console.error("Error loading instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    useEffect(() => {
        // 4. Only run animations if we have data and loading is finished
        if (loading || instructors.length === 0) return;

        let ctx = gsap.context(() => {
            gsap.fromTo(
                mainRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: "power2.out" }
            );

            const cards = gsap.utils.toArray(".member-card-anim");
            
            if (cards.length > 0) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 40,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    }
                });
            }
            ScrollTrigger.refresh();
        }, mainRef);

        return () => ctx.revert();
    }, [loading, instructors]); // Depend on loading/instructors to re-trigger GSAP

    return (
        <main ref={mainRef} className="min-h-screen bg-white pb-20 overflow-x-hidden">
            <TeamHero image="/back.png" title="Our Team" />

            <div className="max-w-7xl mx-auto py-20 px-6 md:px-12">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-serif text-blue-900 italic mb-4">Instructor Network</h2>
                    <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full" />
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading our experts...</div>
                ) : (
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {instructors.map((member) => (
                            <div key={member.id} className="member-card-anim">
                                <MemberCard
                                    image={member.image_url || "/emma.png"} 
                                    name={member.full_name}
                                    position={member.speciality}
                                    bio={member.bio}
                                    id={member.id}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}