import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  trend?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
}

export function StatsCard({ title, value, trend, icon: Icon, variant = "default" }: StatsCardProps) {
  const variantStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
  };

  return (
    <div className="glass-card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn("text-xs mt-2", variantStyles[variant])}>{trend}</p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "primary" && "bg-primary/20",
          variant === "success" && "bg-success/20",
          variant === "warning" && "bg-warning/20",
          variant === "default" && "bg-secondary"
        )}>
          <Icon className={cn("w-6 h-6", variantStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
