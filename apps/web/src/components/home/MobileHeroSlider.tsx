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
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1769034520/11_nfsl7a.webp",
        link: "/category/fashion"
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1769035079/16_d6uwpc.png",
        link: "/category/beauty"
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1769035560/24_ekz2pq.png",
        link: "/category/electronics"
    },
    {
        id: 4,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1769034708/13_gmauwl.webp",
        link: "/category/fashion"
    },
    {
        id: 5,
        image: "https://res.cloudinary.com/deljcbcvu/image/upload/v1769036726/28_meixbf.webp",
        link: "/category/furniture"
    }
];

export default function MobileHeroSlider() {
    return (
        <div
            className="relative w-full aspect-2/1 md:aspect-[2.4/1] bg-gray-100 overflow-hidden rounded-2xl"
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
                    renderBullet: (index: number, className: string) => {
                        return `<span class="${className}" style="width: 24px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.5); opacity: 1;"></span>`;
                    },
                }}
                loop={true}
                className="h-full w-full mobile-hero-slider"
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
