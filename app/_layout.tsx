import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/app/contexts/AuthContext";
import { ThemeProvider, ThemedRoot } from "@/app/contexts/ThemeContext";
import { ErrorBoundary } from "react-error-boundary";
import { Text, View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { trpc, trpcClient } from "@/lib/trpc";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === 'web' ? 0 : 1,
      retryDelay: 1000,
      staleTime: 5000,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 0,
      networkMode: 'offlineFirst',
    },
  },
});

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>App Error</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorHelp}>Please restart the app</Text>
    </View>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, ndaAccepted, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated || isLoading) {
      return;
    }

    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }

    const timer = setTimeout(() => {
      const inAuthGroup = ["login", "register", "guest", "nda"].includes(segments[0] as string);
      const inHomeGroup = segments[0] === "home";

      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/login");
      } else if (isAuthenticated && !ndaAccepted && segments[0] !== "nda") {
        router.replace("/nda");
      } else if (isAuthenticated && ndaAccepted && !inHomeGroup) {
        router.replace("/home");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, ndaAccepted, isLoading, segments, router, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="guest" options={{ headerShown: false }} />
      <Stack.Screen name="nda" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="r3al" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <ThemedRoot>
                <AuthProvider>
                  <RootLayoutNav />
                </AuthProvider>
              </ThemedRoot>
            </ThemeProvider>
          </GestureHandlerRootView>
        </trpc.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4444",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  errorHelp: {
    fontSize: 14,
    color: "#888888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
});
