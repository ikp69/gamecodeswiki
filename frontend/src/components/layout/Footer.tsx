import Link from 'next/link';

export function Footer() {
    return (
        <footer className="glass mt-12 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold gradient-heading mb-4">
                            Gamecodeswiki.com
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            The ultimate destination for Roblox game codes. Updated daily to ensure you never miss a reward.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary">Home</Link></li>
                            <li><Link href="/latest" className="hover:text-primary">New Codes</Link></li>
                            <li><Link href="/popular" className="hover:text-primary">Popular Games</Link></li>
                            <li><Link href="/bookmarks" className="hover:text-primary">Bookmarks</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><span className="text-muted-foreground/50">Privacy Policy</span></li>
                            <li><span className="text-muted-foreground/50">Terms of Service</span></li>
                            <li><span className="text-muted-foreground/50">Contact Us</span></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Gamecodeswiki.com Not affiliated with Roblox Corporation.
                </div>
            </div>
        </footer>
    );
}
