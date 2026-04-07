'use client';

import Link from 'next/link';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                    <Gamepad2 className="w-8 h-8" />
                    <span className="gradient-heading">
                        Gamecodeswiki.com
                    </span>
                </Link>

                {/* Desktop Search */}
                <SearchInput />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/latest" className="hover:text-primary transition-colors">Latest</Link>
                    <Link href="/popular" className="hover:text-primary transition-colors">Popular</Link>
                    <Link href="/bookmarks" className="hover:text-primary transition-colors">Bookmarks</Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-background">
                    <div className="container px-4 py-4 flex flex-col gap-4">
                        <div className="relative">
                            <SearchInput mobile />
                        </div>
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary">Home</Link>
                        <Link href="/latest" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary">Latest</Link>
                        <Link href="/popular" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary">Popular</Link>
                        <Link href="/bookmarks" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary">Bookmarks</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
