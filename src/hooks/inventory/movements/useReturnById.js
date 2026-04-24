import { useQuery } from "@tanstack/react-query";
import { getReturnById } from "@/services/inventory-mov.service";

export const useReturnById = (id, options = {}) => {
  return useQuery({
    queryKey: ["return", id],
    queryFn: () => getReturnById(id),
    enabled: !!id,
    ...options,
  });
};
