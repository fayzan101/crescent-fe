import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrders } from "@/services/inventory-po.service";

export const usePurchaseOrders = (options = {}) => {
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: getPurchaseOrders,
    ...options,
  });
};
