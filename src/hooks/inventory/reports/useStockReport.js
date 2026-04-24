import { useQuery } from "@tanstack/react-query";
import { getStockReport } from "@/services/inventory-reports.service";

export const useStockReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["stock-report", params],
    queryFn: () => getStockReport(params),
    ...options,
  });
};
