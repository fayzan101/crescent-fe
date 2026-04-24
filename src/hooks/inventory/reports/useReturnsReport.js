import { useQuery } from "@tanstack/react-query";
import { getReturnsReport } from "@/services/inventory-reports.service";

export const useReturnsReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["returns-report", params],
    queryFn: () => getReturnsReport(params),
    ...options,
  });
};
