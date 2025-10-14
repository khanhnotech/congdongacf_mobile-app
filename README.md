# ACF Community Mobile App

Ứng dụng di động cộng đồng ACF (Anti-Counterfeiting Foundation) - Hệ thống phòng chống hàng giả và bảo vệ người tiêu dùng Việt Nam.

## 📱 Tổng quan

Đây là ứng dụng React Native được xây dựng với Expo, cung cấp nền tảng cộng đồng cho các hoạt động phòng chống hàng giả, chia sẻ thông tin pháp lý, và kết nối các thành viên trong cộng đồng.

## 🚀 Tính năng chính

### 🏠 Trang chủ
- Hiển thị thông tin tổng quan về cộng đồng ACF
- Carousel các hoạt động nổi bật
- Danh sách bài viết mới nhất
- Bộ lọc theo chủ đề

### 📋 Hoạt động cộng đồng
- Danh sách các hoạt động thiện nguyện
- Chi tiết từng hoạt động
- Thông tin địa điểm và thời gian

### 📚 Văn bản pháp luật
- Thư viện các văn bản pháp lý
- Tìm kiếm và lọc theo chủ đề
- Xem chi tiết văn bản

### 🏷️ Chủ đề và bài viết
- Quản lý các chủ đề thảo luận
- Tạo và xem bài viết
- Tương tác (like, comment, share)

### 📸 Media Library
- Thư viện hình ảnh và video
- Xem và chia sẻ media

### 👤 Hồ sơ người dùng
- Quản lý thông tin cá nhân
- Xem hồ sơ thành viên khác
- Chỉnh sửa thông tin

## 🛠️ Công nghệ sử dụng

### Core Framework
- **React Native** 0.81.4
- **Expo** ~54.0.13
- **React** 19.1.0

### Navigation
- **@react-navigation/native** ^7.1.18
- **@react-navigation/bottom-tabs** ^7.4.8
- **@react-navigation/native-stack** ^7.3.27

### State Management
- **Zustand** ^5.0.8 (Global state)
- **@tanstack/react-query** ^5.90.2 (Server state)

### Styling
- **NativeWind** ^4.2.1 (Tailwind CSS cho React Native)
- **Tailwind CSS** ^3.4.18

### UI Components
- **@expo/vector-icons** (Material Community Icons)
- **react-native-safe-area-context** (Safe area handling)
- **react-native-gesture-handler** (Gesture handling)

## 📁 Cấu trúc dự án

```
src/
├── components/          # Components tái sử dụng
│   ├── EmptyState.js   # Component trạng thái rỗng
│   ├── LoadingSpinner.js # Component loading
│   ├── PostCard.js     # Card hiển thị bài viết
│   └── TopicChip.js    # Chip chủ đề
├── hooks/              # Custom hooks
│   ├── useAuth.js      # Hook xử lý authentication
│   ├── usePosts.js     # Hook quản lý posts
│   ├── useTopics.js    # Hook quản lý topics
│   └── ...
├── navigation/          # Cấu hình navigation
│   ├── RootNavigator.js # Navigator chính
│   ├── MainTabs.js     # Tab navigator
│   └── linking.js      # Deep linking config
├── screens/            # Các màn hình
│   ├── Home/           # Trang chủ
│   ├── Auth/           # Đăng nhập/đăng ký
│   ├── Activities/     # Hoạt động
│   ├── Legal/          # Văn bản pháp luật
│   ├── Topics/         # Chủ đề
│   ├── Media/          # Media library
│   ├── Profile/        # Hồ sơ
│   └── ...
├── services/           # API services
│   ├── api.js          # API client
│   ├── auth.service.js # Authentication service
│   ├── posts.service.js # Posts service
│   └── ...
├── store/              # Global state
│   └── auth.store.js   # Auth store (Zustand)
├── utils/              # Utilities
│   ├── constants.js    # Constants và routes
│   └── format.js       # Format functions
├── theme/              # Theme configuration
│   └── colors.js       # Color palette
└── i18n/               # Internationalization
    ├── en.json         # English translations
    └── vi.json         # Vietnamese translations
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18
- npm hoặc yarn
- Expo CLI
- Android Studio (cho Android)
- Xcode (cho iOS)

### Cài đặt dependencies
```bash
npm install
```

### Chạy dự án
```bash
# Khởi động Expo development server
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web
```

## 📱 Cấu hình

### Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
EXPO_PUBLIC_API_BASE=http://localhost:5000/api
```

