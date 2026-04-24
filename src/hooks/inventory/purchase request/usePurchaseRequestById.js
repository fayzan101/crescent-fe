import { useQuery } from "@tanstack/react-query";
import { getPurchaseRequestById } from "@/services/inventory.pr.service";

export const usePurchaseRequestById = (id, options = {}) => {
  return useQuery({
    queryKey: ["purchase-request", id],
    queryFn: () => getPurchaseRequestById(id),
    enabled: !!id,
    ...options,
  });
};
