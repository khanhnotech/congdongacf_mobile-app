import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { linking } from './src/navigation/linking';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';
import { useAuth } from './src/hooks/useAuth';
import { useFonts } from "expo-font";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppShell() {
  useAuth();

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto: require("./src/assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("./src/assets/fonts/Roboto-Bold.ttf"),
  });

  // Nếu font chưa load thì return null (hoặc splash screen)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <AppShell />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
