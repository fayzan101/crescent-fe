import { useQuery } from "@tanstack/react-query";
import { getDropdowns } from "@/services/inventory-utility.service";

export const useDropdowns = (resources, options = {}) => {
  return useQuery({
    queryKey: ["dropdowns", resources],
    queryFn: () => getDropdowns(resources),
    enabled: !!resources,
    ...options,
  });
};
