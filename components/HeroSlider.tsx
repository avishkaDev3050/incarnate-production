"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SLIDE_DATA = [
  {
    id: 1,
    main_title: "Incarnate Life",
    sub_title: '"Infusing body mind and soul spiritually"',
    image_url: "/uploads/slide1.jpeg",
  },
  {
    id: 2,
    main_title: "Understand who you are",
    sub_title: "Connect yourself to yourself through our unique sensing exercise.",
    image_url: "/uploads/slider2.jpeg",
  },
  {
    id: 3,
    main_title: "Explore spirituality",
    sub_title: "Holistically fusing Body, Mind and Soul, journeying towards wholeness.",
    image_url: "/uploads/slider3.jpeg",
  },
];

const HeroSlider = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect={"fade"}
        fadeEffect={{ crossFade: true }} // <--- මේක අනිවාර්යයෙන්ම ඕන overlap එක නවත්තන්න
        loop={true}
        speed={1000} // transition එක ටිකක් smooth කරන්න
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-full"
      >
        {SLIDE_DATA.map((slide) => (
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
        /* Swiper Arrows visibility fix */
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
        /* Fade effect එකේදී පිටුපස තියෙන slide එක නොපෙනෙන්නට */
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