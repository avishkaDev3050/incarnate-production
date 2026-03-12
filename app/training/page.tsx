"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Users, Move, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import TrainingExplain from "@/components/TrainingExplain";
import BecomeTrainer from "@/components/BecomeTrainer";
import TrainingIncluded from "@/components/TrainingIncluded";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sections Animation
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

  return (
    <main className="bg-white pb-20">
      <PageHero
        image="/banner.png"
        title="Teacher Training"
      />

      {/* 1. Class Experience Section */}
      <section className="reveal-section py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-blue-900 italic">Class Experience</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
            <p className="text-slate-600 text-lg max-w-3xl mx-auto pt-4 leading-relaxed">
              Each class is thoughtfully designed by our Incarnate Curriculum Group to provide a meaningful and embodied learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <Sparkles className="text-yellow-600" /> Structure & Insight
              </h3>
              <p className="text-slate-600 leading-relaxed">
                In every class, participants will engage with three guided meditations or creative explorations centered around the theme. 
                Each meditation is designed to help you distill the essence into <strong>one or two key words</strong> — grounding the concept in personal insight.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Sensing exercises to deepen awareness",
                  "Creation of a movement shape inspired by meditations",
                  "A supported transition practice linking the three shapes"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-blue-600 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 bg-blue-900 p-8 rounded-3xl text-white shadow-xl shadow-blue-900/20">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Move className="text-yellow-400" /> Over Six Weeks
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Across the full six-week journey, these weekly practices accumulate into a personalized 
                <span className="text-yellow-400 font-bold"> eighteen-point movement set</span>, 
                shaped by your own responses to the meditations and themes.
              </p>
              <div className="p-6 bg-white/10 rounded-2xl border border-white/10 italic text-blue-50">
                "Our intention is to gently and powerfully integrate these deep, wholesome concepts into the mind, body, and soul."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who Are These Classes For Section */}
      <section className="reveal-section py-20 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-200">
            <Users className="text-blue-600" size={20} />
            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Target Audience</span>
          </div>
          
          <h2 className="text-4xl font-serif text-blue-900 italic leading-tight">
            Who Are These <span className="text-red-600">Classes For?</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-600 leading-relaxed">
                Designed for individuals who want their <strong>thinking to positively influence</strong> their emotions and physical experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-600 leading-relaxed">
                For those curious about the <strong>connection between mind and body</strong> — and how thoughts shape the way they move and live.
              </p>
            </div>
          </div>

          <div className="bg-yellow-500 text-blue-950 p-8 rounded-3xl font-bold text-xl md:text-2xl mt-8">
            If you are interested in integrating your inner world with your embodied experience, this work is for you.
          </div>
        </div>
      </section>

      {/* Existing Components (Contact Form එක ඉවත් කර ඇත) */}
      <div className="reveal-section">
        <TrainingExplain />
      </div>

      <div className="reveal-section">
        <BecomeTrainer />
      </div>

      <div className="reveal-section">
        <TrainingIncluded />
      </div>

    </main>
  );
}