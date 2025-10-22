import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLegal } from '../../../hooks/useLegal';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDate } from '../../../utils/format';

export default function LegalDetail() {
  const route = useRoute();
  const { documentId } = route.params ?? {};
  const { detailQuery } = useLegal(documentId);
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải tài liệu..." />;
  }

  const document = detailQuery.data;

  if (!document) {
    return (
      <View className="flex-1 items-center justify-center bg-white" style={{ padding: cardPadding }}>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Không tìm thấy tài liệu.
        </Text>
      </View>
    );
  }

  // Parse content into sections
  const parseContent = (content) => {
    if (!content) return [];
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentSubsection = null;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if line is a main section header (Roman numerals)
      const isMainSectionHeader = /^[IVX]+\./.test(trimmedLine);
      // Check if line is a subsection header (text without numbers at start)
      const isSubSectionHeader = /^[A-Za-zÀ-ỹ\s&\-]+:?$/.test(trimmedLine) && 
                                 !/^\d+\./.test(trimmedLine) && 
                                 !/^[IVX]+\./.test(trimmedLine) &&
                                 trimmedLine.length > 5; // Avoid short lines
      // Check if line is a numbered item (1., 2., 3., 4.)
      const isNumberedItem = /^\d+\./.test(trimmedLine);
      
      if (isMainSectionHeader) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine,
          content: [],
          subsections: [],
          type: 'section'
        };
        currentSubsection = null;
      } else if (isSubSectionHeader) {
        // This is a subsection (like "Sứ mệnh:", "Truyền thông - Tuyên truyền - Giáo dục")
        if (currentSection) {
          currentSection.subsections.push({
            title: trimmedLine,
            content: [],
            items: [],
            type: 'subsection'
          });
          currentSubsection = currentSection.subsections[currentSection.subsections.length - 1];
        }
      } else if (isNumberedItem) {
        // This is a numbered item (1., 2., 3., 4.)
        if (currentSubsection) {
          currentSubsection.items.push({
            title: trimmedLine,
            content: [],
            type: 'item'
          });
        } else if (currentSection) {
          // If no subsection, add to section content
          currentSection.content.push(trimmedLine);
        }
      } else if (currentSection) {
        // Add content to current section, subsection, or item
        if (currentSubsection && currentSubsection.items.length > 0) {
          // Add to last item
          currentSubsection.items[currentSubsection.items.length - 1].content.push(trimmedLine);
        } else if (currentSubsection) {
          // Add to subsection content
          currentSubsection.content.push(trimmedLine);
        } else {
          // Add to main section content
          currentSection.content.push(trimmedLine);
        }
      } else {
        // If no section started yet, create a default one
        if (sections.length === 0) {
          sections.push({
            title: 'Nội dung',
            content: [trimmedLine],
            subsections: [],
            type: 'section'
          });
        } else {
          sections[sections.length - 1].content.push(trimmedLine);
        }
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const sections = parseContent(document.content);

  return (
    <View className="flex-1 bg-white">
      {/* Red Header */}
      <View 
        className="bg-red-600"
        style={{
          paddingTop: statusBarOffset + verticalPadding,
          paddingBottom: verticalPadding,
          paddingHorizontal: screenPadding,
        }}
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons 
            name="information-outline" 
            size={responsiveFontSize(24)} 
            color="white" 
            style={{ marginRight: gapSmall }}
          />
          <Text
            className="font-bold text-white"
            style={{ 
              fontSize: responsiveFontSize(18),
              flex: 1,
            }}
            numberOfLines={2}
          >
            {document.title}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: screenPadding,
          paddingTop: gapMedium,
          paddingBottom: listContentPaddingBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <Text
          className="text-slate-600 mb-4"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          {document.description}
        </Text>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={{ marginBottom: gapMedium }}>
            {/* Section Title */}
            <Text
              className="font-bold text-red-600 mb-3"
              style={{
                fontSize: responsiveFontSize(16),
                lineHeight: responsiveFontSize(22, { min: 20 }),
              }}
            >
              {section.title}
            </Text>
            
            {/* Section Content */}
            <View style={{ paddingLeft: gapSmall }}>
              {section.content.map((line, lineIndex) => {
                // Check if line is a bullet point
                const isBulletPoint = /^[•\-\*]\s/.test(line);
                const isSubBullet = /^\s+[•\-\*]\s/.test(line);
                
                if (isBulletPoint || isSubBullet) {
                  return (
                    <View key={lineIndex} className="flex-row mb-1" style={{ paddingLeft: isSubBullet ? gapMedium : 0 }}>
                      <Text className="text-red-600 mr-2" style={{ fontSize: responsiveFontSize(14) }}>
                        •
                      </Text>
                      <Text
                        className="text-slate-700 flex-1"
                        style={{
                          fontSize: responsiveFontSize(14),
                          lineHeight: responsiveFontSize(20, { min: 18 }),
                        }}
                      >
                        {line.replace(/^[•\-\*]\s/, '')}
                      </Text>
                    </View>
                  );
                }
                
                return (
                  <Text
                    key={lineIndex}
                    className="text-slate-700 mb-2"
                    style={{
                      fontSize: responsiveFontSize(14),
                      lineHeight: responsiveFontSize(20, { min: 18 }),
                    }}
                  >
                    {line}
                  </Text>
                );
              })}
            </View>

            {/* Subsections */}
            {section.subsections && section.subsections.map((subsection, subIndex) => (
              <View key={subIndex} style={{ marginTop: gapSmall, marginBottom: gapSmall }}>
                {/* Subsection Title */}
                <Text
                  className="font-semibold text-red-500 mb-2"
                  style={{
                    fontSize: responsiveFontSize(15),
                    lineHeight: responsiveFontSize(20, { min: 18 }),
                    paddingLeft: gapSmall,
                  }}
                >
                  {subsection.title}
                </Text>
                
                {/* Subsection Content */}
                <View style={{ paddingLeft: gapMedium }}>
                  {subsection.content.map((line, lineIndex) => {
                    // Check if line is a bullet point
                    const isBulletPoint = /^[•\-\*]\s/.test(line);
                    const isSubBullet = /^\s+[•\-\*]\s/.test(line);
                    
                    if (isBulletPoint || isSubBullet) {
                      return (
                        <View key={lineIndex} className="flex-row mb-1" style={{ paddingLeft: isSubBullet ? gapMedium : 0 }}>
                          <Text className="text-red-500 mr-2" style={{ fontSize: responsiveFontSize(13) }}>
                            •
                          </Text>
                          <Text
                            className="text-slate-600 flex-1"
                            style={{
                              fontSize: responsiveFontSize(13),
                              lineHeight: responsiveFontSize(18, { min: 16 }),
                            }}
                          >
                            {line.replace(/^[•\-\*]\s/, '')}
                          </Text>
                        </View>
                      );
                    }
                    
                    return (
                      <Text
                        key={lineIndex}
                        className="text-slate-600 mb-2"
                        style={{
                          fontSize: responsiveFontSize(13),
                          lineHeight: responsiveFontSize(18, { min: 16 }),
                        }}
                      >
                        {line}
                      </Text>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Footer Alert Box */}
        <View
          className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            className="bg-red-600 rounded-full items-center justify-center mr-3"
            style={{
              width: 24,
              height: 24,
            }}
          >
            <MaterialCommunityIcons 
              name="alert" 
              size={responsiveFontSize(16)} 
              color="white" 
            />
          </View>
          <Text
            className="text-slate-700 flex-1"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            Việc sử dụng dịch vụ tại Trung tâm TRUNGTAMACF.VN đồng nghĩa bạn chấp thuận với các điều khoản nêu trên.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
