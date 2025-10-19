export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  MAIN_TABS: 'MainTabs',
  TABS: {
    HOME: 'Home',
    PORTAL: 'Portal',
    ACTIVITIES: 'Activities',
    HUB: 'AcfHub',
    NOTIFICATIONS: 'Notifications',
    PROFILE: 'Profile',
    LEGAL: 'Legal',
    TOPICS: 'Topics',
    MEDIA: 'Media',
  },
  STACK: {
    ACTIVITY_DETAIL: 'ActivityDetail',
    LEGAL_DETAIL: 'LegalDetail',
    TOPIC_POSTS: 'TopicPosts',
    MEDIA_VIEWER: 'MediaViewer',
    PROFILE_VIEW: 'ProfileView',
    CREATE_POST: 'CreatePost',
    CONTACT_FORM: 'ContactForm',
    EDIT_PROFILE: 'EditProfile',
    POST_DETAIL: 'PostDetail',
    LEGAL_LIST: 'LegalList',
    TOPICS_GRID: 'TopicsGrid',
    MEDIA_LIBRARY: 'MediaLibrary',
    PORTAL: 'Portal',
  },
};

export const TAB_ORDER = [
  ROUTES.TABS.HOME,
  ROUTES.TABS.PORTAL,
  ROUTES.TABS.ACTIVITIES,
  ROUTES.TABS.HUB,
  ROUTES.TABS.NOTIFICATIONS,
  ROUTES.TABS.PROFILE,
];

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  POSTS: {
    LIST: ['posts'],
    DETAIL: (id) => ['posts', id],
    TREND: ['posts', 'trend'],
  },
  TOPICS: {
    LIST: ['topics'],
    POSTS: (topicId) => ['topics', topicId, 'posts'],
  },
  ACTIVITIES: {
    LIST: ['activities'],
    DETAIL: (id) => ['activities', id],
  },
  LEGAL: {
    LIST: ['legal'],
    DETAIL: (id) => ['legal', id],
  },
  MEDIA: {
    LIST: ['media'],
    DETAIL: (id) => ['media', id],
  },
  EVENTS: {
    LIST: ['events'],
    DETAIL: (id) => ['events', id],
  },
};

export const DEFAULT_PAGE_SIZE = 20;
