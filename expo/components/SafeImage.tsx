import React from "react";
import { Image, ImageProps, ImageSourcePropType } from "react-native";

const PLACEHOLDER = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80";

function normalizeSource(source?: ImageSourcePropType): ImageSourcePropType {
  if (!source) return { uri: PLACEHOLDER };

  if (typeof source === "number") return source;

  if (Array.isArray(source)) {
    const first = source.find((s) => typeof s === "number" || (typeof s === "object" && s && "uri" in s && (s as any).uri));
    if (first) return first as ImageSourcePropType;
    return { uri: PLACEHOLDER };
  }

  if (typeof source === "object" && source && "uri" in source) {
    const uri = (source as any).uri as string | undefined;
    if (!uri || uri.trim() === "") {
      console.warn("[SafeImage] Empty image uri, falling back to placeholder");
      return { uri: PLACEHOLDER };
    }
    return { uri };
  }

  return { uri: PLACEHOLDER };
}

export default function SafeImage(props: ImageProps) {
  const normalized = normalizeSource(props.source);
  return (
    <Image
      {...props}
      testID={props.testID ?? "safe-image"}
      source={normalized}
      onError={(e) => {
        console.log("[SafeImage] Image load error", e.nativeEvent?.error);
      }}
    />
  );
}
