import { useState ,useEffect} from "react";
import { getAllComplaints ,assignComplaint} from "@/api/dasboardApi"; 
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, LogOut, AlertCircle, MapPin, Clock, 
  CheckCircle2, Loader2, Users, FileText, Search, Eye
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const departments = [
  { value: "water", label: "Water Works Department" },
  { value: "electricity", label: "Electricity Department" },
  { value: "roads", label: "Roads & Infrastructure" },
  { value: "sanitation", label: "Sanitation Department" },
  { value: "drainage", label: "Drainage Department" },
  { value: "parks", label: "Parks & Recreation" },
];

const officers: Record<string, string[]> = {
  water: ["Mr. Rajesh Kumar", "Ms. Sunita Devi", "Mr. Arun Singh"],
  electricity: ["Mr. Amit Sharma", "Ms. Kavita Rao", "Mr. Deepak Gupta"],
  roads: ["Mr. Vijay Patel", "Ms. Nisha Reddy", "Mr. Suresh Yadav"],
  sanitation: ["Mr. Ramesh Iyer", "Ms. Lakshmi Nair", "Mr. Gopal Das"],
  drainage: ["Mr. Sanjay Joshi", "Ms. Meera Kapoor", "Mr. Harish Menon"],
  parks: ["Ms. Priya Verma", "Mr. Kiran Rao", "Ms. Anjali Shah"],
};

const statusBadge: Record<
  "pending" | "assigned" | "in-progress" | "resolved",
  { label: string; variant: "pending" | "assigned" | "in-progress" | "resolved" }
> = {
  pending: { label: "Pending", variant: "pending" },
  assigned: { label: "Assigned", variant: "assigned" },
  "in-progress": { label: "In Progress", variant: "in-progress" },
  resolved: { label: "Resolved", variant: "resolved" },
};


export default function AdminDashboard() {
  const [selectedDept, setSelectedDept] = useState<Record<string, string>>({});
  const [selectedOfficer, setSelectedOfficer] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
const [complaints, setComplaints] = useState<any[]>([]);
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const BACKEND_URL = "http://localhost:8080"; // your backend URL

const normalizeStatus = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "submitted" || s === "pending") return "pending";
  if (s === "assigned") return "assigned";
  if (s === "in-progress") return "in-progress";
  if (s === "resolved") return "resolved";
  return "pending";
};
function getImageUrl(path: string) {
  if (!path) return "";
  const filename = path.split(/[/\\]/).pop();
  return `${BACKEND_URL}/uploads/${filename}`;
}

const getStatusCount = (status: string) => {
  if (status === "all") return complaints.length;
  return complaints.filter(
    c => normalizeStatus(c.status) === status
  ).length;
};


