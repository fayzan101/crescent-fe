import { useMutation } from "@tanstack/react-query";
import { bulkCreateItems } from "@/services/inventory-dashboard.service";

export const useBulkCreateItems = (options = {}) => {
  return useMutation({
    mutationFn: (data) => bulkCreateItems(data),
    ...options,
  });
};
