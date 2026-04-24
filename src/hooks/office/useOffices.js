import { useQuery } from '@tanstack/react-query';
import officeService from '@/services/office.service';
import { queryKeys } from '@/lib/queryKeys';

export const useOffices = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.offices.list(params),
    queryFn: () => officeService.fetchOfficesByOrganization(params),
    enabled,
    ...rest,
  });
};
