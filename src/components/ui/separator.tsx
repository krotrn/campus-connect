import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full bg-gray-200", className)}
      role="separator"
    />
  );
}
