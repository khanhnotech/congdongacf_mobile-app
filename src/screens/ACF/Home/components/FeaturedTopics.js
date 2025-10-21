import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTopics } from '../../../../hooks/useTopics';
import { useResponsiveSpacing } from '../../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../../utils/constants';

export default function FeaturedTopics() {
  const navigation = useNavigation();
  const { listQuery } = useTopics();
  const spacing = useResponsiveSpacing();
  const {
    screenPadding,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
  } = spacing;

  const topics = listQuery.data?.items ?? [];
  const featuredTopics = topics.slice(0, 6); // Hiển thị 6 chủ đề đầu tiên

  const handleViewAll = () => {
    navigation.navigate(ROUTES.STACK.TOPICS_GRID);
  };

  const handleTopicPress = (topic) => {
    navigation.navigate(ROUTES.STACK.TOPIC_POSTS, {
      topicId: topic.id,
      topicSlug: topic.slug,
    });
  };

  const renderTopicItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleTopicPress(item)}
      className="bg-white shadow-sm"
      style={{
        borderRadius: cardRadius,
        padding: cardPadding * 0.8,
        marginRight: gapSmall,
        minWidth: 120,
        borderLeftWidth: 4,
        borderColor: item.color || '#DC2626',
      }}
      activeOpacity={0.85}
    >
      <Text
        className="font-semibold text-slate-900"
        style={{ fontSize: responsiveFontSize(14) }}
        numberOfLines={2}
      >
        {item.name}
      </Text>
      <Text
        className="text-slate-500"
        style={{ 
          fontSize: responsiveFontSize(12),
          marginTop: 4,
        }}
        numberOfLines={1}
      >
        {item.description || 'Chủ đề cộng đồng'}
      </Text>
      {item.article_count > 0 && (
        <Text
          className="text-slate-400"
          style={{ 
            fontSize: responsiveFontSize(10),
            marginTop: 2,
          }}
        >
          {item.article_count} bài viết
        </Text>
      )}
    </TouchableOpacity>
  );

  if (listQuery.isLoading) {
    return (
      <View style={{ paddingHorizontal: screenPadding }}>
        <Text
          className="font-bold text-slate-900"
          style={{ 
            marginBottom: gapSmall, 
            fontSize: responsiveFontSize(20) 
          }}
        >
          Chủ đề nổi bật
        </Text>
        <Text
          className="text-slate-500"
          style={{ 
            marginBottom: gapMedium,
            fontSize: responsiveFontSize(14) 
          }}
        >
          Đang tải...
        </Text>
      </View>
    );
  }

  if (!featuredTopics.length) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: screenPadding }}>
      <View 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: gapSmall 
        }}
      >
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(20) }}
        >
          Chủ đề nổi bật
        </Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text
            className="text-red-500 font-medium"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text
        className="text-slate-500"
        style={{ 
          marginBottom: gapMedium,
          fontSize: responsiveFontSize(14) 
        }}
      >
        Khám phá các chủ đề được quan tâm nhiều nhất
      </Text>

      <FlatList
        data={featuredTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderTopicItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: screenPadding }}
      />
    </View>
  );
}
