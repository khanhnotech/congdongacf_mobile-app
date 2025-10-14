import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ActivitiesList from '../screens/Activities/ActivitiesList';
import ActivityDetail from '../screens/Activities/ActivityDetail';
import LegalList from '../screens/Legal/LegalList';
import LegalDetail from '../screens/Legal/LegalDetail';
import TopicsGrid from '../screens/Topics/TopicsGrid';
import TopicPosts from '../screens/Topics/TopicPosts';
import MediaList from '../screens/Media/MediaList';
import MediaViewer from '../screens/Media/MediaViewer';
import ContactForm from '../screens/Contact/ContactForm';
import MyProfile from '../screens/Profile/MyProfile';
import EditProfile from '../screens/Profile/EditProfile';
import ProfileView from '../screens/User/ProfileView';
import CreatePost from '../screens/Post/CreatePost';
import PostDetail from '../screens/Post/PostDetail';
import { ROUTES } from '../utils/constants';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN_TABS}
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
        component={ActivitiesList}
        options={{ headerShown: true, title: 'Hoạt động cộng đồng' }}
      />
    </Stack.Navigator>
  );
}
