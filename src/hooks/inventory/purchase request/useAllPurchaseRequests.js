import { useQuery } from "@tanstack/react-query";
import { getAllPurchaseRequests } from "@/services/inventory.pr.service";

export const useAllPurchaseRequests = (options = {}) => {
  return useQuery({
    queryKey: ["all-purchase-requests"],
    queryFn: getAllPurchaseRequests,
    ...options,
  });
};
