# Hướng dẫn cấu hình Google Sign-In

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.developers.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Ghi nhớ Project ID

## 2. Enable APIs

1. Vào **APIs & Services** > **Library**
2. Tìm và enable các API sau:
   - **Google+ API** (hoặc **Google Identity**)
   - **Google Sign-In API**

## 3. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**
4. Đặt tên: `ACF Mobile App Web Client`
5. Thêm **Authorized redirect URIs**:
   - `http://localhost:3000` (cho development)
   - `https://yourdomain.com` (cho production)
6. Click **Create**
7. **Copy Web Client ID** (cần thiết cho app)

## 4. Tạo Android Credentials (cho React Native)

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Android**
4. Đặt tên: `ACF Mobile App Android`
5. Package name: `vn.acf.community` (từ app.json)
6. SHA-1 certificate fingerprint:
   - Development: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Production: Lấy từ keystore production
7. Click **Create**

## 5. Cấu hình App

1. Tạo file `.env` trong thư mục `acf-rn-app/`:
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
```

2. Thay thế `your_web_client_id_here` bằng Web Client ID từ bước 3

3. Restart app:
```bash
cd acf-rn-app
npx expo start --clear
```

## 6. Test Google Sign-In

1. Mở app
2. Vào màn hình đăng nhập
3. Click "Đăng nhập với Google"
4. Chọn tài khoản Google
5. Kiểm tra xem có đăng nhập thành công không

## 7. Troubleshooting

### Lỗi "Google Play Services not available"
- Đảm bảo thiết bị có Google Play Services
- Test trên thiết bị thật, không phải simulator

### Lỗi "Client ID không khớp"
- Kiểm tra Web Client ID trong .env
- Đảm bảo đã restart app sau khi thay đổi .env

### Lỗi "Package name không khớp"
- Kiểm tra package name trong app.json
- Đảm bảo package name khớp với Android credentials

## 8. Production Setup

1. Tạo keystore cho production
2. Lấy SHA-1 fingerprint từ keystore production
3. Thêm SHA-1 vào Android credentials
4. Cập nhật redirect URIs cho domain production
5. Test trên thiết bị production

## 9. Security Notes

- Không commit file .env vào git
- Sử dụng environment variables cho production
- Rotate credentials định kỳ
- Monitor usage trong Google Console
