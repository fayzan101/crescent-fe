import { useQuery } from "@tanstack/react-query";
import { getDropdownVendors } from "@/services/inventory-utility.service";

export const useDropdownVendors = (options = {}) => {
  return useQuery({
    queryKey: ["dropdown-vendors"],
    queryFn: getDropdownVendors,
    ...options,
  });
};
