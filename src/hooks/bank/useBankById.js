import { useQuery } from '@tanstack/react-query';
import bankService from '@/services/bank.service';

export const useBankById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['banks', 'detail', id],
    queryFn: () => bankService.getBankById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
