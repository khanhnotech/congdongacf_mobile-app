import { ROUTES } from '../utils/constants';

export const linking = {
  prefixes: ['acfcommunity://', 'https://acf-community.app'],
  config: {
    screens: {
      [ROUTES.AUTH.LOGIN]: 'login',
      [ROUTES.AUTH.REGISTER]: 'register',
      [ROUTES.AUTH.FORGOT_PASSWORD]: 'forgot-password',
      [ROUTES.MAIN_TABS]: {
        path: '',
        screens: {
          [ROUTES.TABS.HOME]: 'home',
          [ROUTES.TABS.LATEST]: 'article/new',
          [ROUTES.TABS.ACTIVITIES]: 'activities',
          [ROUTES.TABS.HUB]: 'hub',
          [ROUTES.TABS.NOTIFICATIONS]: 'notifications',
          [ROUTES.TABS.PROFILE]: 'profile',
        },
      },
      [ROUTES.STACK.LEGAL_LIST]: 'legal',
      [ROUTES.STACK.ACTIVITY_DETAIL]: 'activities/:id',
      [ROUTES.STACK.EVENT_DETAIL]: 'event/:eventId',
      [ROUTES.STACK.LEGAL_DETAIL]: 'legal/:id',
      [ROUTES.STACK.TOPICS_GRID]: 'topics',
      [ROUTES.STACK.TOPIC_POSTS]: 'topics/:id',
      [ROUTES.STACK.MEDIA_LIBRARY]: 'media',
      [ROUTES.STACK.MEDIA_VIEWER]: 'media/:id',
      [ROUTES.STACK.PROFILE_VIEW]: 'user/:id',
      [ROUTES.STACK.CREATE_POST]: 'posts/new',
      [ROUTES.STACK.POST_DETAIL]: 'articles/slug/:postSlug',
    },
  },
};
