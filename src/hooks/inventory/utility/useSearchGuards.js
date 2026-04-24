import { useQuery } from "@tanstack/react-query";
import { searchGuards } from "@/services/inventory-utility.service";

export const useSearchGuards = (service_no, options = {}) => {
  return useQuery({
    queryKey: ["search-guards", service_no],
    queryFn: () => searchGuards(service_no),
    enabled: !!service_no,
    ...options,
  });
};
