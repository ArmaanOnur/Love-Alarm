import { Redirect } from 'expo-router';
import { useUserStore } from '../src/store/userStore';

/**
 * Root entry: send users to auth or main tabs after hydration in `app/_layout.tsx`.
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useUserStore();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/alarm" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
