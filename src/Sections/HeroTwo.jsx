"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
    {
        id: 1,
        image: "/banner-1.png",
        alt: "WedHub Banner 1",
    },
    {
        id: 2,
        image: "/banner-2.png",
        alt: "WedHub Banner 2",
    },
    {
        id: 3,
        image: "/banner-3.png",
        alt: "WedHub Banner 3",
    }
];

export default function HeroEmporium() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance the slider every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        // Responsive container that naturally fits the image's aspect ratio WITHOUT CLS (no spacer image needed)
        // mt-[56px] (mobile) and sm:mt-[80px] ensures it starts exactly below the floating header
        <header
            className="relative w-full bg-[#faf9f6] mt-[55px] sm:mt-[80px] dark:bg-[#130f0d] transition-colors duration-500 overflow-hidden group"
            style={{ aspectRatio: "1717 / 916" }}
        >

            {/* Top Gradient Blend - matches site background fading into the image (Dark Mode Only) */}
            <div className="hidden dark:block absolute top-0 left-0 right-0 h-16 sm:h-24 md:h-32 bg-gradient-to-b dark:from-[#130f0d] to-transparent z-20 pointer-events-none" />

            {/* Bottom Gradient Blend - matches site background fading up into the image (Dark Mode Only) */}
            <div className="hidden dark:block absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-32 bg-gradient-to-t dark:from-[#130f0d] to-transparent z-20 pointer-events-none" />

            {/* 1. Background Image Layers */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    {/* Optional subtle overlay if you want the dots to be more visible, but removed the heavy black/60 since there's no text now */}
                    <div className="absolute inset-0 bg-black/5" />
                </div>
            ))}

            {/* 3. Vertical Navigation Indicators */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col justify-center items-end gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className="group relative flex items-center justify-end w-16 h-8"
                    >
                        {/* Slide Number (Pops out to the left on active) */}
                        <span
                            className={`absolute right-4 text-[10px] md:text-xs font-bold tracking-widest transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${index === currentSlide
                                ? "text-white opacity-100 translate-x-0"
                                : "text-white/50 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-2"
                                }`}
                        >
                            0{index + 1}
                        </span>

                        {/* Vertical indicator line/dot */}
                        <div
                            className={`w-1 rounded-full bg-white transition-all duration-500 shadow-md ${index === currentSlide
                                ? "h-8 opacity-100"
                                : "h-1.5 opacity-30 group-hover:opacity-70 group-hover:h-3"
                                }`}
                        />
                    </button>
                ))}
            </div>

        </header>
    );
}