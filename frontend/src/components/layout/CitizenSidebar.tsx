import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, FileText, Search, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/citizen" },
  { icon: PlusCircle, label: "Submit Complaint", path: "/citizen/submit" },
  { icon: FileText, label: "My Complaints", path: "/citizen/complaints" },
  { icon: Search, label: "Track Issue", path: "/citizen/track" },
];



export function CitizenSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token"); 
  navigate("/", { replace: true }); // ✅ redirect to landing page
};


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-primary animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground neon-text">CivicPulse</h1>
            <p className="text-xs text-muted-foreground">Smart City Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
          Main Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary ml-[-1px]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">CU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Citizen User</p>
            <p className="text-xs text-muted-foreground truncate">citizen@civic.gov</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
