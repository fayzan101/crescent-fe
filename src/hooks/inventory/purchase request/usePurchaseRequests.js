import { useQuery } from "@tanstack/react-query";
import { getPurchaseRequests } from "@/services/inventory.pr.service";

export const usePurchaseRequests = (options = {}) => {
  return useQuery({
    queryKey: ["purchase-requests"],
    queryFn: getPurchaseRequests,
    ...options,
  });
};
