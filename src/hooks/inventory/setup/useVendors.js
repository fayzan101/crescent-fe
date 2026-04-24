import { useQuery } from "@tanstack/react-query";
import { getInventoryVendors } from "@/services/inventory-setup.service";

export const useVendors = (options = {}) => {
  return useQuery({
    queryKey: ["inventory-vendors"],
    queryFn: getInventoryVendors,
    ...options,
  });
};
