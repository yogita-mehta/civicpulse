import { useState } from "react";
import { CitizenLayout } from "@/components/layout/CitizenLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Info, Shield, Bell, FileText, MapPin } from "lucide-react";
import { categories } from "@/data/mockComplaints";
import { toast } from "sonner";
import { LocationPicker } from "@/components/LocationPicker";
import { submitComplaint } from "@/api/dasboardApi";
import { useNavigate } from "react-router-dom";

export default function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("medium");
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("priority", priority);

    images.forEach((img) => {
      formData.append("images", img);
    });

    const response = await submitComplaint(formData);

    toast.success("Complaint submitted successfully!", {
      description: `Tracking ID: ${response.trackingId || "Generated"}`,
    });

    navigate("/citizen/complaints");
  } catch (error) {
    toast.error("Failed to submit complaint", {
      description: "Please try again",
    });
  }
};


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages([...images, ...newFiles]);
    }
  };

  const howItWorks = [
    { icon: FileText, title: "Easy Submission", desc: "Simple form with category selection and image upload" },
    { icon: Shield, title: "Secure & Private", desc: "Your data is protected and only accessible by officials" },
    { icon: MapPin, title: "Real-time Tracking", desc: "Track your complaint from submission to resolution" },
    { icon: Bell, title: "Status Updates", desc: "Get notified when there are updates on your complaint" },
  ];

  return (
    <CitizenLayout
      title="Submit Complaint"
      subtitle="Report an issue and we'll take care of it"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">New Grievance</h2>
            <p className="text-sm text-muted-foreground mb-6">Fill out the form below to submit your complaint</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title describing the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                  className="min-h-[150px]"
                  required
                />
                <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
              </div>

              {/* Location with Map */}
              <div className="space-y-2">
                <Label>Location *</Label>
                <LocationPicker value={location} onChange={setLocation} />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Images (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Max 3 images</p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={images.length >= 3}
                    />
                  </label>
                  {images.map((img, index) => (
                    <div key={index} className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      {img.name.slice(0, 8)}...
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <Label>Priority Level</Label>
                <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-success cursor-pointer">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-warning cursor-pointer">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-destructive cursor-pointer">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Submit Complaint
              </Button>

              {/* What happens next - subtle info below form */}
              <div className="flex items-start gap-2 pt-2 text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" />
                <p className="text-xs">
                  <span className="font-medium">What happens next?</span> Your complaint will be reviewed by our admin team and assigned to the relevant department. You'll receive a unique tracking ID to monitor the status.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* How it Works */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-foreground mb-4">How it Works</h3>
            <div className="space-y-4">
              {howItWorks.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
