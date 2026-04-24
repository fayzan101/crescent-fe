import { useQuery } from "@tanstack/react-query";
import { getReturns } from "@/services/inventory-mov.service";

export const useReturns = (options = {}) => {
  return useQuery({
    queryKey: ["returns"],
    queryFn: getReturns,
    ...options,
  });
};
