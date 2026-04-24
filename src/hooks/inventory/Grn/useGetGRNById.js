import { useQuery } from "@tanstack/react-query";
import { getGRNById } from "@/services/inventory-grn.service";

export const useGetGRNById = (id, options = {}) => {
  return useQuery({
    queryKey: ["grn", id],
    queryFn: () => getGRNById(id),
    enabled: !!id,
    ...options,
  });
};
