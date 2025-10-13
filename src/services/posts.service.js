const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const posts = [
  {
    id: 'post-1',
    title: 'Chào mừng đến với cộng đồng ACF',
    excerpt: 'Hãy tham gia và chia sẻ hoạt động cộng đồng của bạn.',
    author: 'Ban điều hành',
    createdAt: '2025-01-05T08:00:00Z',
    topicId: 'topic-1',
    cover:
      'https://dummyimage.com/800x400/3b82f6/ffffff&text=ACF+Community',
  },
  {
    id: 'post-2',
    title: 'Thông báo hoạt động thiện nguyện tháng này',
    excerpt: 'Cập nhật kế hoạch phát quà tại các xã vùng cao.',
    author: 'Ban hoạt động',
    createdAt: '2025-01-10T10:30:00Z',
    topicId: 'topic-2',
    cover:
      'https://dummyimage.com/800x400/22c55e/ffffff&text=ACF+Activities',
  },
];

export const postsService = {
  async listPosts() {
    await delay();
    return posts;
  },
  async getPost(id) {
    await delay();
    return posts.find((post) => post.id === id) ?? null;
  },
  async createPost(payload) {
    console.log('postsService.createPost', payload);
    await delay();
    const newPost = {
      ...payload,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return newPost;
  },
};
