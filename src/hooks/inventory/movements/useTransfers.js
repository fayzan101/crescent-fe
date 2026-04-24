import { useQuery } from "@tanstack/react-query";
import { getTransfers } from "@/services/inventory-mov.service";

export const useTransfers = (options = {}) => {
  return useQuery({
    queryKey: ["transfers"],
    queryFn: getTransfers,
    ...options,
  });
};
