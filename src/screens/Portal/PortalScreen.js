import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils/constants';

const { width } = Dimensions.get('window');

const applications = [
  {
    id: 1,
    title: 'Sổ tay Đảng viên',
    icon: 'book-open-variant',
    description: 'Hệ thống quản lý thông tin đảng viên',
  },
  {
    id: 2,
    title: 'Hệ thống thu thập, tổng hợp thông tin trên Internet',
    icon: 'web',
    description: 'Thu thập và phân tích thông tin từ internet',
  },
  {
    id: 3,
    title: 'Trợ lý ảo hỏi đáp công tác tổ chức Đại hội các cấp',
    icon: 'robot',
    description: 'Hỗ trợ tư vấn về công tác tổ chức đại hội',
  },
  {
    id: 4,
    title: 'Theo dõi tiến trình và kết quả Đại hội',
    icon: 'chart-line',
    description: 'Giám sát và báo cáo tiến độ đại hội',
  },
  {
    id: 5,
    title: 'Cổng thông tin điện tử',
    icon: 'web',
    description: 'Cổng thông tin chính thức của Đảng',
  },
  {
    id: 6,
    title: 'Hệ thống thông tin',
    icon: 'information',
    description: 'Quản lý thông tin tổng thể',
  },
];

const PortalScreen = () => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleAppPress = (app) => {
    // Navigate to main tabs (home screen)
    navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TABS.HOME });
  };

  // Navigate back to initial Portal screen when this component mounts
  React.useEffect(() => {
    // When tab "Cổng" is pressed, navigate to the original Portal screen
    const timer = setTimeout(() => {
      navigation.navigate(ROUTES.STACK.PORTAL);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigation]);


  const renderApplicationCard = (app) => (
    <TouchableOpacity
      key={app.id}
      style={styles.appCard}
      activeOpacity={0.8}
      onPress={() => handleAppPress(app)}
    >
      <View style={styles.appIconContainer}>
        <MaterialCommunityIcons 
          name={app.icon} 
          size={30} 
          color="#DC2626" 
        />
      </View>
      <Text style={styles.appTitle}>{app.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với logo Đảng */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.logoContainer}>
          <View style={styles.partySymbol}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}> CỔNG THÔNG TIN PHÒNG CHỐNG HÀNG GIẢ ACF</Text>
            <Text style={styles.subTitle}>CỔNG CÁC CHỨC NĂNG</Text>
          </View>
        </View>
        
        {/* Thanh tìm kiếm và đăng nhập */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm ứng dụng"
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung chính */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Grid các ứng dụng */}
        <View style={styles.appsGrid}>
          {applications.map(renderApplicationCard)}
        </View>

        {/* Hotline hỗ trợ */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Hotline hỗ trợ</Text>
          <Text style={styles.supportText}>
            Phần mềm Sổ tay Đảng viên: 18008000 nhánh 7 (miễn phí)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  partySymbol: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    position: 'relative',
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  appCard: {
    width: (width - 70) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 15,
  },
  appIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 18,
  },
  supportSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default PortalScreen;
