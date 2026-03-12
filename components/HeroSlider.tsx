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

// TypeScript interface for Slider Data
interface Slide {
  id: number;
  main_title: string;
  sub_title: string;
  image_url: string;
}

const HeroSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // DB එකෙන් data fetch කිරීම
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch("/api/sliders"); // ඔයාගේ API path එක මෙතනට දාන්න
        const result = await response.json();
        if (result.success) {
          setSlides(result.data);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Loading වෙලාවට පෙනෙන විදිය
  if (loading) {
    return (
      <div className="w-full h-[70vh] md:h-[80vh] bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl font-medium">Loading Experience...</div>
      </div>
    );
  }

  // Data නැත්නම් පේන්නේ නැති වෙන්න
  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        loop={slides.length > 1} // එක slide එකකට වඩා තිබේ නම් පමණක් loop වේ
        speed={1200} // transition එකේ වේගය (ms)
        autoplay={{
          delay: 5000, // තත්පර 5 කින් auto මාරු වේ
          disableOnInteraction: false, // user click කළත් auto-slide එක නතර නොවේ
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        navigation={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image_url}
                alt={slide.main_title}
                fill
                priority
                className="object-cover object-center"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-black/40 z-10" />
            </div>

            {/* Content Area */}
            <div className="relative z-20 h-full flex items-center justify-center px-6">
              <div className="max-w-4xl text-center">
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                  {slide.main_title}
                </h2>
                <p className="text-lg md:text-2xl text-slate-100 mb-8 font-light italic drop-shadow-lg">
                  {slide.sub_title}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for Swiper navigation elements */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          opacity: 1;
        }
        .swiper-pagination-bullet {
          background: white !important;
          width: 12px;
          height: 12px;
          opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          background: #eab308 !important; /* Gold/Yellow color */
          opacity: 1;
          width: 25px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;