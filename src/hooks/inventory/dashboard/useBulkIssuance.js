import { useMutation } from "@tanstack/react-query";
import { bulkIssuance } from "@/services/inventory-dashboard.service";

export const useBulkIssuance = (options = {}) => {
  return useMutation({
    mutationFn: (data) => bulkIssuance(data),
    ...options,
  });
};
