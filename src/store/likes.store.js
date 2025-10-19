import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const memoryStorage = () => {
  const store = new Map();
  return {
    getItem: async (name) => {
      if (store.has(name)) {
        return store.get(name);
      }
      return null;
    },
    setItem: async (name, value) => {
      store.set(name, value);
    },
    removeItem: async (name) => {
      store.delete(name);
    },
  };
};

let asyncStorageInstance;
try {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  asyncStorageInstance = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('[likes.store] AsyncStorage unavailable, falling back to in-memory storage.', error);
  asyncStorageInstance = null;
}

const storage = createJSONStorage(() => asyncStorageInstance ?? memoryStorage());

const ensureUserKey = (userKey) => {
  if (!userKey) {
    throw new Error('userKey is required');
  }
  return String(userKey);
};

export const useLikesStore = create(
  persist(
    (set, get) => ({
      hydrated: false,
      likedByUser: {},
      setHydrated: () => set({ hydrated: true }),
      setLikedStatus: (userKey, articleId, liked) => {
        if (!articleId) return;
        try {
          const safeUserKey = ensureUserKey(userKey);
          const articleKey = String(articleId);
          set((state) => {
            const currentUserMap = state.likedByUser[safeUserKey] ?? {};
            const nextUserMap = { ...currentUserMap };
            if (liked) {
              if (currentUserMap[articleKey]) {
                return {};
              }
              nextUserMap[articleKey] = true;
            } else {
              if (!currentUserMap[articleKey]) {
                return {};
              }
              delete nextUserMap[articleKey];
            }
            return {
              likedByUser: {
                ...state.likedByUser,
                [safeUserKey]: nextUserMap,
              },
            };
          });
        } catch {
          // ignore missing user key
        }
      },
      bulkSyncForUser: (userKey, articleIds) => {
        try {
          const safeUserKey = ensureUserKey(userKey);
          const nextMap = {};
          for (const id of articleIds ?? []) {
            if (id === undefined || id === null) continue;
            nextMap[String(id)] = true;
          }
          set((state) => ({
            likedByUser: {
              ...state.likedByUser,
              [safeUserKey]: nextMap,
            },
          }));
        } catch {
          // ignore missing user key
        }
      },
      clearUserLikes: (userKey) => {
        try {
          const safeUserKey = ensureUserKey(userKey);
          set((state) => {
            if (!state.likedByUser[safeUserKey]) return {};
            const next = { ...state.likedByUser };
            delete next[safeUserKey];
            return { likedByUser: next };
          });
        } catch {
          // ignore missing user key
        }
      },
    }),
    {
      name: 'acf-liked-articles',
      storage,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.();
      },
    },
  ),
);
