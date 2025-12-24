import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import Dashboard from "@/pages/citizen/Dashboard";
import SubmitComplaint from "@/pages/citizen/SubmitComplaint";
import MyComplaints from "@/pages/citizen/MyComplaints";
import TrackIssue from "@/pages/citizen/TrackIssue";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DepartmentDashboard from "@/pages/DepartmentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route
  path="/department"
  element={
    <ProtectedRoute role="DEPARTMENT">
      <DepartmentDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

            {/* 🔐 Citizen Module (PROTECTED) */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/submit"
              element={
                <ProtectedRoute>
                  <SubmitComplaint />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/complaints"
              element={
                <ProtectedRoute>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen/track"
              element={
                <ProtectedRoute>
                  <TrackIssue />
                </ProtectedRoute>
              }
            />
            

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
