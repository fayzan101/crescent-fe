import { useQuery } from '@tanstack/react-query';
import officeService from '@/services/office.service';
import { queryKeys } from '@/lib/queryKeys';

export const useOfficeById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.offices.detail(id),
    queryFn: () => officeService.getOfficeById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
