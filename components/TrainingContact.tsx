"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, User, Mail, MapPin, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function TrainingContact() {
  const formRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".form-anim", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        }
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={formRef} className="py-24 bg-slate-50 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Side: Info Blue Box */}
          <div className="md:col-span-4 bg-blue-900 p-10 text-white flex flex-col justify-center">
            <h3 className="text-3xl font-serif italic font-bold mb-6">I'm interested!</h3>
            <p className="text-blue-100 mb-8 text-sm leading-relaxed">
              Fill out this form and our team will get back to you with the next steps for your certification.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-yellow-400">
                <Send size={18} />
                <span className="text-white text-sm font-semibold">Fast Response</span>
              </div>
              <div className="flex items-center gap-3 text-yellow-400">
                <MapPin size={18} />
                <span className="text-white text-sm font-semibold">Global Support</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form Fields */}
          <div className="md:col-span-8 p-10 md:p-14">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-anim space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <User size={14} className="text-yellow-500" /> Full Name
                  </label>
                  <input type="text" placeholder="Your name" className="w-full border-b-2 border-slate-100 focus:border-yellow-400 outline-none py-2 transition-colors text-slate-700" />
                </div>
                
                <div className="form-anim space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <Mail size={14} className="text-yellow-500" /> Email Address
                  </label>
                  <input type="email" placeholder="email@example.com" className="w-full border-b-2 border-slate-100 focus:border-yellow-400 outline-none py-2 transition-colors text-slate-700" />
                </div>
              </div>

              <div className="form-anim space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <MapPin size={14} className="text-yellow-500" /> Location
                </label>
                <input type="text" placeholder="City, Country" className="w-full border-b-2 border-slate-100 focus:border-yellow-400 outline-none py-2 transition-colors text-slate-700" />
              </div>

              <div className="form-anim space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <MessageSquare size={14} className="text-yellow-500" /> Vision & Experience
                </label>
                <textarea rows={4} placeholder="Tell us why you want to join..." className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl focus:bg-white focus:border-yellow-400 outline-none p-4 transition-all text-slate-700" />
              </div>

              <div className="form-anim pt-4">
                <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-2xl hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group">
                  Send My Interest
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}