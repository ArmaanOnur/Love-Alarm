import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toast } from '../src/components/shared/Toast';
import { Colors } from '../src/constants/theme';
import { useUserStore } from '../src/store/userStore';
import { getUser } from '../src/services/storage';
import { connectSocket } from '../src/services/socket';
import type { User } from '../src/types/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 2 },
  },
});

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await getUser<User>();
        if (cancelled) return;
        if (cached) {
          setUser(cached);
          await connectSocket();
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
        await SplashScreen.hideAsync();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setUser, setLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="profile/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="profile/index" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="premium/index" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="settings/index" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="badges/index" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="history/index" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="matches/index" options={{ animation: 'slide_from_right' }} />
            </Stack>
            <Toast />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
