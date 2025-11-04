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
      <Stack.Screen name="profile/view" />
      <Stack.Screen name="home" />
      <Stack.Screen name="security/capture-history" />
      <Stack.Screen name="security/appeal-form" />
      <Stack.Screen name="hive/index" />
      <Stack.Screen name="hive/nft-creator" />
      <Stack.Screen name="hive/nft-gallery" />
      <Stack.Screen name="hive/nft-marketplace" />
      <Stack.Screen name="hive/token-wallet" />
      <Stack.Screen name="learn-more" />
      <Stack.Screen name="qotd/index" />
      <Stack.Screen name="pulse-chat/index" />
      <Stack.Screen name="pulse-chat/dm-list" />
      <Stack.Screen name="pulse-chat/dm" />
      <Stack.Screen name="pulse-chat/contacts" />
      <Stack.Screen name="pulse-chat/video" />
      <Stack.Screen name="pulse-chat/realification" />
      <Stack.Screen name="pulse-chat/honesty-check" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="circles" />
      <Stack.Screen name="truth-score-detail" />
      <Stack.Screen name="legal" />
      <Stack.Screen name="circles/create" />
      <Stack.Screen name="circles/[circleId]" />
      <Stack.Screen name="circles/[circleId]/members" />
      <Stack.Screen name="circles/[circleId]/dm" />
      <Stack.Screen name="optima-ai" />
    </Stack>
  );
}
