"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Users, Move, Sparkles, Send, Loader2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import TrainingExplain from "@/components/TrainingExplain";
import BecomeTrainer from "@/components/BecomeTrainer";
import TrainingIncluded from "@/components/TrainingIncluded";
import Swal from "sweetalert2"; // SweetAlert import කරන ලදී

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-section", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reveal-section",
          start: "top 85%",
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      mobile: formData.get("mobile"),
      email: formData.get("email"),
    };

    try {
      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // සාර්ථක වූ විට පෙන්වන Alert එක
        Swal.fire({
          title: "Success!",
          text: "Your application has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "#1e3a8a", // blue-900 වර්ණය
          timer: 3000
        });
        (e.target as HTMLFormElement).reset();
      } else {
        // Error එකක් ආ විට පෙන්වන Alert එක
        Swal.fire({
          title: "Error!",
          text: result.error || "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Connection Failed",
        text: "Could not connect to the server. Please try again later.",
        icon: "warning",
        confirmButtonColor: "#eab308" // yellow-500 වර්ණය
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white pb-20">
      <PageHero image="/banner.png" title="Teacher Training" />

      {/* මම මැද තියෙන sections ටික code එක කෙටි කරන්න මෙතනින් අයින් කළා, 
          ඔයාගේ code එකේ ඒවා එහෙම්ම තියාගන්න */}
      
      {/* ... (Class Experience, Who Are These For, ආදී අනෙකුත් Components) ... */}

      <div className="reveal-section">
        <TrainingExplain />
      </div>
      <div className="reveal-section">
        <BecomeTrainer />
      </div>
      <div className="reveal-section">
        <TrainingIncluded />
      </div>

      {/* --- සම්බන්ධීකරණ පෝරමය (Contact Form) --- */}
      <section className="reveal-section py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-blue-900 py-10 px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Join the Training</h2>
            <p className="text-blue-100">Fill out the form below and we'll get in touch with you.</p>
          </div>
          
          <form className="p-8 md:p-12 space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  name="fullName"
                  type="text" 
                  required
                  placeholder="Avishka..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                <input 
                  name="mobile"
                  type="tel" 
                  required
                  placeholder="07x xxx xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="example@mail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-300 text-blue-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}