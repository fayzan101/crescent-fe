import { useQuery } from "@tanstack/react-query";
import { getInventoryCategories } from "@/services/inventory-setup.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["inventory-categories"],
    queryFn: getInventoryCategories,
  });
};
