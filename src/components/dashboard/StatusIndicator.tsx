import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "connecting";
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "online" && "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
          status === "offline" && "bg-gray-500",
          status === "connecting" && "animate-pulse bg-yellow-500"
        )}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
