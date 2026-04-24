import { useMutation } from "@tanstack/react-query";
import { confirmGRN } from "@/services/inventory-grn.service";

export const useConfirmGRN = (options = {}) => {
  return useMutation({
    mutationFn: confirmGRN,
    ...options,
  });
};
