import { useQuery } from '@tanstack/react-query';
import usersService from '@/services/users.service';

export const useAppUsers = (options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: ['app-users', 'list'],
    queryFn: () => usersService.fetchAppUsers(),
    enabled,
    ...rest,
  });
};
