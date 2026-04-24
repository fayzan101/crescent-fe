import { useQuery } from "@tanstack/react-query";
import { getIssuances } from "@/services/inventory-mov.service";

export const useIssuances = (options = {}) => {
  return useQuery({
    queryKey: ["issuances"],
    queryFn: getIssuances,
    ...options,
  });
};
