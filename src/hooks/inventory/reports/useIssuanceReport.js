import { useQuery } from "@tanstack/react-query";
import { getIssuanceReport } from "@/services/inventory-reports.service";

export const useIssuanceReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["issuance-report", params],
    queryFn: () => getIssuanceReport(params),
    ...options,
  });
};
