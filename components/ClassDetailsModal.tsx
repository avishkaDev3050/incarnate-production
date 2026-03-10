"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Calendar, Clock, User, Globe } from "lucide-react";

interface ClassDetailsModalProps {
  classData: {
    title: string;
    teacher_name: string;
    event_date: string;
    event_time: string;
    address: string;
    city: string;
    image?: string;
    image_url?: string;
  };
  onClose: () => void;
}

export default function ClassDetailsModal({ classData, onClose }: ClassDetailsModalProps) {
  if (!classData) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white text-blue-900 rounded-full p-2 shadow-xl transition-transform active:scale-90"
        >
          <X size={24} />
        </button>

        {/* 1. Header Image Section */}
        <div className="relative h-72 w-full">
          <Image 
            src={classData.image || classData.image_url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"} 
            alt={classData.title} 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
          
          {/* City Floating Tag */}
          <div className="absolute bottom-6 left-8 flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
            <Globe size={14} />
            {classData.city}
          </div>
        </div>

        {/* 2. Content Section */}
        <div className="px-8 pb-10 pt-2">
          <h2 className="text-4xl font-serif font-bold text-blue-900 italic mb-2">
            {classData.title}
          </h2>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
              <User size={16} />
            </div>
            <p className="text-slate-600">
              Led by <span className="font-bold text-blue-900">{classData.teacher_name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Date & Time Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-yellow-600 mt-1" size={20} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Date</p>
                  <p className="text-slate-800 font-medium">{classData.event_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-yellow-600 mt-1" size={20} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Time</p>
                  <p className="text-slate-800 font-medium">{classData.event_time}</p>
                </div>
              </div>
            </div>

            {/* Location Column */}
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-900 mt-1" size={20} />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Address</p>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {classData.address}<br />
                  <span className="text-blue-900 font-bold">{classData.city}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}