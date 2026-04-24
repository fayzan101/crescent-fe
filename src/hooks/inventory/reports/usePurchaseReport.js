import { useQuery } from "@tanstack/react-query";
import { getPurchaseReport } from "@/services/inventory-reports.service";

export const usePurchaseReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["purchase-report", params],
    queryFn: () => getPurchaseReport(params),
    ...options,
  });
};
