import { useQuery } from "@tanstack/react-query";
import { getDropdownStores } from "@/services/inventory-utility.service";

export const useDropdownStores = (options = {}) => {
  return useQuery({
    queryKey: ["dropdown-stores"],
    queryFn: getDropdownStores,
    ...options,
  });
};
