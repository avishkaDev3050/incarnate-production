"use client";
import React, { useEffect, useState } from 'react';

const WellbeingHero = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/admin/wellbeing");
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-3xl text-center">
        {/* Title */}
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          {data?.title || "Wellbeing Journey"}
        </h1>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-lg leading-relaxed text-gray-600 md:text-xl">
          <p>
            {data?.paragraph1}
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="mt-10 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-indigo-500"></div>
        </div>
      </div>
    </section>
  );
};

export default WellbeingHero;