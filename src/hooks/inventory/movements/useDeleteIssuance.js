import { useMutation } from "@tanstack/react-query";
import { deleteIssuance } from "@/services/inventory-mov.service";

export const useDeleteIssuance = (options = {}) => {
  return useMutation({
    mutationFn: deleteIssuance,
    ...options,
  });
};
