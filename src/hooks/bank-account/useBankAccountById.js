import { useQuery } from '@tanstack/react-query';
import bankAccountService from '@/services/bank-account.service';

export const useBankAccountById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['bank-accounts', 'detail', id],
    queryFn: () => bankAccountService.getBankAccountById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
