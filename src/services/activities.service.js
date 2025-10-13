const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const activities = [
  {
    id: 'activity-1',
    title: 'Phát quà trung thu',
    location: 'Quận 7, TP. HCM',
    date: '2025-09-05T10:00:00Z',
    summary: 'Chương trình phát quà cho 200 trẻ em nghèo.',
  },
  {
    id: 'activity-2',
    title: 'Ngày hội việc làm',
    location: 'Quận 1, TP. HCM',
    date: '2025-11-12T08:30:00Z',
    summary: 'Kết nối doanh nghiệp và người lao động trẻ.',
  },
];

export const activitiesService = {
  async listActivities() {
    await delay();
    return activities;
  },
  async getActivity(id) {
    await delay();
    return activities.find((item) => item.id === id) ?? null;
  },
};
