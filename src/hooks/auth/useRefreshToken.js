import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import authService from '@/services/auth.service';
import { loginSuccess } from '@/redux/slices/userSlice';

const normalizeAuthPayload = (data) => {
  return {
    token: data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token || null,
    refreshToken: data?.refreshToken || data?.data?.refreshToken || null,
    user: data?.user || data?.data?.user || data?.profile || data?.data?.profile || null,
  };
};

export const useRefreshToken = (options = {}) => {
  const dispatch = useDispatch();
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: (payload) => authService.refresh(payload),
    onSuccess: (data, variables, context) => {
      const { token, refreshToken, user } = normalizeAuthPayload(data);
      if (token || refreshToken || user) {
        dispatch(loginSuccess({ user, token, refreshToken }));
      }
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (onError) onError(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      if (onSettled) onSettled(data, error, variables, context);
    },
    ...rest,
  });
};
