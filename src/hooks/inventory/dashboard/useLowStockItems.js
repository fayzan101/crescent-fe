import { useQuery } from "@tanstack/react-query";
import { getLowStockItems } from "@/services/inventory-dashboard.service";

export const useLowStockItems = (options = {}) => {
  return useQuery({
    queryKey: ["low-stock-items"],
    queryFn: getLowStockItems,
    ...options,
  });
};
