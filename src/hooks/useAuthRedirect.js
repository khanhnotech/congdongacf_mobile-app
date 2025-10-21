import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './useAuth';
import { ROUTES } from '../utils/constants';

/**
 * Hook để handle authentication redirect khi user chưa đăng nhập
 * @returns {Object} - { requireAuth, isAuthenticated }
 */
export const useAuthRedirect = () => {
  const navigation = useNavigation();
  const { user, isInitialLoading } = useAuth();

  const isAuthenticated = Boolean(user && !isInitialLoading);

  /**
   * Yêu cầu đăng nhập trước khi thực hiện action
   * @param {Function} action - Function sẽ được gọi nếu user đã đăng nhập
   * @param {string} actionName - Tên action để hiển thị trong alert
   * @returns {Function} - Wrapped function
   */
  const requireAuth = useCallback((action, actionName = 'thực hiện hành động này') => {
    return (...args) => {
      if (isInitialLoading) {
        return; // Đang loading, không làm gì
      }

      if (!isAuthenticated) {
        // Navigate thẳng đến trang đăng nhập
        navigation.navigate(ROUTES.AUTH.LOGIN);
        return;
      }

      // User đã đăng nhập, thực hiện action
      if (typeof action === 'function') {
        return action(...args);
      }
    };
  }, [isAuthenticated, isInitialLoading, navigation]);

  /**
   * Yêu cầu đăng nhập với custom message
   * @param {string} message - Custom message (không sử dụng nữa)
   * @param {Function} onConfirm - Callback khi user confirm
   */
  const requireAuthWithMessage = useCallback((message, onConfirm) => {
    if (isInitialLoading) return;

    if (!isAuthenticated) {
      // Navigate thẳng đến trang đăng nhập
      navigation.navigate(ROUTES.AUTH.LOGIN);
      if (onConfirm) onConfirm();
      return false;
    }

    return true;
  }, [isAuthenticated, isInitialLoading, navigation]);

  return {
    requireAuth,
    requireAuthWithMessage,
    isAuthenticated,
    isInitialLoading,
  };
};
