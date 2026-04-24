import { useQuery } from "@tanstack/react-query";
import { getInventoryCategoryById } from "@/services/inventory-setup.service";

export const useCategoryById = (id, options = {}) => {
  return useQuery({
    queryKey: ["inventory-category", id],
    queryFn: () => getInventoryCategoryById(id),
    enabled: !!id,
    ...options,
  });
};