useEffect(() => {
  const token = localStorage.getItem("token"); // or wherever you store JWT
  if (!token) return;

  getAllComplaints(token)
    .then((data) => setComplaints(data))
    .catch((err) => {
      console.error("Failed to fetch complaints", err);
      toast.error("Failed to fetch complaints");
    });
}, []);

  const filteredComplaints = complaints.filter((c) => {
  const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toString().includes(searchQuery.toLowerCase()) || 
    (c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
  const matchesStatus = statusFilter === "all" || normalizeStatus(c.status) === statusFilter;
  return matchesSearch && matchesStatus;
});


  const handleAssign = async (complaintId: string) => {
  const dept = selectedDept[complaintId];

  const officer = selectedOfficer[complaintId];

  if (!dept || !officer) {
    toast.error("Please select both department and officer");
    return;
  }

  try {
    setAssigning(complaintId);

    // Call backend
    const updatedComplaint = await assignComplaint(
  Number(complaintId),
  departments.find(d => d.value === dept)?.label || dept,
  officer   // ✅ ADD THIS
);


    toast.success("Complaint assigned successfully!", {
      description: `Assigned to ${updatedComplaint.assignedDepartment} - ${officer}`,
    });

    // Update UI
    setComplaints(prev =>
  prev.map(c =>
    c.id === complaintId
      ? {
          ...c,
          assignedDepartment: updatedComplaint.assignedDepartment,
          assignedOfficer: updatedComplaint.assignedOfficer,
        }
      : c
  )
);

  } catch (err) {
    console.error(err);
    toast.error("Failed to assign complaint");
  } finally {
    setAssigning(null);
  }
};

  return (
    <div className="min-h-screen gradient-bg">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 border border-destructive/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CivicPulse</h1>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-destructive/30 to-warning/30 border border-destructive/30 flex items-center justify-center">
              <span className="text-xs font-semibold text-destructive">AD</span>
            </div>
            <span className="text-sm font-medium text-foreground">Admin User</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Grievance Management</h1>
          <p className="text-muted-foreground">View all citizen complaints and assign to department officers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-warning">{getStatusCount("pending")}</p>
              </div>
              <Clock className="w-8 h-8 text-warning/50" />
            </div>
          </div>
          <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Assigned</p>
                <p className="text-2xl font-bold text-accent">{getStatusCount("assigned")}</p>
              </div>
              <Users className="w-8 h-8 text-accent/50" />
            </div>
          </div>
          <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-bold text-primary">{getStatusCount("in-progress")}</p>
              </div>
              <Loader2 className="w-8 h-8 text-primary/50" />
            </div>
          </div>
          <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-bold text-success">{getStatusCount("resolved")}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success/50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "assigned", "in-progress", "resolved"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Complaint ID</TableHead>
                <TableHead className="text-muted-foreground">Citizen Details</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Priority</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Department & Officer</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint, index) => (
                <TableRow 
                  key={complaint.id} 
                  className="border-border animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-mono text-primary text-sm">{complaint.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </TableCell>
                  <TableCell>
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
      {complaint.citizenName?.[0] ?? "C"}
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">
        {complaint.citizenName ?? "Citizen"}
      </p>
      <p className="text-xs text-muted-foreground">
        {complaint.citizenEmail ?? "-"}
      </p>
    </div>
  </div>
</TableCell>

                  <TableCell className="max-w-[250px]">
                    <p className="font-medium text-foreground text-sm">{complaint.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{complaint.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">{complaint.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{complaint.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={complaint.priority} className="capitalize">{complaint.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
  const normalized = normalizeStatus(complaint.status);
  return (
    <Badge variant={statusBadge[normalized].variant}>
      {statusBadge[normalized].label}
    </Badge>
  );
})()}

                  </TableCell>
                  <TableCell>
                    {normalizeStatus(complaint.status) === "pending" ? (
                      <div className="space-y-2 min-w-[180px]">
                        <Select
                          value={selectedDept[complaint.id] || ""}
                          onValueChange={(value) => {
                            setSelectedDept({ ...selectedDept, [complaint.id]: value });
                            setSelectedOfficer({ ...selectedOfficer, [complaint.id]: "" });
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value} className="text-xs">
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedDept[complaint.id] && (
                          <Select
                            value={selectedOfficer[complaint.id] || ""}
                            onValueChange={(value) => setSelectedOfficer({ ...selectedOfficer, [complaint.id]: value })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select Officer" />
                            </SelectTrigger>
                            <SelectContent>
                              {officers[selectedDept[complaint.id]]?.map((officer) => (
                                <SelectItem key={officer} value={officer} className="text-xs">
                                  {officer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{complaint.department || "-"}</p>
                        {complaint.officer && (
                          <p className="text-xs text-muted-foreground">{complaint.officer}</p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-primary" />
                              {complaint.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{complaint.title}</h3>
                              <p className="text-muted-foreground mt-2">{complaint.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium text-foreground">{complaint.category}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Priority</p>
                                <Badge variant={complaint.priority}>{complaint.priority}</Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Location</p>
                                <p className="font-medium text-foreground">{complaint.location}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge variant={complaint.status}>{complaint.status}</Badge>
                              </div>
                            </div>
                            {complaint.images && complaint.images.length > 0 && (
  <div>
    <p className="text-muted-foreground mb-2">Attached Images</p>
    <div className="flex gap-2">
      {complaint.images.map((img, idx) => (
        <img
          key={idx}
          src={getImageUrl(img)}
          alt={`Attachment ${idx + 1}`}
          className="w-24 h-24 rounded-lg object-cover border border-border cursor-pointer"
          onClick={() => setSelectedImage(getImageUrl(img))} // optional modal
        />
      ))}
    </div>
  </div>
)}
{selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img
      src={selectedImage}
      alt="Full Size"
      className="max-w-[90%] max-h-[90%] rounded-lg"
    />
  </div>
)}

                          </div>
                        </DialogContent>
                      </Dialog>
                      {normalizeStatus(complaint.status) === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleAssign(complaint.id)}
                          disabled={!selectedDept[complaint.id] || !selectedOfficer[complaint.id] || assigning === complaint.id}
                        >
                          {assigning === complaint.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Assign"
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredComplaints.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
