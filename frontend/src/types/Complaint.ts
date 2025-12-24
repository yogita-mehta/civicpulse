export interface Complaint {
  complaintId: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority?: string;

  createdAt: string; // ISO date string from backend

  location?: string;

  department?: string;
  officer?: string;

  images?: string[];

  timeline?: {
    status: string;
    description: string;
    date: string;
    officer?: string;
  }[];

   // feedback ⭐⭐⭐
  feedback?: string;
  rating?: number;
}
