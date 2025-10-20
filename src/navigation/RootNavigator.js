import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Login from '../screens/ACF/Auth/Login';
import Register from '../screens/ACF/Auth/Register';
import ForgotPassword from '../screens/ACF/Auth/ForgotPassword';
import ActivitiesListScreen from '../screens/ACF/Activities/ActivitiesList';
import ActivityDetail from '../screens/ACF/Activities/ActivityDetail';
import EventDetail from '../screens/ACF/Notifications/EventDetail';
import LegalList from '../screens/ACF/Legal/LegalList';
import LegalDetail from '../screens/ACF/Legal/LegalDetail';
import TopicsGrid from '../screens/ACF/Topics/TopicsGrid';
import TopicPosts from '../screens/ACF/Topics/TopicPosts';
import MediaList from '../screens/ACF/Media/MediaList';
import MediaViewer from '../screens/ACF/Media/MediaViewer';
import ContactForm from '../screens/ACF/Contact/ContactForm';
import MyProfile from '../screens/ACF/Profile/MyProfile';
import EditProfile from '../screens/ACF/Profile/EditProfile';
import ProfileView from '../screens/ACF/User/ProfileView';
import CreatePost from '../screens/ACF/Post/CreatePost';
import PostDetail from '../screens/ACF/Post/PostDetail';
import PortalScreen from '../screens/Portal/PortalScreen';
import { ROUTES } from '../utils/constants';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.STACK.PORTAL}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen name={ROUTES.AUTH.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.AUTH.REGISTER} component={Register} />
      <Stack.Screen name={ROUTES.AUTH.FORGOT_PASSWORD} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabs} />
      <Stack.Screen
        name={ROUTES.STACK.ACTIVITY_DETAIL}
        component={ActivityDetail}
        options={{ headerShown: true, title: 'Chi tiết hoạt động' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.EVENT_DETAIL}
        component={EventDetail}
        options={{ headerShown: true, title: 'Chi tiết sự kiện' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.LEGAL_LIST}
        component={LegalList}
        options={{ headerShown: true, title: 'Văn bản pháp luật' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.LEGAL_DETAIL}
        component={LegalDetail}
        options={{ headerShown: true, title: 'Chi tiết văn bản' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.TOPICS_GRID}
        component={TopicsGrid}
        options={{ headerShown: true, title: 'Chủ đề' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.TOPIC_POSTS}
        component={TopicPosts}
        options={{ headerShown: true, title: 'Bài viết theo chủ đề' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.MEDIA_LIBRARY}
        component={MediaList}
        options={{ headerShown: true, title: 'Media' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.MEDIA_VIEWER}
        component={MediaViewer}
        options={{ headerShown: true, title: 'Xem media' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.CONTACT_FORM}
        component={ContactForm}
        options={{ headerShown: true, title: 'Liên hệ' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.EDIT_PROFILE}
        component={EditProfile}
        options={{ headerShown: true, title: 'Chỉnh sửa hồ sơ' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.PROFILE_VIEW}
        component={ProfileView}
        options={{ headerShown: true, title: 'Hồ sơ thành viên' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.CREATE_POST}
        component={CreatePost}
        options={{ headerShown: true, title: 'Tạo bài viết' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.POST_DETAIL}
        component={PostDetail}
        options={{ headerShown: true, title: 'Chi tiết bài viết' }}
      />
      <Stack.Screen
        name="MyProfileModal"
        component={MyProfile}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ActivitiesList"
        component={ActivitiesListScreen}
        options={{ headerShown: true, title: 'Hoạt động cộng đồng' }}
      />
      <Stack.Screen
        name={ROUTES.STACK.PORTAL}
        component={PortalScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
