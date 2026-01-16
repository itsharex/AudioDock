import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/context/AuthContext";

export default function NotificationClickRedirect() {
  const router = useRouter();
  const navigation = useNavigation();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    const state = navigation.getState();
    // Check if we have history
    const hasHistory = state && state.routes && state.routes.length > 1;

    if (!hasHistory) {
      // Cold start: Ensure tabs are at the base
      router.replace("/(tabs)");
      setTimeout(() => {
        router.push("/player");
      }, 100);
    } else {
      // Just go to player, replace current notification.click
      router.replace("/player");
    }
  }, [isLoading, token]);

  return null;
}
