"use client";
import Link from "next/link";
import Image from "next/image";

interface MemberProps {
  id:number;
  image: string;
  name: string;
  position: string;
  bio: string;
}

export default function MemberCard({
  id,
  image,
  name,
  position,
  bio,
}: MemberProps) {
  return (
    <div className="team-card group flex flex-col items-center text-center p-4">
      {/* Image Circle with Hover Effect */}
      <div className="relative w-64 h-64 mb-6 overflow-hidden rounded-lg shadow-md border-4 border-white group-hover:shadow-xl transition-shadow duration-300">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
        />
      </div>

      {/* Text Content */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-serif text-blue-900 italic font-semibold">
          {name}
        </h3>
        <p className="text-yellow-600 text-sm font-medium tracking-wide">
          {position}
        </p>

        {/* Custom Styled Read More Link */}
        <Link href={`/team/${id}`}>
          <button className="inline-block text-[#a3e635] font-semibold text-sm border-b-2 border-transparent hover:border-[#a3e635] transition-all duration-300 pb-1">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}
