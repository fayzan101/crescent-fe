import { useQuery } from "@tanstack/react-query";
import { getTransfersReport } from "@/services/inventory-reports.service";

export const useTransfersReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["transfers-report", params],
    queryFn: () => getTransfersReport(params),
    ...options,
  });
};
