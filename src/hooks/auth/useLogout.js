import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import authService from '@/services/auth.service';
import { signOut } from '@/redux/slices/userSlice';

export const useLogout = (options = {}) => {
  const dispatch = useDispatch();
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: (payload) => authService.logout(payload),
    onSuccess: (data, variables, context) => {
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (onError) onError(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      dispatch(signOut());
      if (onSettled) onSettled(data, error, variables, context);
    },
    ...rest,
  });
};
