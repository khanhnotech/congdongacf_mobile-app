import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useMyPosts } from '../../../hooks/usePosts';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import { formatDateTime, formatName } from '../../../utils/format';

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  public: 'Đã duyệt',
  approved: 'Đã duyệt',
  draft: 'Nháp',
  rejected: 'Bị từ chối',
};

export default function MyProfile() {
  const navigation = useNavigation();
  const { user, logout, logoutStatus } = useAuth();
  const myPostsQuery = useMyPosts();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    buttonPaddingVertical,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  const myPosts = myPostsQuery.data?.items ?? [];
  const isMyPostsLoading = myPostsQuery.isLoading;
  const myPostsError = myPostsQuery.error;

  const handleOpenPostDetail = (post) => {
    const postId =
      post?.articleId ??
      post?.article_id ??
      (post?.raw?.article_id ?? post?.raw?.id);
    const postSlug = post?.slug ?? post?.raw?.slug;
    if (!postId && !postSlug) {
      return;
    }
    navigation.navigate(ROUTES.STACK.POST_DETAIL, {
      postId,
      postSlug,
    });
  };

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: screenPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Bạn chưa đăng nhập. Hãy đăng nhập để xem hồ sơ.
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom / 2,
      }}
    >
      <View
        className="items-center bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Image
          source={{
            uri:
              user.avatar ??
              'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF',
          }}
          style={{
            height: 112,
            width: 112,
            borderRadius: 56,
            borderWidth: 4,
            borderColor: '#DC2626',
          }}
        />
        <Text
          className="font-bold text-slate-900"
          style={{ marginTop: gapSmall, fontSize: responsiveFontSize(24) }}
        >
          {formatName(user)}
        </Text>
        <Text
          className="text-slate-500"
          style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(14) }}
        >
          {user.email}
        </Text>
        <Text
          className="text-center text-slate-600"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          {user.bio}
        </Text>

        <View
          className="w-full flex-row justify-center"
          style={{ marginTop: gapMedium, gap: gapSmall }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.STACK.EDIT_PROFILE)}
            activeOpacity={0.85}
            className="flex-1 bg-red-500"
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
            }}
          >
            <Text
              className="text-center font-semibold text-white"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout().catch((error) => console.warn('Logout failed', error))}
            activeOpacity={0.85}
            className="flex-1 border border-slate-200"
            disabled={logoutStatus === 'pending'}
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
              opacity: logoutStatus === 'pending' ? 0.6 : 1,
            }}
          >
            <Text
              className="text-center font-semibold text-slate-600"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              {logoutStatus === 'pending' ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Hoạt động gần đây
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Danh sách bài viết/hoạt động bạn tham gia sẽ xuất hiện tại đây.
        </Text>

        {isMyPostsLoading ? (
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium }}
          >
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : myPostsError ? (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Không thể tải danh sách bài viết của bạn. Vui lòng thử lại sau.
          </Text>
        ) : myPosts.length ? (
          <View style={{ gap: gapSmall }}>
            {myPosts.map((post) => (
              <TouchableOpacity
                key={post.id ?? post.slug ?? `post-${Math.random()}`}
                activeOpacity={0.85}
                onPress={() => handleOpenPostDetail(post)}
                className="border border-slate-200 bg-slate-50"
                style={{
                  borderRadius: cardRadius,
                  padding: cardPadding,
                  gap: gapSmall / 2,
                }}
              >
                <Text
                  className="font-semibold text-slate-900"
                  style={{ fontSize: responsiveFontSize(16) }}
                >
                  {post.title || 'Bài viết không tiêu đề'}
                </Text>
                <Text
                  className="text-slate-500"
                  style={{ fontSize: responsiveFontSize(13) }}
                >
                  {formatDateTime(post.createdAt)}
                </Text>
                <View
                  className="self-start rounded-full bg-amber-100 px-3 py-1"
                >
                  <Text
                    className="text-sm font-semibold text-amber-700"
                  >
                    {STATUS_LABELS[post.status] ?? post.status ?? 'Không xác định'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Bạn chưa có bài viết nào.
          </Text>
        )}
      </View>
    </View>
  );
}

