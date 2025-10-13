const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const mediaLibrary = [
  {
    id: 'media-1',
    title: 'Khoảnh khắc thiện nguyện',
    type: 'image',
    url: 'https://dummyimage.com/1024x576/0f766e/ffffff&text=Media+1',
    thumbnail:
      'https://dummyimage.com/320x180/0f766e/ffffff&text=Media+1',
  },
  {
    id: 'media-2',
    title: 'Video tổng kết hoạt động',
    type: 'video',
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail:
      'https://dummyimage.com/320x180/7c3aed/ffffff&text=Media+2',
  },
];

export const mediaService = {
  async listMedia() {
    await delay();
    return mediaLibrary;
  },
  async getMedia(id) {
    await delay();
    return mediaLibrary.find((item) => item.id === id) ?? null;
  },
};
