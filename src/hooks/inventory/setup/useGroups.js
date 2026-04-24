import { useQuery } from "@tanstack/react-query";
import { getInventoryGroups } from "@/services/inventory-setup.service";

export const useGroups = (options = {}) => {
  return useQuery({
    queryKey: ["inventory-groups"],
    queryFn: getInventoryGroups,
    ...options,
  });
};