### EAS Build Configuration
Dự án đã được cấu hình với EAS Build trong `eas.json`:
- **Development**: Development client
- **Preview**: Internal distribution
- **Production**: Auto-increment version

## 🎨 Design System

### Color Palette
```javascript
const palette = {
  primary: '#DC2626',      // Màu chính (đỏ)
  primaryLight: '#F87171', // Đỏ nhạt
  accent: '#F97316',       // Cam
  neutral: '#111827',      // Xám đậm
  background: '#F9FAFB',   // Nền
  surface: '#FFFFFF',      // Bề mặt
  border: '#E5E7EB',      // Viền
  muted: '#6B7280',       // Muted text
  success: '#16A34A',      // Xanh lá
  warning: '#EAB308',      // Vàng
  danger: '#B91C1C',       // Đỏ nguy hiểm
};
```

### Typography
- Sử dụng Tailwind CSS classes cho typography
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

## 🔧 API Integration

### API Client
Dự án sử dụng custom API client trong `src/services/api.js`:
- Base URL: `http://localhost:5000/api` (có thể thay đổi qua env)
- Methods: GET, POST, PUT, PATCH, DELETE
- Error handling tự động
- JSON response parsing

### Services
- **authService**: Xử lý authentication
- **postsService**: Quản lý bài viết
- **topicsService**: Quản lý chủ đề
- **activitiesService**: Quản lý hoạt động
- **legalService**: Quản lý văn bản pháp luật
- **mediaService**: Quản lý media

## 🧭 Navigation

### Route Structure
```javascript
const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  MAIN_TABS: 'MainTabs',
  TABS: {
    HOME: 'Home',
    ACTIVITIES: 'Activities',
    HUB: 'AcfHub',
    NOTIFICATIONS: 'Notifications',
    PROFILE: 'Profile',
  },
  STACK: {
    // Các màn hình stack
  }
};
```

### Deep Linking
Cấu hình deep linking trong `src/navigation/linking.js`:
- Prefixes: `acfcommunity://`, `https://acf-community.app`
- Screen mapping cho tất cả routes

## 🔐 Authentication

### Auth Flow
1. **Login/Register**: Sử dụng authService
2. **Token Management**: Lưu trong Zustand store
3. **Auto-hydration**: Tự động khôi phục session khi khởi động app
4. **Logout**: Clear token và invalidate queries

### Auth Store (Zustand)
```javascript
const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isInitialLoading: false,
  setAuth: ({ token, user }) => set({ token, user, isInitialLoading: false }),
  clearAuth: () => set({ token: null, user: null, isInitialLoading: false }),
}));
```

## 📊 State Management

### Global State (Zustand)
- **authStore**: Quản lý authentication state
- Lightweight và type-safe
- Persistence tự động

### Server State (React Query)
- **usePosts**: Quản lý posts data
- **useTopics**: Quản lý topics data
- **useActivities**: Quản lý activities data
- Auto-caching và background refetching

## 🌐 Internationalization

### Supported Languages
- **Vietnamese** (vi) - Default
- **English** (en)

### Usage
```javascript
import { t } from '../i18n';

// Sử dụng
const title = t('welcome.title', 'vi');
```

## 📱 Platform Support

### iOS
- Minimum iOS version: 13.0
- Supports tablets
- Safe area handling
- Native navigation

### Android
- Minimum API level: 21
- Edge-to-edge enabled
- Adaptive icon support
- Material Design components

### Web
- Responsive design
- PWA capabilities
- Favicon support

## 🚀 Deployment

### EAS Build
```bash
# Build for development
eas build --profile development

# Build for preview
eas build --profile preview

# Build for production
eas build --profile production
```

### App Store Submission
```bash
# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## 🧪 Development

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript support (optional)

### Testing
- Unit tests với Jest
- Integration tests
- E2E tests với Detox (có thể thêm)

## 📝 Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho cộng đồng ACF - Anti-Counterfeiting Foundation.

## 📞 Liên hệ

- **Website**: https://acf-community.app
- **Email**: support@acf-community.app
- **Community**: Cộng đồng ACF Việt Nam

---

**Lưu ý**: Đây là phiên bản demo với mock data. Để sử dụng trong production, cần tích hợp với backend API thực tế.
