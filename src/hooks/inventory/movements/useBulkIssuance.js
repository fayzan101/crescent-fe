import { useMutation } from "@tanstack/react-query";
import { bulkIssuance } from "@/services/inventory-mov.service";

export const useBulkIssuance = (options = {}) => {
  return useMutation({
    mutationFn: bulkIssuance,
    ...options,
  });
};
