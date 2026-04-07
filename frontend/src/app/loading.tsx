import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-12">
            {/* Featured Games Skeleton */}
            <section>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="aspect-[2/1] rounded-2xl" />
                    <Skeleton className="aspect-[2/1] rounded-2xl" />
                </div>
            </section>

            {/* Game List Skeleton */}
            <section>
                <Skeleton className="h-8 w-36 mb-6" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-strong opacity-50">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
