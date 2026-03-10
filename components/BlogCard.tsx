"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

interface BlogProps {
    id: string | number; // id එක අනිවාර්යයෙන්ම ගන්න ඕනේ
    image: string;
    title: string;
    initialLikes: number;
}

export default function BlogCard({ id, image, title, initialLikes }: BlogProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
            {/* Blog Image */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Heart Overlay */}
                <button
                    onClick={handleLike}
                    className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                >
                    <Heart
                        size={20}
                        className={`transition-colors duration-300 ${isLiked ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                    />
                </button>
            </div>

            {/* Blog Content */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Article</span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        {likes} Likes
                    </span>
                </div>

                <h3 className="text-2xl font-serif text-blue-900 italic font-bold leading-tight mb-6 group-hover:text-yellow-600 transition-colors">
                    {title}
                </h3>

                {/* Link as the Main Button */}
                <Link
                    href={`/blog/${id}`}
                    className="relative group/btn inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-blue-900 px-6 py-2 text-sm font-bold text-blue-900 transition-all duration-300 hover:text-white"
                >
                    {/* Hover Fill Effect Layer */}
                    <span className="absolute inset-0 z-0 translate-y-full bg-blue-900 transition-transform duration-300 group-hover/btn:translate-y-0" />

                    {/* Button Content */}
                    <span className="relative z-10">Read More</span>

                    <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-blue-900 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:bg-white">
                        <span className="text-lg leading-none">→</span>
                    </span>
                </Link>
            </div>
        </div>
    );
}