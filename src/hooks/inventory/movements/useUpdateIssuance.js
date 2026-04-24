import { useMutation } from "@tanstack/react-query";
import { updateIssuance } from "@/services/inventory-mov.service";

export const useUpdateIssuance = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateIssuance(id, data),
    ...options,
  });
};
