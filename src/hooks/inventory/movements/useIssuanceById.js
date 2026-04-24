import { useQuery } from "@tanstack/react-query";
import { getIssuanceById } from "@/services/inventory-mov.service";

export const useIssuanceById = (id, options = {}) => {
  return useQuery({
    queryKey: ["issuance", id],
    queryFn: () => getIssuanceById(id),
    enabled: !!id,
    ...options,
  });
};
