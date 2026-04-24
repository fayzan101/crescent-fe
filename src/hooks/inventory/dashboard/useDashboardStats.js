import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/inventory-dashboard.service";

export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    ...options,
  });
};
