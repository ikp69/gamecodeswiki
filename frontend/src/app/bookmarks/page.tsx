import { BookmarksList } from '@/components/game/BookmarksList';

export const metadata = {
    title: 'My Bookmarks | Gamecodeswiki',
    description: 'Your saved active Roblox game codes.',
};

export default function BookmarksPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
                <p className="text-muted-foreground">Quick access to your favorite saved games.</p>
            </div>

            <BookmarksList />
        </div>
    );
}
