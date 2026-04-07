'use client';

import { useEffect, useRef, useState } from 'react';

interface DynamicGradientTitleProps {
    imageSrc: string;
    children: React.ReactNode;
    className?: string;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function extractColors(img: HTMLImageElement): [string, string] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['#4DA3FF', '#22D3EE'];

    canvas.width = 64;
    canvas.height = 64;
    ctx.drawImage(img, 0, 0, 64, 64);

    const data = ctx.getImageData(0, 0, 64, 64).data;

    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let i = 0; i < data.length; i += 16) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
    }

    const rAvg = Math.round(rSum / count);
    const gAvg = Math.round(gSum / count);
    const bAvg = Math.round(bSum / count);

    const [h] = rgbToHsl(rAvg, gAvg, bAvg);

    const c1 = `hsl(${h}, 90%, 65%)`;
    const c2 = `hsl(${(h + 40) % 360}, 90%, 65%)`;

    return [c1, c2];
}

export function DynamicGradientTitle({ imageSrc, children, className = '' }: DynamicGradientTitleProps) {
    const [gradient, setGradient] = useState('linear-gradient(90deg, #4DA3FF, #22D3EE)');
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!imageSrc) return;

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        imgRef.current = img;

        img.onload = () => {
            try {
                const [c1, c2] = extractColors(img);
                setGradient(`linear-gradient(90deg, ${c1}, ${c2})`);
            } catch {
                // Canvas tainted or CORS issue — keep fallback
            }
        };
    }, [imageSrc]);

    return (
        <h1 
            className={`text-3xl sm:text-4xl font-bold ${className}`}
            style={{
                backgroundImage: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(77, 163, 255, 0.2))'
            }}
        >
            {children}
        </h1>
    );
}
