export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "assigned" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt: string;
  images?: string[];
  department?: string;
  officer?: string;
  timeline?: {
    status: string;
    date: string;
    description: string;
    officer?: string;
  }[];
  feedback?: {
    rating: number;
    satisfied: boolean;
    comment: string;
  };
}

export const mockComplaints: Complaint[] = [
  {
    id: "CP-7X8K9M",
    title: "Water Pipeline Leakage on Main Road",
    description: "There is a significant water leak from the main pipeline on the corner of Main Road and 5th Street. The leak has been ongoing for 3 days and is causing water wastage and road damage. The water is pooling on the road creating a hazard for vehicles and pedestrians.",
    category: "Water Supply",
    location: "Sector 7, Main Road, Near Market",
    priority: "high",
    status: "resolved",
    createdAt: "2024-12-17T10:30:00",
    updatedAt: "2024-12-18T15:45:00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    department: "Water Works Department",
    officer: "Mr. Rajesh Kumar",
    timeline: [
      { status: "Complaint Submitted", date: "2024-12-17T10:30:00", description: "Complaint registered successfully" },
      { status: "Assigned to Department", date: "2024-12-17T11:00:00", description: "Forwarded to Water Works Department" },
      { status: "Officer Assigned", date: "2024-12-17T14:00:00", description: "Mr. Rajesh Kumar assigned", officer: "Mr. Rajesh Kumar" },
      { status: "Work In Progress", date: "2024-12-18T09:00:00", description: "Team dispatched to location" },
      { status: "Issue Resolved", date: "2024-12-18T15:45:00", description: "Pipeline repaired successfully" },
    ],
  },
  {
    id: "CP-3A4B5C",
    title: "Street Light Not Working",
    description: "The street light outside house number 42 has not been working for a week now. This is creating safety concerns for residents during night time.",
    category: "Electricity",
    location: "Sector 12, Green Avenue, House No. 42",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-12-16T08:15:00",
    updatedAt: "2024-12-18T12:00:00",
    department: "Electricity Department",
    officer: "Mr. Amit Sharma",
  },
  {
    id: "CP-9D8E7F",
    title: "Garbage Not Collected for 5 Days",
    description: "The garbage collection service has not visited our area for 5 consecutive days. Waste is piling up and causing hygiene issues.",
    category: "Garbage & Sanitation",
    location: "Sector 5, Block B, Near Community Center",
    priority: "high",
    status: "assigned",
    createdAt: "2024-12-15T16:45:00",
    updatedAt: "2024-12-17T10:00:00",
    department: "Sanitation Department",
  },
  {
    id: "CP-2G3H4I",
    title: "Pothole on Highway Near School",
    description: "Large pothole has formed on the main highway near the public school. It's causing accidents and damage to vehicles.",
    category: "Road & Infrastructure",
    location: "National Highway 9, Near Public School",
    priority: "high",
    status: "pending",
    createdAt: "2024-12-18T09:00:00",
    updatedAt: "2024-12-18T09:00:00",
  },
  {
    id: "CP-5J6K7L",
    title: "Drainage Overflow in Residential Area",
    description: "The main drainage is overflowing causing water to enter homes. Urgent action required.",
    category: "Drainage Issues",
    location: "Sector 3, Old Town Area",
    priority: "medium",
    status: "pending",
    createdAt: "2024-12-17T14:30:00",
    updatedAt: "2024-12-17T14:30:00",
  },
  {
    id: "CP-8M9N0O",
    title: "Park Maintenance Required",
    description: "The community park needs maintenance. Broken benches and overgrown grass making it unusable.",
    category: "Other",
    location: "Central Park, City Center",
    priority: "low",
    status: "resolved",
    createdAt: "2024-12-10T11:00:00",
    updatedAt: "2024-12-14T16:30:00",
    department: "Parks & Recreation",
    officer: "Ms. Priya Verma",
  },
];

export const getStatusCount = (status: string) => {
  if (status === "all") return mockComplaints.length;
  return mockComplaints.filter((c) => c.status === status).length;
};

export const categories = [
  { value: "road", label: "Road & Infrastructure", icon: "🛣️" },
  { value: "water", label: "Water Supply", icon: "💧" },
  { value: "electricity", label: "Electricity", icon: "⚡" },
  { value: "garbage", label: "Garbage & Sanitation", icon: "🗑️" },
  { value: "drainage", label: "Drainage Issues", icon: "🚰" },
  { value: "other", label: "Other", icon: "📋" },
];
