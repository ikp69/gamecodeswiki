import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Skeleton */}
            <div className="relative rounded-2xl overflow-hidden glass-strong bg-black/20 mb-8">
                <div className="relative pt-6 px-6 pb-6 mt-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 min-w-0 w-full space-y-4 pt-2">
                            <Skeleton className="h-10 w-72" />
                            <div className="flex gap-4">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <Skeleton className="h-8 w-32 border-green-500/20 bg-green-500/10" />
                                <Skeleton className="h-8 w-32 border-red-500/20 bg-red-500/10" />
                            </div>
                            <Skeleton className="h-4 w-full max-w-xl mt-4" />
                            <Skeleton className="h-4 w-3/4 max-w-md" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-64" />
                        <div className="rounded-xl glass opacity-70 overflow-hidden">
                            <div className="bg-white/5 p-4 flex gap-4 border-b border-white/5">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="p-4 flex items-center gap-4 border-b border-white/5 last:border-0">
                                    <Skeleton className="h-5 w-28 bg-primary/20 border-primary/20" />
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-8 w-20 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl glass p-6 space-y-6 opacity-70">
                        <Skeleton className="h-7 w-48" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-8 h-8 rounded-full border-primary/20 bg-primary/10 flex-shrink-0" />
                                <div className="space-y-2 flex-1 pt-1">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-full max-w-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/30 p-6 space-y-4">
                        <Skeleton className="h-6 w-36 mx-auto bg-[#5865F2]/40 border-0" />
                        <Skeleton className="h-4 w-48 mx-auto bg-white/10 border-0" />
                        <Skeleton className="h-10 w-full bg-white/20 border-0" />
                    </div>
                    <div className="rounded-xl glass p-6 space-y-4 opacity-70">
                        <Skeleton className="h-5 w-44" />
                        <div className="space-y-3 pt-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-3 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
