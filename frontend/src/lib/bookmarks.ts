'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roblox-codes-bookmarks';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    const loadBookmarks = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setBookmarks(parsed);
                }
            } catch (e) {
                console.error('Failed to parse bookmarks', e);
            }
        } else {
            setBookmarks([]);
        }
    };

    useEffect(() => {
        // Initial load
        loadBookmarks();

        // Listen for changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                loadBookmarks();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleBookmark = (gameId: string) => {
        // Always get absolute latest data from storage before modifying to avoid race conditions
        const currentStored = localStorage.getItem(STORAGE_KEY);
        let currentBookmarks: string[] = [];
        
        try {
            if (currentStored) {
                currentBookmarks = JSON.parse(currentStored);
                if (!Array.isArray(currentBookmarks)) currentBookmarks = [];
            }
        } catch {
            currentBookmarks = [];
        }

        let newBookmarks;
        if (currentBookmarks.includes(gameId)) {
            newBookmarks = currentBookmarks.filter(id => id !== gameId);
        } else {
            newBookmarks = [...currentBookmarks, gameId];
        }

        // Update local state and storage
        setBookmarks(newBookmarks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
        
        // Manually dispatch storage event for the current tab (storage event normally only fires for OTHER tabs)
        window.dispatchEvent(new Event('storage'));
    };

    const isBookmarked = (gameId: string) => bookmarks.includes(gameId);

    return { bookmarks, toggleBookmark, isBookmarked };
}
