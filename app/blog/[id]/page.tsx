"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowLeft, Calendar, User, Heart } from "lucide-react";
import Link from "next/link";

export default function BlogDetails({ params }: { params: { id: string } }) {
  const containerRef = useRef(null);
  const [likes, setLikes] = useState(120); // Dummy like count
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".anim-up", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        clearProps: "all"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const blog = {
    title: "Finding Peace in Daily Movement",
    author: "Ruth Carpenter",
    date: "Oct 24, 2025",
    image: "/back.png",
    content: `
      In the hustle and bustle of modern life, finding a moment of stillness can feel impossible. 
      However, spiritual movement offers a bridge between physical health and mental clarity. 
      By incorporating scriptural meditation into our daily stretches, we create a sanctuary within our own bodies.
      
      This practice isn't just about flexibility; it's about alignment—aligning our breath with our spirit, 
      and our movements with our faith.
    `
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <main 
      ref={containerRef} 
      className="min-h-screen bg-white pt-32 pb-20 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <div className="anim-up">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-900 font-bold mb-10 hover:text-yellow-600 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Blogs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left: Blog Image (Member details එකේ වගේමයි) */}
          <div className="md:col-span-5 anim-up">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50">
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill 
                className="object-cover"
                priority 
              />
            </div>
            
            {/* Like Action in Details Page */}
            <div className="mt-8 flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="text-blue-900 font-bold">Enjoyed this read?</span>
                <button 
                    onClick={handleLike}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                    <Heart size={20} className={isLiked ? "fill-yellow-400 text-yellow-400" : "text-slate-400"} />
                    <span className="font-bold text-blue-900">{likes}</span>
                </button>
            </div>
          </div>

          {/* Right: Blog Content */}
          <div className="md:col-span-7 space-y-8">
            <div className="anim-up">
              <div className="flex items-center gap-4 text-sm font-bold text-yellow-600 uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1"><User size={14}/> {blog.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {blog.date}</span>
              </div>
              <h1 className="text-5xl font-serif text-blue-900 italic font-bold leading-tight">
                {blog.title}
              </h1>
            </div>

            <div className="anim-up">
              <div className="w-20 h-1 bg-yellow-400 mb-8 rounded-full" />
              <div className="text-slate-600 leading-relaxed text-lg space-y-6">
                {blog.content.split('\n').map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </div>

            {/* Bottom Quote or Highlight */}
            <div className="anim-up bg-blue-50 p-8 rounded-3xl border-l-8 border-blue-900">
              <p className="text-blue-900 text-xl font-serif italic leading-relaxed">
                "Your body is a temple, and every movement can be a form of worship."
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}