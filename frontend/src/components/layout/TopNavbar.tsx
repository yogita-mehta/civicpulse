import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavbarProps {
  title: string;
  subtitle: string;
}

export function TopNavbar({ title, subtitle }: TopNavbarProps) {
  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Button>
        
        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
