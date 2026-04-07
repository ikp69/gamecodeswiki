'use client';

import { useState, useEffect } from 'react';

export function useUsedCodes() {
    const [usedCodes, setUsedCodes] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('roblox-codes-used');
        if (stored) {
            try {
                setUsedCodes(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse used codes', e);
            }
        }
    }, []);

    const markAsUsed = (code: string) => {
        if (!usedCodes.includes(code)) {
            const newUsed = [...usedCodes, code];
            setUsedCodes(newUsed);
            localStorage.setItem('roblox-codes-used', JSON.stringify(newUsed));
        }
    };

    const isUsed = (code: string) => usedCodes.includes(code);

    return { usedCodes, markAsUsed, isUsed };
}
