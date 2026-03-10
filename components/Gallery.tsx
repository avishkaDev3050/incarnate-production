"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ZoomIn, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  id: number;
  image_url: string;
}

export default function GallerySection() {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery images dynamically
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/admin/gallery');
        const data = await res.json();
        if (data.success) {
          setImages(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (images.length > 0) {
      const cards = gsap.utils.toArray(".gallery-card");
      
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }
  }, [images]);

  if (loading) {
    return (
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-slate-200 rounded w-64 mx-auto mb-16"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 sm:h-64 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 text-center">
          Our Visuals
        </h4>
        <h2 className="text-4xl md:text-5xl font-serif text-blue-900 mb-16 italic text-center">
          Be Inspired
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No gallery images available yet.</p>
          </div>
        ) : (
          <div 
            ref={galleryRef} 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6"
          >
            {images.map((image) => (
              <div 
                key={image.id} 
                className="gallery-card relative w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-slate-100"
                onClick={() => setSelectedImage(image.image_url)}
              >
                <Image
                  src={image.image_url}
                  alt="Gallery Image"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="text-white" size={40} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal for Zoom */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <img
              src={selectedImage}
              alt="Zoomed Image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button 
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-blue-400 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}