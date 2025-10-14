import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { linking } from './src/navigation/linking';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';
import { useAuth } from './src/hooks/useAuth';
import { authService } from './src/services/auth.service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppShell() {
  const { user, setAuth } = useAuth();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || user) return;
    hasHydrated.current = true;

    authService
      .me()
      .then((currentUser) => {
        setAuth({ token: 'demo-token', user: currentUser });
      })
      .catch((error) => {
        console.warn('Hydrate auth failed', error);
      });
  }, [setAuth, user]);

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

export default function App() {
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
