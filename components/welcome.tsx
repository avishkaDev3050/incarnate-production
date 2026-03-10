"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export default function WelcomeSection() {
  // Static Data
  const data = {
    title1: "Welcome To",
    title2: "Incarnate",
    btn_text: "Discover More",
    btn_url: "/about",
    experience_text: "Embodying Spirituality",
    image_url: "/uploads/1773071973067-welcome.png",
    paragraphs: [
      {
        id: 1,
        content:
          "Incarnate is a unique series of classes that seeks to embody spirituality. We often experience spirituality in an ethereal dynamic. Incarnate seeks to infuse one’s physicality with values emanating from wholesome interaction rooted in positive values, to produce a holistic foundation, which can aid us in everyday life.",
      },
      {
        id: 2,
        content:
          "Classes includes a new sensing exercise that introduces ‘you to you’ and ‘you to the values’ being explored. Values are drawn from the Christian scriptures relating to the ‘Fruit of the Holy Spirit’. These values will nourish souls, inhabit emotions and infuse our bodies.",
      },
    ],
  };

  const expMain = "Embodying";
  const expSub = "Spirituality";

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side: Content (දැන් විස්තරය වම් පැත්තේ) */}
        <div className="w-full md:w-1/2 space-y-8 order-2 md:order-1">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-blue-600" />
              <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">
                Our Journey
              </h4>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif text-blue-950 leading-[1.1]">
              {data.title1} <br />
              <span className="text-yellow-600 italic font-light">
                {data.title2}
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
            {data.paragraphs.map((para) => (
              <p key={para.id}>{para.content}</p>
            ))}
          </div>

          <div className="pt-4">
            <a href={data.btn_url} className="inline-block group">
              <button className="flex items-center gap-4 bg-blue-900 hover:bg-yellow-500 text-white hover:text-blue-950 px-12 py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-blue-900/10 hover:shadow-yellow-500/20 active:scale-95">
                {data.btn_text}
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform duration-300"
                  size={22}
                />
              </button>
            </a>
          </div>
        </div>

        {/* Right Side: Image (දැන් පින්තූරය දකුණු පැත්තේ) */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[550px] order-1 md:order-2">
          {/* Background Decorative Element */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10" />

          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
            <img
              src={data.image_url}
              alt="Welcome to Incarnate"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/800x1000?text=Welcome+Image";
              }}
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
          </div>

          {/* Experience Floating Card (වම් පැත්තට වෙන්න තැබුවා) */}
          <div className="absolute -bottom-8 -left-4 lg:-left-8 bg-blue-900 text-white p-8 rounded-3xl shadow-2xl border-b-4 border-yellow-500">
            <p className="text-2xl font-bold tracking-tight leading-tight">
              {expMain}
            </p>
            <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold mt-1">
              {expSub}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}