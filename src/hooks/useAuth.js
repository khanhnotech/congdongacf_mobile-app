import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { QUERY_KEYS } from '../utils/constants';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, user, setAuth, clearAuth, isInitialLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: authService.login,
    onSuccess: ({ token: nextToken, user: nextUser }) => {
      setAuth({ token: nextToken, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: authService.register,
    onSuccess: ({ token: nextToken, user: nextUser }) => {
      setAuth({ token: nextToken, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const updateProfileMutation = useMutation({
    mutationKey: ['auth', 'updateProfile'],
    mutationFn: authService.updateProfile,
    onSuccess: (nextUser) => {
      setAuth({ token, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.ME });
  };

  return {
    token,
    user,
    isInitialLoading,
    setAuth,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileStatus: updateProfileMutation.status,
    logout,
  };
};
