import React from "react";
import { Image, ImageProps } from "react-native";

const PLACEHOLDER = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80";

export default function SafeImage(props: ImageProps) {
  const src = props.source as any;
  
  if (!src || (typeof src === 'object' && 'uri' in src && (!src.uri || src.uri === ""))) {
    return (
      <Image
        {...props}
        source={{ uri: PLACEHOLDER }}
      />
    );
  }
  
  return <Image {...props} />;
}
