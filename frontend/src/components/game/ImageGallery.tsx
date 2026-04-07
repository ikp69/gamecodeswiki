'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    gameName: string;
}

export function ImageGallery({ images, gameName }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedIndex]);

    if (!images || images.length === 0) return null;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex(prev => prev !== null ? (prev + 1) % images.length : null);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
    };

    return (
        <>
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">📸 Screenshots & Sneak Peeks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.slice(0, 6).map((img, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedIndex(i)} 
                            className="relative aspect-video rounded-xl overflow-hidden bg-black/20 border border-white/10 group cursor-zoom-in w-full h-full block focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <Image 
                                src={img} 
                                alt={`${gameName} screenshot ${i + 1}`} 
                                fill 
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                        </button>
                    ))}
                </div>
            </div>

            {selectedIndex !== null && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" 
                    onClick={() => setSelectedIndex(null)}
                >
                    <button 
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 sm:p-3 rounded-full transition-colors text-white z-50" 
                        onClick={() => setSelectedIndex(null)}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button 
                                className="absolute left-2 sm:left-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-50" 
                                onClick={handlePrev}
                            >
                                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>

                            <button 
                                className="absolute right-2 sm:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-50" 
                                onClick={handleNext}
                            >
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        </>
                    )}

                    <div className="relative w-full h-full p-8 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
                            <Image 
                                src={images[selectedIndex]} 
                                alt={`${gameName} full screenshot ${selectedIndex + 1}`} 
                                fill 
                                sizes="100vw"
                                className="object-contain" 
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
