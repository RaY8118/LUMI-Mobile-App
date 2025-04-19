import React, { useCallback } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import useTabDirection from "@/hooks/useTabDirection";

const screenWidth = Dimensions.get("window").width;

export default function FadeWrapper({ children, duration = 500 }) {
  const direction = useTabDirection();
  const translateX = useSharedValue(
    direction === "left" ? -screenWidth : screenWidth
  );
  const opacity = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      translateX.value =
        direction === "left" ? -screenWidth : screenWidth;
      opacity.value = 0;

      requestAnimationFrame(() => {
        translateX.value = withTiming(0, {
          duration,
          easing: Easing.out(Easing.exp),
        });
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.exp),
        });
      });

      return () => {
        opacity.value = 0;
      };
    }, [direction])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    flex: 1,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
