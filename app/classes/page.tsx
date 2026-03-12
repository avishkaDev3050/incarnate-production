"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import ClassesHero from "@/components/PageHero";
import ClassCard from "@/components/ClassCard";
import ClassDetailsModal from "@/components/ClassDetailsModal";
import { Loader2, Search, Filter } from "lucide-react";

interface YogaClass {
  id: string | number;
  title: string;
  teacher_name: string;
  event_date: string;
  event_time: string;
  address: string;
  city: string;
  image?: string;
}

export default function ClassesPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedTitle, setSelectedTitle] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/public/classes");
        const json = await res.json();
        
        if (json.success) {
          setClasses(json.data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    gsap.to(mainRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" });
  }, []);

  // Extract unique cities and titles from the loaded classes for the dropdowns
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(classes.map((c) => c.city))).sort();
  }, [classes]);

  const uniqueTitles = useMemo(() => {
    return Array.from(new Set(classes.map((c) => c.title))).sort();
  }, [classes]);

  // Derived state: Filter the list based on selection
  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const cityMatch = selectedCity === "all" || item.city === selectedCity;
      const titleMatch = selectedTitle === "all" || item.title === selectedTitle;
      return cityMatch && titleMatch;
    });
  }, [classes, selectedCity, selectedTitle]);

  // Staggered Grid Animation (triggered whenever filtered list changes)
  useEffect(() => {
    if (!isLoading && filteredClasses.length > 0) {
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: "back.out(1.7)",
            delay: 0.1 
          }
        );
      }
    }
  }, [isLoading, filteredClasses]);

  return (
    <main ref={mainRef} className="min-h-screen bg-slate-50 opacity-0 transition-opacity">
      <ClassesHero image="/banner.png" title="Our Classes" />

      <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">
        
        {/* Header and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-blue-900 font-serif text-4xl italic font-bold">Upcoming Sessions</h2>
            <p className="text-slate-500 mt-2">Find the perfect flow for your journey.</p>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mr-2">
              <Filter size={18} />
              <span>Filter By:</span>
            </div>

            {/* City Dropdown */}
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-900 transition-all cursor-pointer"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Title Dropdown */}
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-900 transition-all cursor-pointer"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            >
              <option value="all">All Class Types</option>
              {uniqueTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-900 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Loading your classes...</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item) => (
                <div key={item.id} className="h-full">
                  <ClassCard 
                    data={item} 
                    onViewDetails={(val) => setSelectedClass(val)} 
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <Search className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 italic">No classes match your selected filters.</p>
                <button 
                  onClick={() => { setSelectedCity("all"); setSelectedTitle("all"); }}
                  className="mt-4 text-blue-900 font-bold underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedClass && (
        <ClassDetailsModal 
          classData={selectedClass} 
          onClose={() => setSelectedClass(null)} 
        />
      )}
    </main>
  );
}