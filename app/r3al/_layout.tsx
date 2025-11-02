import { Stack } from "expo-router";

export default function R3alLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="promo-beta" />
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/consent" />
      <Stack.Screen name="verification/intro" />
      <Stack.Screen name="verification/index" />
      <Stack.Screen name="questionnaire/index" />
      <Stack.Screen name="questionnaire/result" />
      <Stack.Screen name="profile/setup" />
      <Stack.Screen name="home" />
      <Stack.Screen name="security/capture-history" />
      <Stack.Screen name="security/appeal-form" />
    </Stack>
  );
}
