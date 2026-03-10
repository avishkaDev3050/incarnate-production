"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SlideData {
  id: number;
  main_title: string;
  sub_title: string;
  image_url: string;
}

const HeroSlider = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/admin/slider');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlides(data.data);
        } else {
          // Fallback to default slides if no data
          setSlides([
            {
              id: 1,
              main_title: "Incarnate Life",
              sub_title: '"Infusing body mind and soul spiritually"',
              image_url: "/uploads/slide1.jpeg",
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
        // Fallback slides
        setSlides([
          {
            id: 1,
            main_title: "Incarnate Life",
            sub_title: '"Infusing body mind and soul spiritually"',
            image_url: "/uploads/slide1.jpeg",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] md:h-[80vh] bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-center">
          <div className="h-12 bg-slate-700 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-700 rounded w-96 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        loop={slides.length > 1}
        speed={1000}
        autoplay={slides.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
        pagination={{ clickable: true }}
        navigation={slides.length > 1}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full bg-black">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image_url}
                alt={slide.main_title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/50 z-10" />
            </div>

            {/* Content Area */}
            <div className="relative z-20 h-full flex items-center justify-center px-6">
              <div className="max-w-4xl text-center">
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  {slide.main_title}
                </h2>
                <p className="text-lg md:text-2xl text-slate-100 mb-8 font-light italic drop-shadow-md">
                  {slide.sub_title}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          opacity: 0.7;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #eab308 !important;
          opacity: 1;
        }
        .swiper-slide {
          opacity: 0 !important;
          transition: opacity 1s ease-in-out;
        }
        .swiper-slide-active {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;