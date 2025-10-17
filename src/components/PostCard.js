import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';
import { formatDateTime } from '../utils/format';
import { ROUTES } from '../utils/constants';

export default function PostCard({ post, onPress }) {
  if (!post) return null;

  const navigation = useNavigation();
  const {
    cardPadding,
    cardRadius,
    responsiveFontSize,
    responsiveSpacing,
    gapSmall,
    gapMedium,
    chipPaddingHorizontal,
    chipPaddingVertical,
    gapLarge: spacingGapLarge,
  } = useResponsiveSpacing();

  const initials =
    post.author
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AC';

  const previewLimit = 150;
  const excerpt = post.excerpt ?? '';
  const shouldClamp = excerpt.length > previewLimit;
  const previewText = shouldClamp ? `${excerpt.slice(0, previewLimit)}...` : excerpt;

  const handlePress = () => {
    if (onPress) {
      onPress(post);
      return;
    }

    if (post.id) {
      navigation.navigate(ROUTES.STACK.POST_DETAIL, { postId: post.id });
    }
  };

  const gapLarge = spacingGapLarge ?? gapMedium * 1.6;
  const avatarSize = responsiveSpacing(42, { min: 36, max: 52 });
  const pillHorizontal = Math.max(chipPaddingHorizontal + 2, 14);
  const pillVertical = Math.max(chipPaddingVertical - 1, 8);
  const coverHeight = responsiveSpacing(210, { min: 160, max: 260 });
  const iconSize = responsiveFontSize(16, { min: 14, max: 20 });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="border border-red-100 bg-white shadow-sm"
      style={{
        padding: cardPadding,
        borderRadius: cardRadius,
        marginBottom: gapLarge,
      }}
    >
      <View
        className="flex-row items-center"
        style={{ gap: gapSmall }}
      >
        <View
          className="items-center justify-center bg-slate-200"
          style={{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
          }}
        >
          <Text
            className="font-semibold text-slate-700"
            style={{ fontSize: responsiveFontSize(13) }}
          >
            {initials}
          </Text>
        </View>
        <View className="flex-1">
          <Text
            className="font-semibold text-red-600"
            style={{ fontSize: responsiveFontSize(14, { min: 12 }) }}
          >
            {post.author}
          </Text>
          <Text
            className="text-slate-400"
            style={{ fontSize: responsiveFontSize(12, { min: 10 }) }}
          >
            {formatDateTime(post.createdAt)}
          </Text>
        </View>
      </View>

      <Text
        className="font-bold text-red-600"
        style={{ marginTop: gapMedium, fontSize: responsiveFontSize(18) }}
      >
        {post.title}
      </Text>
      <Text
        className="text-slate-600"
        style={{
          marginTop: gapSmall,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18, max: 24 }),
        }}
      >
        {previewText}{' '}
        {shouldClamp ? (
          <Text
            className="font-semibold text-red-600"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Xem thêm
          </Text>
        ) : null}
      </Text>

      {post.cover ? (
        <View
          className="overflow-hidden border border-slate-100"
          style={{
            marginTop: gapMedium,
            borderRadius: cardRadius,
          }}
        >
          <Image
            source={{ uri: post.cover }}
            style={{
              width: '100%',
              height: coverHeight,
            }}
          />
        </View>
      ) : null}

      <View
        className="flex-row"
        style={{
          marginTop: gapMedium,
          flexWrap: 'wrap',
          marginHorizontal: -(gapSmall / 2),
        }}
      >
        <PostCardAction
          icon="heart-outline"
          label="Thích"
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
        <PostCardAction
          icon="comment-outline"
          label="Bình luận"
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
        <PostCardAction
          icon="share-variant"
          label="Chia sẻ"
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
      </View>
    </TouchableOpacity>
  );
}

function PostCardAction({
  icon,
  label,
  iconSize,
  style,
  chipPadding,
  radius,
  gap,
  responsiveFontSize,
}) {
  const { responsiveSpacing } = useResponsiveSpacing();
  const minWidth = responsiveSpacing(108, { min: 92, max: 140 });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center border border-red-200 bg-white"
      style={[
        {
          gap: gap / 1.4,
          borderRadius: radius,
          paddingHorizontal: chipPadding.horizontal,
          paddingVertical: chipPadding.vertical,
          flexGrow: 1,
          flexShrink: 1,
          minWidth,
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={iconSize} color="#DC2626" />
      <Text
        className="font-medium text-red-600"
        style={{ fontSize: responsiveFontSize(13) }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
