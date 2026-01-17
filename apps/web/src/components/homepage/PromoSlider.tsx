"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price?: string;
  link?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=400&fit=crop",
    title: "Mattress",
    subtitle: "Wakefit, Sleepwell & more",
    price: "From ₹2,999",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200&h=400&fit=crop",
    title: "Office Chairs",
    subtitle: "Green Soul, Cell Bell & more",
    price: "From ₹2,999",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=400&fit=crop",
    title: "Akasa Air",
    subtitle: "New year Flight deals",
    price: "Up to 20% Off",
  },
];

export default function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div
      className="relative w-full h-[200px] md:h-[280px] overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex items-center justify-between px-8 md:px-16"
          >
            {/* Left: Image */}
            <div className="w-1/2 h-full flex items-center justify-center">
              <div className="relative w-full h-[160px] md:h-[220px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain rounded-lg"
                  priority={slide.id === 1}
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="w-1/2 text-white pl-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {slide.title}
              </h2>
              <h3 className="text-3xl md:text-5xl font-extrabold mb-3">
                {slide.price}
              </h3>
              <p className="text-base md:text-xl opacity-90">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 text-white/20 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
          <circle cx="30" cy="10" r="3" />
          <circle cx="50" cy="20" r="4" />
          <circle cx="45" cy="45" r="3" />
        </svg>
      </div>
    </div>
  );
}
