import { useMutation } from "@tanstack/react-query";
import { createPurchaseOrder } from "@/services/inventory-po.service";

export const useCreatePurchaseOrder = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createPurchaseOrder(data),
    ...options,
  });
};
