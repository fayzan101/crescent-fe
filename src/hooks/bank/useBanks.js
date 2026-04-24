import { useQuery } from '@tanstack/react-query';
import bankService from '@/services/bank.service';

export const useBanks = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['banks', 'list', params],
    queryFn: () => bankService.fetchBanks(params),
    enabled,
    ...rest,
  });
};
