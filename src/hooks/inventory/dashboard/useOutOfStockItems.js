import { useQuery } from "@tanstack/react-query";
import { getOutOfStockItems } from "@/services/inventory-dashboard.service";

export const useOutOfStockItems = (options = {}) => {
  return useQuery({
    queryKey: ["out-of-stock-items"],
    queryFn: getOutOfStockItems,
    ...options,
  });
};
