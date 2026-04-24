import { useQuery } from "@tanstack/react-query";
import { getTransferById } from "@/services/inventory-mov.service";

export const useTransferById = (id, options = {}) => {
  return useQuery({
    queryKey: ["transfer", id],
    queryFn: () => getTransferById(id),
    enabled: !!id,
    ...options,
  });
};
