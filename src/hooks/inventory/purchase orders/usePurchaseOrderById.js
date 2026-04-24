import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrderById } from "@/services/inventory-po.service";

export const usePurchaseOrderById = (id, options = {}) => {
  return useQuery({
    queryKey: ["purchase-order", id],
    queryFn: () => getPurchaseOrderById(id),
    enabled: !!id,
    ...options,
  });
};
