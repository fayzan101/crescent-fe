import { useQuery } from "@tanstack/react-query";
import { getInventoryItems } from "@/services/inventory-items.service";

export const useItems = (options = {}) => {
  return useQuery({
    queryKey: ["inventory-items"],
    queryFn: getInventoryItems,
    ...options,
  });
};
