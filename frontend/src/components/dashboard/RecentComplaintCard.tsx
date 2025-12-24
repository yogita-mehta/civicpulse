import { MapPin, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Complaint } from "@/data/mockComplaints";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface RecentComplaintCardProps {
  complaint: Complaint;
}

export function RecentComplaintCard({ complaint }: RecentComplaintCardProps) {
  return (
    <Link to={`/citizen/track?id=${complaint.id}`}>
      <div className="glass-card-hover p-4 flex items-start gap-4 group cursor-pointer animate-fade-in">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{complaint.id}</span>
            <Badge variant={complaint.priority}>{complaint.priority}</Badge>
          </div>
          
          <h4 className="font-medium text-foreground truncate">{complaint.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{complaint.description}</p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {complaint.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge variant={complaint.status}>{complaint.status.replace("-", " ")}</Badge>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
