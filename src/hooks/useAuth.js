import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { QUERY_KEYS } from '../utils/constants';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, refreshToken, user, setAuth, clearAuth, isInitialLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: authService.login,
    onSuccess: ({ token: nextToken, refreshToken: nextRefresh, user: nextUser }) => {
      setAuth({ token: nextToken, refreshToken: nextRefresh, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: authService.register,
    onSuccess: ({ token: nextToken, refreshToken: nextRefresh, user: nextUser }) => {
      setAuth({ token: nextToken, refreshToken: nextRefresh, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const updateProfileMutation = useMutation({
    mutationKey: ['auth', 'updateProfile'],
    mutationFn: authService.updateProfile,
    onSuccess: (nextUser) => {
      setAuth({ token, refreshToken, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authService.logout({ refreshToken, token }),
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  return {
    token,
    refreshToken,
    user,
    isInitialLoading,
    setAuth,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileStatus: updateProfileMutation.status,
    logout: logoutMutation.mutateAsync,
    logoutStatus: logoutMutation.status,
  };
};
