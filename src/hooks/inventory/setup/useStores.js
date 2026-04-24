import { useQuery } from "@tanstack/react-query";
import { getStores } from "@/services/inventory-setup.service";

export const useStores = (options = {}) => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    ...options,
  });
};
