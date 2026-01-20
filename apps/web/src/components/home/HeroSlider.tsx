"use client";

import Link from "next/link";
import Image from "next/image";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
    {
        id: 1,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768856843/Img1_z8ciub.webp",
        link: "/category/fashion"
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1768856843/Img2_zkcypu.webp",
        link: "/category/groceries"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2669&auto=format&fit=crop",
        link: "/category/electronics"
    }
];

export default function HeroSlider() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-[10px]"
            style={{ aspectRatio: '4/1' }}
        >
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}" style="width: 24px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.5); opacity: 1;"></span>`;
                    },
                }}
                loop={true}
                className="h-full w-full hero-slider-flat"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <Link href={slide.link} className="block relative h-full w-full">
                            <Image
                                src={slide.image}
                                alt={`Slide ${slide.id}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
