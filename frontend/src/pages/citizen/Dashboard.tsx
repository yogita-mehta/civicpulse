import { CitizenLayout } from "@/components/layout/CitizenLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RecentComplaintCard } from "@/components/dashboard/RecentComplaintCard";
import { FileText, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { mockComplaints, getStatusCount } from "@/data/mockComplaints";

export default function Dashboard() {
  return (
    <CitizenLayout
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your complaints."
    >
      {/* Quick Action */}
      <div className="mb-6">
        <QuickActionCard />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Complaints"
          value={getStatusCount("all")}
          trend="+2 this month"
          icon={FileText}
          variant="primary"
        />
        <StatsCard
          title="Pending"
          value={getStatusCount("pending")}
          trend="Awaiting review"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="In Progress"
          value={getStatusCount("in-progress") + getStatusCount("assigned")}
          trend="Being processed"
          icon={Loader2}
          variant="primary"
        />
        <StatsCard
          title="Resolved"
          value={getStatusCount("resolved")}
          trend="Successfully closed"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Recent Complaints */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Complaints</h2>
        <div className="space-y-3">
          {mockComplaints.slice(0, 4).map((complaint, index) => (
            <div key={complaint.id} style={{ animationDelay: `${index * 100}ms` }}>
              <RecentComplaintCard complaint={complaint} />
            </div>
          ))}
        </div>
      </div>
    </CitizenLayout>
  );
}
