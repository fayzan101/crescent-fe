import { useQuery } from '@tanstack/react-query';
import cityService from '@/services/city.service';

export const useCities = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['cities', 'list', params],
    queryFn: () => cityService.fetchCities(params),
    enabled,
    ...rest,
  });
};
