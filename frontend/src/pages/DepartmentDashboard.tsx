import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, LogOut, AlertCircle, MapPin, Clock, 
  CheckCircle2, Loader2, User, FileText, Eye
} from "lucide-react";
import { getDepartmentComplaints,resolveComplaint } from "@/api/dasboardApi";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DepartmentDashboard() {
  const [resolving, setResolving] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const BACKEND_URL = "http://localhost:8080"; // replace with your backend URL
  useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getDepartmentComplaints(token);
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
      toast.error("Failed to load complaints");
    }
  };

  fetchComplaints();
}, []);
function getImageUrl(path: string) {
  if (!path) return "";
  const filename = path.split(/[/\\]/).pop(); // get only the filename
  return `${BACKEND_URL}/uploads/${filename}`;
}
// Compute counts dynamically
const statusCounts = complaints.reduce(
  (acc, c) => {
    if (c.status === "ASSIGNED") acc.assigned += 1;
    else if (c.status === "IN_PROGRESS") acc.inProgress += 1;
    else if (c.status === "RESOLVED") acc.resolved += 1;
    return acc;
  },
  { assigned: 0, inProgress: 0, resolved: 0 }
);


  // Filter assigned and in-progress complaints
  const activeComplaints = complaints.filter(
  (c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS"
);

  const handleResolve = async (complaintId: string) => {
  setResolving(complaintId);

  try {
    await resolveComplaint(Number(complaintId), resolutionNote);

    toast.success("Complaint resolved!", {
      description: `Complaint ${complaintId} has been marked as resolved.`,
    });

    // Update the local state so UI refreshes
    setComplaints(prev =>
      prev.map(c =>
        c.id === complaintId ? { ...c, status: "RESOLVED" } : c
      )
    );

    setDialogOpen(null);
    setResolutionNote("");
  } catch (err) {
    console.error(err);
    toast.error("Failed to resolve complaint");
  } finally {
    setResolving(null);
  }
};


  return (
    <div className="min-h-screen gradient-bg">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-success" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CivicPulse</h1>
              <p className="text-xs text-muted-foreground">Department Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-success/30 to-primary/30 border border-success/30 flex items-center justify-center">
              <span className="text-xs font-semibold text-success">WD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Water Works Dept</p>
              <p className="text-xs text-muted-foreground">dept@civic.gov</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Assigned Complaints</h1>
          <p className="text-muted-foreground">View and resolve complaints assigned to your department</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Assigned</p>
                <p className="text-3xl font-bold text-accent">{statusCounts.assigned}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
          <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">In Progress</p>
                <p className="text-3xl font-bold text-primary">{statusCounts.inProgress}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolved Today</p>
                <p className="text-3xl font-bold text-success">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {activeComplaints.map((complaint, index) => (
            <div
              key={complaint.id}
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Complaint Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-primary">{complaint.id}</span>
                        <Badge variant={complaint.priority}>{complaint.priority}</Badge>
                        <Badge variant={complaint.status} className="capitalize">
                          {complaint.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{complaint.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{complaint.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-foreground">{complaint.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-foreground">{format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned Officer</p>
                        <p className="text-foreground">{complaint.officer || "Not assigned"}</p>
                      </div>
                    </div>
                  </div>

                  {complaint.images && complaint.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Attached Images</p>
                      <div className="flex gap-2">
                        {complaint.images.map((img, idx) => (
  <img 
  key={idx} 
  src={getImageUrl(img)} 
  alt={`Attachment ${idx + 1}`} 
  className="w-28 h-28 rounded-lg object-cover border border-border cursor-pointer"
  onClick={() => setSelectedImage(getImageUrl(img))}
/>

))}

                      </div>
                    </div>
                  )}
                </div>
{selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img src={selectedImage} alt="Full Size" className="max-w-[90%] max-h-[90%] rounded-lg" />
  </div>
)}
                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 lg:w-[180px]">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 lg:w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Complaint Details - {complaint.id}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{complaint.title}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={complaint.priority}>{complaint.priority}</Badge>
                            <Badge variant={complaint.status}>{complaint.status}</Badge>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Description</p>
                          <p className="text-foreground">{complaint.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Location</p>
                            <p className="text-foreground text-sm">{complaint.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Submitted On</p>
                            <p className="text-foreground text-sm">{format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Department</p>
                            <p className="text-foreground text-sm">{complaint.department || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Assigned Officer</p>
                            <p className="text-foreground text-sm">{complaint.officer || "-"}</p>
                          </div>
                        </div>
                        {complaint.images && complaint.images.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Attached Images</p>
                            <div className="flex gap-2">
                              {complaint.images.map((img, idx) => (
                                <img key={idx} src={img} alt={`Attachment ${idx + 1}`} className="w-28 h-28 rounded-lg object-cover border border-border" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={dialogOpen === complaint.id} onOpenChange={(open) => setDialogOpen(open ? complaint.id : null)}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 lg:w-full">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Resolve Complaint</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          You are about to mark complaint <span className="font-mono text-primary">{complaint.id}</span> as resolved. 
                          The citizen will be notified and can submit feedback.
                        </p>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Resolution Note (Optional)
                          </label>
                          <Textarea
                            placeholder="Add a note about how the issue was resolved..."
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(null)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleResolve(complaint.id)}
                          disabled={resolving === complaint.id}
                        >
                          {resolving === complaint.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Resolving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Confirm Resolution
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}

          {activeComplaints.length === 0 && (
            <div className="glass-card p-12 text-center animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">All tasks completed!</h3>
              <p className="text-muted-foreground">No active complaints assigned to your department</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
