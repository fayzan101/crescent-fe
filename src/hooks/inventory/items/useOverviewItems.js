import { useQuery } from "@tanstack/react-query";
import { getOverviewItems } from "@/services/inventory-items.service";

export const useOverviewItems = (options = {}) => {
  return useQuery({
    queryKey: ["overview-items"],
    queryFn: getOverviewItems,
    ...options,
  });
};
