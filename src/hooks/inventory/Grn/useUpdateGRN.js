import { useMutation } from "@tanstack/react-query";
import { updateGRN } from "@/services/inventory-grn.service";

export const useUpdateGRN = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateGRN(id, data),
    ...options,
  });
};
