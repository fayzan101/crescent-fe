import { useQuery } from "@tanstack/react-query";
import { getStores } from "@/services/inventory-setup.service";

/** Same data as useStores — shares query cache and invalidation with store setup. */
export const useDropdownStores = (options = {}) => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    ...options,
  });
};
