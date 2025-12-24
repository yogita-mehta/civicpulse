import { Link } from "react-router-dom";
import { PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionCard() {
  return (
    <div className="glass-card p-6 neon-border animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <PlusCircle className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Have an issue to report?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Submit a new complaint and we'll handle it promptly.
          </p>
          <Link to="/citizen/submit">
            <Button className="mt-4" size="lg">
              Submit New Complaint
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
