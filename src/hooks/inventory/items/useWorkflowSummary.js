import { useQuery } from "@tanstack/react-query";
import { getItemWorkflowSummary } from "@/services/inventory-items.service";

export const useWorkflowSummary = (
  params = {},
  options = {}
) => {
  const { itemId, status, from, to } = params || {};

  return useQuery({
    queryKey: ["item-workflow", itemId ?? null, status ?? null, from ?? null, to ?? null],
    queryFn: () => getItemWorkflowSummary({ itemId, status, from, to }),
    keepPreviousData: true,
    ...options,
  });
};

export default useWorkflowSummary;
