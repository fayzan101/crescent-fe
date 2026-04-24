import { useQuery } from '@tanstack/react-query';
import zoneService from '@/services/zone.service';
import { queryKeys } from '@/lib/queryKeys';

export const useZoneById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.zones.detail(id),
    queryFn: () => zoneService.getZoneById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
