import { useQuery } from "@tanstack/react-query";
import { getGRNByPurchaseOrderId } from "@/services/inventory-grn.service";

export const useGetGRNByPurchaseOrderId = (poId, options = {}) => {
  return useQuery({
    queryKey: ["grn-by-po", poId],
    queryFn: () => getGRNByPurchaseOrderId(poId),
    enabled: !!poId,
    ...options,
  });
};
