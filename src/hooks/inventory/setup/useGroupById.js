import { useQuery } from "@tanstack/react-query";
import { getInventoryGroupById } from "@/services/inventory-setup.service";

export const useGroupById = (id, options = {}) => {
  return useQuery({
    queryKey: ["inventory-group", id],
    queryFn: () => getInventoryGroupById(id),
    enabled: !!id,
    ...options,
  });
};
