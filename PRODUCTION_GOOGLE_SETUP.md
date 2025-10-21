# Hướng dẫn Google Login cho Production Deployment

## 🚀 **Khi deploy lên production, cần chỉnh sửa:**

### 1. **Google Console Configuration**

**Cập nhật Redirect URIs:**
```
# Development (hiện tại)
acf-rn-app://auth

# Production (cần thêm)
https://yourdomain.com/auth
https://yourapp.com/auth
```

**Cập nhật Authorized JavaScript Origins:**
```
# Development
http://localhost:3000
http://localhost:8081

# Production (cần thêm)
https://yourdomain.com
https://yourapp.com
```

### 2. **Environment Variables**

**Development (.env):**
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-dev.apps.googleusercontent.com
```

**Production (.env.production):**
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-prod.apps.googleusercontent.com
```

### 3. **Server Configuration**

**Cập nhật server/.env:**
```env
# Development
GOOGLE_CLIENT_ID=123456789-dev.apps.googleusercontent.com

# Production
GOOGLE_CLIENT_ID=123456789-prod.apps.googleusercontent.com
```

### 4. **Expo Configuration**

**app.json - Production:**
```json
{
  "expo": {
    "scheme": "yourapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## 🔧 **Các bước chuẩn bị cho Production:**

### **Bước 1: Tạo Production OAuth Credentials**

1. **Google Console:**
   - Tạo OAuth 2.0 Client ID mới cho production
   - Đặt tên: `ACF Mobile App - Production`
   - **Authorized redirect URIs:**
     - `https://yourdomain.com/auth`
     - `yourapp://auth`
   - **Authorized JavaScript Origins:**
     - `https://yourdomain.com`

### **Bước 2: Cập nhật App Configuration**

**Expo Build Configuration:**
```json
{
  "expo": {
    "scheme": "yourapp",
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "googleWebClientId": "production_client_id_here"
    }
  }
}
```

### **Bước 3: Server Production Setup**

**CORS Configuration:**
```javascript
// server/src/middlewares/cors.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'https://yourdomain.com',
  'https://yourapp.com'
];
```

**Environment Variables:**
```env
# Production
NODE_ENV=production
GOOGLE_CLIENT_ID=your_production_client_id
API_URL=https://yourdomain.com/api
```

### **Bước 4: Expo Build Configuration**

**EAS Build (nếu sử dụng):**
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "production_client_id"
      }
    }
  }
}
```

## 📱 **Platform-specific Configuration:**

### **iOS (App Store):**
- **Bundle ID**: Phải khớp với Google Console
- **URL Scheme**: `yourapp://auth`
- **Associated Domains**: `yourapp.com`

### **Android (Play Store):**
- **Package Name**: Phải khớp với Google Console
- **SHA-1 Fingerprint**: Lấy từ production keystore
- **Deep Links**: `yourapp://auth`

### **Web (PWA):**
- **Domain**: Phải được verify trong Google Console
- **HTTPS**: Bắt buộc cho production
- **Service Worker**: Cấu hình offline support

## 🔐 **Security Considerations:**

### **Production Security:**
1. **HTTPS Only**: Tất cả traffic phải qua HTTPS
2. **Domain Verification**: Verify domain trong Google Console
3. **Credential Rotation**: Thay đổi credentials định kỳ
4. **Rate Limiting**: Giới hạn số lần đăng nhập
5. **Audit Logs**: Log tất cả hoạt động đăng nhập

### **Environment Separation:**
```javascript
// config/environment.js
const config = {
  development: {
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID_DEV,
    apiUrl: 'http://localhost:3000/api'
  },
  production: {
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID_PROD,
    apiUrl: 'https://yourdomain.com/api'
  }
};
```

## 🚀 **Deployment Checklist:**

### **Pre-deployment:**
- [ ] Tạo production OAuth credentials
- [ ] Cập nhật redirect URIs
- [ ] Cấu hình domain verification
- [ ] Test trên staging environment
- [ ] Kiểm tra HTTPS certificate

### **Post-deployment:**
- [ ] Test Google login trên production
- [ ] Kiểm tra logs server
- [ ] Monitor error rates
- [ ] Test trên các platform khác nhau
- [ ] Backup credentials

## 🔍 **Troubleshooting Production:**

### **Common Issues:**
1. **"Invalid redirect URI"**: Kiểm tra redirect URI trong Google Console
2. **"Client ID mismatch"**: Kiểm tra environment variables
3. **"Domain not verified"**: Verify domain trong Google Console
4. **"HTTPS required"**: Đảm bảo sử dụng HTTPS

### **Debug Commands:**
```bash
# Check environment variables
echo $EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

# Test API endpoint
curl -X POST https://yourdomain.com/api/auth/google

# Check server logs
tail -f /var/log/your-app.log
```

## 📊 **Monitoring:**

### **Metrics to Track:**
- Google login success rate
- Error rates by platform
- User conversion funnel
- API response times

### **Alerts:**
- High error rates
- Failed authentication attempts
- Unusual traffic patterns
- Server downtime

## 🎯 **Kết luận:**

**Google login hiện tại sẽ hoạt động tốt cho production** với những điều chỉnh:

1. ✅ **Cập nhật Redirect URIs** cho production domain
2. ✅ **Tạo production OAuth credentials** riêng biệt
3. ✅ **Cấu hình environment variables** cho production
4. ✅ **Đảm bảo HTTPS** cho tất cả traffic
5. ✅ **Test thoroughly** trước khi go-live

**Không cần thay đổi code** - chỉ cần cấu hình environment và credentials!
