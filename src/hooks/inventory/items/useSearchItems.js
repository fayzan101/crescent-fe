import { useQuery } from "@tanstack/react-query";
import { searchInventoryItems } from "@/services/inventory-items.service";

export const useSearchItems = (q, options = {}) => {
  return useQuery({
    queryKey: ["inventory-items-search", q],
    queryFn: () => searchInventoryItems(q),
    enabled: !!q,
    ...options,
  });
};
