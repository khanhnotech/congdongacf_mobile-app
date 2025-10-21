// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Web Client ID từ Google Console
  // Lấy từ: https://console.developers.google.com/
  // 1. Tạo project mới hoặc chọn project hiện có
  // 2. Enable Google+ API
  // 3. Tạo OAuth 2.0 credentials
  // 4. Copy Web Client ID vào đây
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'your_google_web_client_id_here',
  
  // Các cấu hình khác
  OFFLINE_ACCESS: true,
  HOSTED_DOMAIN: '', // Tùy chọn: giới hạn domain
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};

// Hướng dẫn cấu hình:
// 1. Truy cập https://console.developers.google.com/
// 2. Tạo project mới hoặc chọn project hiện có
// 3. Enable Google+ API và Google Sign-In API
// 4. Tạo OAuth 2.0 credentials
// 5. Copy Web Client ID
// 6. Tạo file .env với EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_client_id
// 7. Restart app để áp dụng cấu hình
