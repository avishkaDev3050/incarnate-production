"use client";
import React, { useEffect, useRef, useState, use } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowLeft, BookOpen, Loader2, Calendar } from "lucide-react"; 
import Link from "next/link";

export default function MemberDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params); 
  const id = unwrappedParams.id;

  const containerRef = useRef(null);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // States for the modules
  const [modules, setModules] = useState<any[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);

  // 1. Fetch Instructor Basic Details
  useEffect(() => {
    const fetchInstructor = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/public/team/single_ins?id=${id}`);
        const result = await response.json();

        if (result.success) {
          setMember(result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  // 2. Fetch Modules by Instructor's Mobile
  useEffect(() => {
    const fetchModules = async () => {
      // Check if member data exists and has a mobile number
      if (member && member.mobile) {
        setModulesLoading(true);
        try {
          // FIXED URL: Added 'mobile=' key before the value
          const res = await fetch(`/api/public/team/single_ins/module?mobile=${member.mobile}`);
          const result = await res.json();
          
          if (result.success) {
            setModules(result.data);
          }
        } catch (err) {
          console.error("Error fetching modules:", err);
        } finally {
          setModulesLoading(false);
        }
      }
    };

    fetchModules();
  }, [member]); // Runs whenever 'member' state is updated

  // 3. GSAP Animations
  useEffect(() => {
    if (!loading && member) {
      let ctx = gsap.context(() => {
        gsap.from(".anim-up", {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, member]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-900" size={40} />
      </div>
    );

  if (!member)
    return <div className="text-center pt-40">Instructor not found!</div>;

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-white pt-32 pb-20 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="anim-up">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-blue-900 font-bold mb-10 hover:text-yellow-600 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Team
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left: Profile Image */}
          <div className="md:col-span-5 anim-up">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50">
              <Image
                src={member.image_url || "/placeholder.png"}
                alt={member.full_name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:col-span-7 space-y-10">
            <div className="anim-up">
              <h1 className="text-5xl font-serif text-blue-900 italic font-bold mb-2">
                {member.full_name}
              </h1>
              <p className="text-xl text-yellow-600 font-medium tracking-wide">
                {member.speciality}
              </p>
            </div>

            <div className="anim-up">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Biography
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg italic bg-slate-50 p-6 rounded-2xl border-l-4 border-yellow-400">
                "{member.bio || "Experience shared through practice and dedication."}"
              </p>
            </div>

            {/* Modules Section */}
            <div className="anim-up space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <BookOpen className="text-yellow-600" /> Available Modules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modulesLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 italic">
                    <Loader2 size={16} className="animate-spin" /> Verifying modules...
                  </div>
                ) : modules.length > 0 ? (
                  modules.map((mod) => (
                    <div 
                      key={mod.id} 
                      className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 group hover:bg-blue-900 hover:text-white transition-all duration-300"
                    >
                      <p className="font-bold text-lg mb-1">{mod.module}</p>
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-60">
                        <Calendar size={12} />
                        Active since: {new Date(mod.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    No modules assigned to this instructor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}