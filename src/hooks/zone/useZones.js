import { useQuery } from '@tanstack/react-query';
import zoneService from '@/services/zone.service';
import { queryKeys } from '@/lib/queryKeys';

export const useZones = (params, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: queryKeys.zones.list(params),
    queryFn: () => zoneService.fetchZones(params),
    enabled,
    ...rest,
  });
};
