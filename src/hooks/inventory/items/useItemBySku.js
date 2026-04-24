import { useQuery } from "@tanstack/react-query";
import { getInventoryItemBySku } from "@/services/inventory-items.service";

export const useItemBySku = (sku, options = {}) => {
  return useQuery({
    queryKey: ["inventory-item-sku", sku],
    queryFn: () => getInventoryItemBySku(sku),
    enabled: !!sku,
    ...options,
  });
};
