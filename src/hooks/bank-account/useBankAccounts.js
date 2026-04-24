import { useQuery } from '@tanstack/react-query';
import bankAccountService from '@/services/bank-account.service';
import { queryKeys } from '@/lib/queryKeys';
export const useBankAccounts = (params, options = {}) => {
  const { enabled = true, ...rest } = options;
  return useQuery({
    queryKey: ['bank-accounts', 'list', params],
    queryFn: () => bankAccountService.fetchBankAccounts(params),
    enabled,
    ...rest,
  });
};
