import { useQuery } from "@tanstack/react-query";
import { getStoreById } from "@/services/inventory-setup.service";

export const useStoreById = (id, options = {}) => {
  return useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreById(id),
    enabled: !!id,
    ...options,
  });
};
