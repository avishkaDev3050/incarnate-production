"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";

interface ClassData {
  title: string;
  teacher_name: string;
  event_date: string;
  event_time: string;
  address: string;
  city: string;
  image?: string;
  image_url?: string;
}

interface ClassProps {
  data: ClassData;
  onViewDetails: (item: ClassData) => void;
}

export default function ClassCard({ data, onViewDetails }: ClassProps) {
  const [formattedDate, setFormattedDate] = useState<string>("...");

  // Handle date on client-side to prevent Next.js hydration mismatch
  useEffect(() => {
    if (data?.event_date) {
      const date = new Date(data.event_date);
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
    }
  }, [data?.event_date]);

  if (!data) return null;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1">
      {/* 1. Image Area */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={
            data?.image || data?.image_url
              ? `${data.image || data.image_url}?t=${new Date().getTime()}`
              : "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600"
          }
          alt={data?.title || "Class Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* City Badge */}
        <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider">
          {data?.city || "Location"}
        </div>
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* 2. Content Area */}
      <div className="p-8 flex flex-col grow">
        <h3 className="text-2xl font-serif font-bold text-blue-900 italic group-hover:text-blue-700 transition-colors line-clamp-1 mb-4">
          {data?.title}
        </h3>

        <div className="space-y-4 grow">
          {/* Instructor */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-100 transition-colors">
              <User size={18} />
            </div>
            <span className="text-sm font-medium">
              <span className="text-blue-900/60 font-semibold uppercase text-[10px] block tracking-widest">
                Instructor
              </span>
              <span className="text-slate-800">{data?.teacher_name}</span>
            </span>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Calendar size={16} className="text-yellow-600 shrink-0" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Clock size={16} className="text-yellow-600 shrink-0" />
              <span className="font-medium">{data?.event_time}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 text-slate-600 pt-4 border-t border-slate-100">
            <MapPin size={18} className="text-blue-900 mt-1 shrink-0" />
            <span className="text-sm leading-relaxed line-clamp-2 italic">
              {data?.address}
            </span>
          </div>
        </div>

        {/* 3. Button Area */}
        <div className="pt-8 mt-auto">
          <button
            onClick={() => onViewDetails(data)}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-yellow-400 text-white hover:text-blue-900 font-bold py-4 rounded-2xl transition-all duration-300 active:scale-[0.98] group/btn shadow-lg shadow-blue-900/10"
          >
            <span>View Details</span>
            <ArrowRight
              size={20}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
