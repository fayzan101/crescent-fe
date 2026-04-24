import { useMutation } from "@tanstack/react-query";
import { deleteGRN } from "@/services/inventory-grn.service";

export const useDeleteGRN = (options = {}) => {
  return useMutation({
    mutationFn: deleteGRN,
    ...options,
  });
};
