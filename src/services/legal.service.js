const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const legalDocs = [
  {
    id: 'legal-1',
    title: 'Quy chế hoạt động cộng đồng',
    description: 'Những nguyên tắc cần tuân thủ khi tham gia ACF.',
    publishedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'legal-2',
    title: 'Quy định bảo vệ dữ liệu cá nhân',
    description: 'Chính sách về quyền riêng tư và bảo vệ dữ liệu.',
    publishedAt: '2025-01-15T00:00:00Z',
  },
];

export const legalService = {
  async listDocuments() {
    await delay();
    return legalDocs;
  },
  async getDocument(id) {
    await delay();
    return legalDocs.find((doc) => doc.id === id) ?? null;
  },
};
