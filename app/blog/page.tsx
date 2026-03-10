"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogHero from "@/components/PageHero";
import BlogCard from "@/components/BlogCard";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
    const mainRef = useRef(null);

    const blogs = [
        { title: "Finding Peace in Daily Movement", image: "/back.png", likes: 12 },
        { title: "The Power of Psalms in Fitness", image: "/emma.png", likes: 45 },
        { title: "Why Breathwork Matters Most", image: "/back.png", likes: 28 },
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".blog-anim", {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".blog-grid",
                    start: "top 80%",
                }
            });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef} className="min-h-screen bg-white pb-20">
            <BlogHero image="/back.png" title="Our Blogs" />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog, index) => (
                        <div key={index} className="blog-anim">
                            <BlogCard 
                                title={blog.title} 
                                image={blog.image} 
                                initialLikes={blog.likes} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}