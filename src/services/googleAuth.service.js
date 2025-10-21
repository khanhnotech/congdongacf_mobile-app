import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { apiClient } from './api';
import { GOOGLE_CONFIG } from '../config/google.config';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
  offlineAccess: GOOGLE_CONFIG.OFFLINE_ACCESS,
  hostedDomain: GOOGLE_CONFIG.HOSTED_DOMAIN,
  forceCodeForRefreshToken: GOOGLE_CONFIG.FORCE_CODE_FOR_REFRESH_TOKEN,
});

export const googleAuthService = {
  /**
   * Đăng nhập bằng Google
   * @returns {Promise<Object>} - { user, tokens }
   */
  async signIn() {
    try {
      // Kiểm tra xem Google Play Services có sẵn không
      await GoogleSignin.hasPlayServices();
      
      // Đăng nhập với Google
      const userInfo = await GoogleSignin.signIn();
      
      // Lấy ID token
      const idToken = userInfo.idToken;
      if (!idToken) {
        throw new Error('Không thể lấy ID token từ Google');
      }
      
      // Gửi ID token lên server để xác thực
      const response = await apiClient.post('auth/google', {
        id_token: idToken,
      });
      
      return response.data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // Xử lý các lỗi phổ biến
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Đăng nhập bị hủy');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Đang xử lý đăng nhập, vui lòng thử lại');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services không khả dụng');
      } else if (error.message?.includes('network')) {
        throw new Error('Lỗi kết nối mạng');
      } else {
        throw new Error(error.message || 'Đăng nhập Google thất bại');
      }
    }
  },

  /**
   * Đăng xuất khỏi Google
   */
  async signOut() {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
      // Không throw error vì có thể user chưa đăng nhập Google
    }
  },

  /**
   * Kiểm tra xem user có đăng nhập Google không
   * @returns {Promise<boolean>}
   */
  async isSignedIn() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      return isSignedIn;
    } catch (error) {
      console.error('Check Google Sign-In Status Error:', error);
      return false;
    }
  },

  /**
   * Lấy thông tin user hiện tại từ Google
   * @returns {Promise<Object|null>}
   */
  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      console.error('Get Current Google User Error:', error);
      return null;
    }
  },
};
