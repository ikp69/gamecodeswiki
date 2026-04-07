import { cn } from "@/lib/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]", className)}
      {...props}
    />
  );
}

export { Skeleton };
