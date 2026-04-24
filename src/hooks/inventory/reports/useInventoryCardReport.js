import { useQuery } from "@tanstack/react-query";
import { getInventoryCardReport } from "@/services/inventory-reports.service";

export const useInventoryCardReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["inventory-card-report", params],
    queryFn: () => getInventoryCardReport(params),
    ...options,
  });
};
