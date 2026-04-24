import { useQuery } from "@tanstack/react-query";
import { getInventoryVendorById } from "@/services/inventory-setup.service";

export const useVendorById = (id, options = {}) => {
  return useQuery({
    queryKey: ["inventory-vendor", id],
    queryFn: () => getInventoryVendorById(id),
    enabled: !!id,
    ...options,
  });
};
