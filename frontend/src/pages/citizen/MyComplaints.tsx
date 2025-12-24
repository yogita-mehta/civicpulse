import { useEffect,useState } from "react";
import { getMyComplaints } from "@/api/dasboardApi";
import { CitizenLayout } from "@/components/layout/CitizenLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const filterTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

// Map backend status to frontend status filter
const statusMapping: Record<string, string> = {
  SUBMITTED: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
};

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]); // ✅ fetched complaints
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const BACKEND_URL = "http://localhost:8080";

function getImageUrl(path: string) {
  if (!path) return "";
  const filename = path.split(/[/\\]/).pop(); // takes only the filename
  return `${BACKEND_URL}/uploads/${filename}`;
}



  const getStatusCount = (status: string) => {
  if (status === "all") return complaints.length;
  return complaints.filter((c) => {
    const mapped = statusMapping[c.status] || c.status.toLowerCase();
    return mapped === status;
  }).length;
};



  // Filtered complaints for UI
  const filteredComplaints = complaints.filter((c) => {
  const mappedStatus = statusMapping[c.status] || c.status.toLowerCase();
  const matchesFilter = activeFilter === "all" || mappedStatus === activeFilter;
  const matchesSearch =
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.complaintId.toString().includes(searchQuery.toLowerCase());
  return matchesFilter && matchesSearch;
});



  //  Step 2 -> fetch complaints from backend
 useEffect(() => {
  async function fetchComplaints() {
    try {
      const res = await getMyComplaints();
      console.log("API response:", res);

      // ✅ Convert imagePath string to array
      const processed = (res || []).map((c: any) => ({
        ...c,
        images: c.imagePath
          ? c.imagePath.split(",").map((p: string) => p.replace(/\\/g, "/"))
          : [],
      }));

      setComplaints(processed);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  fetchComplaints();
}, []);




  if (loading) return <div>Loading complaints...</div>;

  return (
    <CitizenLayout
      title="My Complaints"
      subtitle="View and track all your submitted complaints"
    >
      {/* Search & Filters */}
      <div className="glass-card p-4 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {filterTabs.map((tab) => {
              const count = getStatusCount(tab.value);
              const isActive = activeFilter === tab.value;
              return (
                <Button
                  key={tab.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(tab.value)}
                  className="gap-1"
                >
                  {tab.label}
                  <span className={isActive ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    ({count})
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms"
                : "You haven't submitted any complaints yet"}
            </p>
          </div>
        ) : (
          filteredComplaints.map((c, i) => {
            const mappedStatus = statusMapping[c.status] || c.status.toLowerCase();
            console.log("createdAt raw:", c.createdAt);
            return (
              <Link key={c.complaintId} to={`/citizen/track?id=${c.complaintId}`}>
                <div
                  className="glass-card-hover p-5 flex items-start gap-4 group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-mono text-primary">{c.complaintId}</span>
    <Badge variant={c.priority}>{c.priority}</Badge>
  </div>
  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>

  {/* ✅ Attached Images */}
 {c.images && c.images.length > 0 && (
  <div className="flex gap-2 mt-2">
    {c.images.map((img: string, idx: number) => (
      <img
        key={idx}
        src={getImageUrl(img)}
        alt={`complaint-${c.complaintId}-img-${idx}`}
        className="w-16 h-16 object-cover rounded-md border"
      />
    ))}
  </div>
)}



  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
    <span className="flex items-center gap-1">
      <MapPin className="w-3 h-3" /> {c.location}
    </span>
    <span className="flex items-center gap-1">
      <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
    </span>
  </div>
</div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={mappedStatus} className="capitalize">{mappedStatus.replace("-", " ")}</Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </CitizenLayout>
  );
}