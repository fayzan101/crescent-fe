import { useQuery } from '@tanstack/react-query';
import usersService from '@/services/users.service';

export const useAppUserById = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['app-users', 'detail', id],
    queryFn: () => usersService.getAppUserById(id),
    enabled: Boolean(id) && enabled,
    ...rest,
  });
};
