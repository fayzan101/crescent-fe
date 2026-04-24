import { useQuery } from "@tanstack/react-query";
import { getDropdownCategories } from "@/services/inventory-utility.service";

export const useDropdownCategories = (options = {}) => {
  return useQuery({
    queryKey: ["dropdown-categories"],
    queryFn: getDropdownCategories,
    ...options,
  });
};
