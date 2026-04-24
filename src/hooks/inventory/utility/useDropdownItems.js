import { useQuery } from "@tanstack/react-query";
import { getDropdownItems } from "@/services/inventory-utility.service";

export const useDropdownItems = (options = {}) => {
  return useQuery({
    queryKey: ["dropdown-items"],
    queryFn: getDropdownItems,
    ...options,
  });
};
