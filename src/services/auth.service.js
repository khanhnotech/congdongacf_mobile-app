const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUser = {
  id: 'user-1',
  email: 'demo@acf-community.app',
  firstName: 'Demo',
  lastName: 'User',
  avatar:
    'https://dummyimage.com/128x128/0f172a/ffffff&text=DU',
  bio: 'Thành viên cộng đồng ACF - hãy chỉnh sửa hồ sơ của bạn.',
};

export const authService = {
  async login(credentials) {
    console.log('authService.login', credentials);
    await delay();
    return { token: 'demo-token', user: mockUser };
  },
  async register(payload) {
    console.log('authService.register', payload);
    await delay();
    return { token: 'demo-token', user: mockUser };
  },
  async me() {
    await delay();
    return mockUser;
  },
  async forgotPassword(payload) {
    console.log('authService.forgotPassword', payload);
    await delay();
    return true;
  },
  async updateProfile(changes) {
    console.log('authService.updateProfile', changes);
    await delay();
    return { ...mockUser, ...changes };
  },
  async logout() {
    await delay();
    return true;
  },
};
