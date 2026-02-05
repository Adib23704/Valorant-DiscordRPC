import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "connecting";
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "online" && "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
          status === "offline" && "bg-gray-500",
          status === "connecting" && "animate-pulse bg-yellow-500"
        )}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
