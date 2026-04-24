import { useQuery } from "@tanstack/react-query";
import { getAllGRNs } from "@/services/inventory-grn.service";

export const useGetAllGRNs = (options = {}) => {
  return useQuery({
    queryKey: ["grns"],
    queryFn: getAllGRNs,
    ...options,
  });
};
