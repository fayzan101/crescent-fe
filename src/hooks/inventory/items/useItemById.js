import { useQuery } from "@tanstack/react-query";
import { getInventoryItemById } from "@/services/inventory-items.service";

export const useItemById = (id, options = {}) => {
  return useQuery({
    queryKey: ["inventory-item", id],
    queryFn: () => getInventoryItemById(id),
    enabled: !!id,
    ...options,
  });
};
