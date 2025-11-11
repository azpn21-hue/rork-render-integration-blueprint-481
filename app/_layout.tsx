import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "react-error-boundary";
import { Text, View, StyleSheet, Platform } from "react-native";
import { trpc, trpcClient } from "@/lib/trpc";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { R3alContext } from "@/app/contexts/R3alContext";
import { TutorialProvider } from "@/app/contexts/TutorialContext";
import { PulseChatContext } from "@/app/contexts/PulseChatContext";
import { CirclesContext } from "@/app/contexts/CirclesContext";
import { TrailblazeContext } from "@/app/contexts/TrailblazeContext";
import { MemoryGraphProvider } from "@/app/contexts/MemoryGraphContext";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          const message = error instanceof Error ? error.message : String(error);
          if (/HTTP\s(429|503)/.test(message)) return false;
          if (/HTTP\s404/.test(message)) return false;
          return failureCount < 1;
        },
        retryDelay: (attempt) => {
          const baseDelay = 3000;
          return Math.min(10000, baseDelay * Math.pow(2, attempt)) + Math.floor(Math.random() * 1000);
        },
        staleTime: 60_000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        networkMode: 'online',
        suspense: false,
      },
      mutations: {
        retry: (failureCount, error) => {
          const message = error instanceof Error ? error.message : String(error);
          if (/HTTP\s(429|503)/.test(message) && failureCount < 2) return true;
          return false;
        },
        retryDelay: (attempt) => 1000 + Math.floor(Math.random() * 1000),
        networkMode: 'online',
      },
    },
    logger: {
      log: (...args) => console.log('[ReactQuery]', ...args),
      warn: (...args) => console.warn('[ReactQuery]', ...args),
      error: (error) => {
        if (error instanceof Error && (error.message.includes('404') || error.message.includes('429'))) {
          console.warn('[ReactQuery] Suppressed error:', error.message.substring(0, 50));
          return;
        }
        console.error('[ReactQuery]', error);
      },
    },
  });
}

const queryClient = createQueryClient();

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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="r3al" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [webReady, setWebReady] = useState<boolean>(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      requestAnimationFrame(() => setWebReady(true));
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {webReady ? (
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <R3alContext>
              <CirclesContext>
                <PulseChatContext>
                  <TrailblazeContext>
                    <MemoryGraphProvider>
                      <ThemeProvider>
                        <AuthProvider>
                          <TutorialProvider>
                            <GestureHandlerRootView style={{ flex: 1 }}>
                              <RootLayoutNav />
                            </GestureHandlerRootView>
                          </TutorialProvider>
                        </AuthProvider>
                      </ThemeProvider>
                    </MemoryGraphProvider>
                  </TrailblazeContext>
                </PulseChatContext>
              </CirclesContext>
            </R3alContext>
          </trpc.Provider>
        ) : (
          <View style={styles.loadingContainer} testID="web-hydration-gate">
            <Text style={{ color: '#94A3B8' }}>Loading…</Text>
          </View>
        )}
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
