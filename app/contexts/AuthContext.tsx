import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { AUTH_STORAGE_KEYS, DEV_CREDENTIALS } from "@/app/config/constants";
import { trpc } from "@/lib/trpc";

interface User {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  ndaAccepted: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ndaAccepted, setNdaAccepted] = useState<boolean>(false);

  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const [storedUser, storedToken, storedNda] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.token),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.ndaAccepted),
        ]);
        
        return {
          user: storedUser ? JSON.parse(storedUser) : null,
          token: storedToken,
          ndaAccepted: storedNda === "true",
        };
      } catch (error) {
        console.warn("[Auth] Failed to load stored auth:", error);
        return {
          user: null,
          token: null,
          ndaAccepted: false,
        };
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
    networkMode: 'offlineFirst',
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data.user);
      setToken(userQuery.data.token);
      setNdaAccepted(userQuery.data.ndaAccepted);
    }
  }, [userQuery.data]);



  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("[Auth] Local login for:", credentials.email);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isAdminLogin = credentials.email === DEV_CREDENTIALS.adminEmail && 
                          credentials.password === DEV_CREDENTIALS.adminPassword;
      
      if (isAdminLogin) {
        console.log("[Auth] Admin login detected");
      }
      
      const userId = isAdminLogin ? "admin_dev" : `local_${Date.now()}`;
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      return {
        success: true,
        userId,
        email: credentials.email,
        name: isAdminLogin ? "Admin Developer" : credentials.email.split("@")[0],
        token,
        isAdmin: isAdminLogin,
      };
    },
    onSuccess: async (data) => {
      if (data?.success) {
        const userData = {
          id: data.userId,
          email: data.email,
          name: data.name,
          isGuest: false,
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(userData));
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.token, data.token);
        
        if (data.isAdmin) {
          await AsyncStorage.setItem(AUTH_STORAGE_KEYS.verificationSkipped, "true");
          await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ndaAccepted, "true");
        }
        
        setUser(userData);
        setToken(data.token);
        
        console.log("[Auth] Login successful:", userData?.email || userData.id);
        
        if (data.isAdmin) {
          console.log("[Auth] Admin logged in, skipping verification → /r3al/home");
          router.replace("/r3al/home");
        } else {
          router.replace("/nda");
        }
      }
    },
    onError: (error) => {
      console.error("[Auth] Login failed:", error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: { name: string; email: string; password: string }) => {
      console.log("[Auth] Local registration for:", credentials.email);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userId = `local_${Date.now()}`;
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      return {
        success: true,
        userId,
        email: credentials.email,
        name: credentials.name,
        token,
      };
    },
    onSuccess: async (data) => {
      if (data?.success) {
        const userData = {
          id: data.userId,
          email: data.email,
          name: data.name,
          isGuest: false,
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(userData));
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.token, data.token);
        
        setUser(userData);
        setToken(data.token);
        
        console.log("[Auth] Registration successful:", userData?.email || userData.id);
        router.replace("/nda");
      }
    },
    onError: (error) => {
      console.error("[Auth] Registration failed:", error);
    },
  });



  const acceptNdaMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ndaAccepted, "true");
      return true;
    },
    onSuccess: () => {
      setNdaAccepted(true);
      console.log("[Auth] NDA accepted → /r3al/onboarding/welcome");
      router.replace("/r3al/onboarding/welcome");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.user,
        AUTH_STORAGE_KEYS.token,
        AUTH_STORAGE_KEYS.ndaAccepted,
      ]);
    },
    onSuccess: () => {
      setUser(null);
      setToken(null);
      setNdaAccepted(false);
      console.log("[Auth] Logout successful");
      router.replace("/login");
    },
  });

  const authState: AuthState = {
    user,
    token,
    ndaAccepted,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!user,
  };

  return {
    ...authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    acceptNda: acceptNdaMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isAcceptingNda: acceptNdaMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
});
