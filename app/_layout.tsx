import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/auth';

const queryClient = new QueryClient();

function AuthGuard() {
  const { authenticated, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth().then((ok) => {
      const inAuth = segments[0] === '(auth)';
      if (!ok && !inAuth) router.replace('/(auth)/login');
      if (ok && inAuth) router.replace('/(app)/');
    });
  }, [authenticated]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
