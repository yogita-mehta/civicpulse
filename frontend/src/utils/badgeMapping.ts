export const statusToBadgeVariant = (
  status?: string
):
  | "default"
  | "resolved"
  | "pending"
  | "assigned"
  | "in-progress" => {
  switch (status?.toLowerCase()) {
    case "resolved":
      return "resolved";
    case "assigned":
      return "assigned";
    case "in_progress":
    case "in-progress":
      return "in-progress";
    case "pending":
    default:
      return "pending";
  }
};

export const priorityToBadgeVariant = (
  priority?: string
):
  | "low"
  | "medium"
  | "high"
  | "default" => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "default";
  }
};
