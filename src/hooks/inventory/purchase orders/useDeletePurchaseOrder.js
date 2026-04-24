import { useMutation } from "@tanstack/react-query";
import { deletePurchaseOrder } from "@/services/inventory-po.service";

export const useDeletePurchaseOrder = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deletePurchaseOrder(id),
    ...options,
  });
};
