import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CitizenLayout } from "@/components/layout/CitizenLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, MapPin, Calendar, User, Building2, CheckCircle2, Clock, Star, Image as ImageIcon , Star as StarFilled} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getComplaintById ,submitFeedback} from "@/api/dasboardApi";
import { Complaint } from "@/types/Complaint";
import {
  statusToBadgeVariant,
  priorityToBadgeVariant,
} from "@/utils/badgeMapping";


export default function TrackIssue() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [rating, setRating] = useState(0);
  const [satisfied, setSatisfied] = useState<string>("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const BACKEND_URL = "http://localhost:8080";

function getImageUrl(path: string) {
  if (!path) return "";
  const filename = path.split(/[/\\]/).pop(); // takes only filename
  return `${BACKEND_URL}/uploads/${filename}`;
}



  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
  if (!searchId) return;

  console.log("Searching complaint ID:", searchId);

  try {
    const data = await getComplaintById(Number(searchId));
    console.log("Complaint found:", data);
    setComplaint(data);
  } catch (err) {
    console.error("Complaint fetch error:", err);
    setComplaint(null);
    toast.error("Complaint not found", {
      description: "Please check the complaint ID",
    });
  }
};



  const handleSubmitFeedback = async () => {
  if (!complaint) return;

  try {
    await submitFeedback(complaint.complaintId, feedbackComment, rating);

    toast.success("Feedback submitted!", {
      description: "Thank you for your feedback.",
    });

    // ✅ Update local complaint state so UI refreshes
    setComplaint({
      ...complaint,
      feedback: feedbackComment,
      rating: rating,
    });

    // Clear form fields
    setRating(0);
    setSatisfied("");
    setFeedbackComment("");
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit feedback");
  }
};



  const timelineIcons: Record<string, any> = {
    "Complaint Submitted": Clock,
    "Assigned to Department": Building2,
    "Officer Assigned": User,
    "Work In Progress": Clock,
    "Issue Resolved": CheckCircle2,
  };

  return (
    <CitizenLayout
      title="Track Issue"
      subtitle="Monitor the progress of your complaints"
    >
      {/* Search Section */}
      <div className="glass-card p-6 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter Complaint ID (e.g., 5)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search Complaint</Button>
        </div>
      </div>

      {/* Result Card */}
      {complaint && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-mono text-primary">{complaint.complaintId}</span>
                  <Badge variant={statusToBadgeVariant(complaint.status)} className="text-sm capitalize">
                    {complaint.status.replace("-", " ")}
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{complaint.title}</h2>
                <Badge variant={priorityToBadgeVariant(complaint.priority)} className="mt-2 capitalize">
                  {complaint.priority} Priority
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Full Description</h3>
              <p className="text-foreground">{complaint.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium text-foreground">{complaint.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy – hh:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{complaint.location}</p>
                </div>
              </div>
            </div>

            {/* Attached Images with modal */}
{complaint.images && complaint.images.length > 0 && (
  <>
    <div className="flex gap-3 mb-6">
      {complaint.images.map((img, index) => (
        <img
          key={index}
          src={getImageUrl(img)}
          alt={`complaint-${complaint.complaintId}-img-${index}`}
          className="w-24 h-24 rounded-lg object-cover border cursor-pointer"
          onClick={() => setSelectedImage(getImageUrl(img))} // open modal
        />
      ))}
    </div>

    {/* Modal */}
    {selectedImage && (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setSelectedImage(null)} // close on background click
      >
        <img
          src={selectedImage}
          alt="Full Size"
          className="max-w-[90%] max-h-[90%] rounded-lg"
        />
      </div>
    )}
  </>
)}




            {/* Timeline */}
            {complaint.timeline && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Status Timeline</h3>
                <div className="relative space-y-0">
                  {complaint.timeline.map((event, index) => {
                    const Icon = timelineIcons[event.status] || Clock;
                    const isLast = index === complaint.timeline!.length - 1;
                    const isCompleted = true;

                    return (
                      <div key={index} className="relative pl-10 pb-6 last:pb-0">
                        {/* Connector Line */}
                        {!isLast && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
                        )}
                        
                        {/* Dot */}
                        <div
                          className={cn(
                            "absolute left-2.5 top-1 w-3 h-3 rounded-full border-2",
                            isCompleted
                              ? "border-primary bg-primary shadow-neon"
                              : "border-muted-foreground bg-background"
                          )}
                        />

                        <div className="glass-card p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">{event.status}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                          {event.officer && (
                            <p className="text-xs text-primary">Assigned to: {event.officer}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(event.date), "MMM dd, yyyy – hh:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Assigned To Card */}
          {complaint.department && (
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Assigned To</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{complaint.department}</p>
                  {complaint.officer && (
                    <>
                      <p className="text-sm text-muted-foreground mt-2">Officer</p>
                      <p className="font-medium text-foreground">{complaint.officer}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section - Only for Resolved */}
          {complaint.status.toLowerCase() === "resolved" && !complaint.feedback?.trim() && (
            <div className="glass-card p-6 neon-border animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Rate Resolution</h3>
              
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() => setRating(star)}
      className="p-1 transition-transform hover:scale-110"
    >
      <Star
  className={cn(
    "w-8 h-8 transition-colors duration-200",
    star <= rating
      ? "text-amber-400 fill-amber-400" // solid yellow, no glow
      : "text-muted-foreground" // gray outline
  )}
/>

    </button>
  ))}
</div>


              {/* Satisfaction */}
              <div className="mb-6">
                <Label className="text-sm text-muted-foreground mb-3 block">Satisfaction</Label>
                <RadioGroup value={satisfied} onValueChange={setSatisfied} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="satisfied-yes" />
                    <Label htmlFor="satisfied-yes" className="text-success cursor-pointer">
                      Yes, Satisfied
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="satisfied-no" />
                    <Label htmlFor="satisfied-no" className="text-destructive cursor-pointer">
                      No, Not Satisfied
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <Label htmlFor="feedback" className="text-sm text-muted-foreground mb-2 block">
                  Additional Comments (Optional)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your experience..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>

              <Button onClick={handleSubmitFeedback} disabled={rating === 0 || !satisfied}>
                Submit Feedback
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!complaint && !searchId && (
        <div className="glass-card p-12 text-center animate-fade-in">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Track Your Complaint</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Enter your complaint ID above to view the current status and timeline of your submitted issue.
          </p>
        </div>
      )}
    </CitizenLayout>
  );
}
