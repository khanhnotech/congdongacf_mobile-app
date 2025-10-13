const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const topics = [
  { id: 'topic-1', name: 'Tin tức', color: '#0ea5e9' },
  { id: 'topic-2', name: 'Hoạt động', color: '#22c55e' },
  { id: 'topic-3', name: 'Pháp lý', color: '#f59e0b' },
  { id: 'topic-4', name: 'Chia sẻ', color: '#6366f1' },
];

export const topicsService = {
  async listTopics() {
    await delay();
    return topics;
  },
};
