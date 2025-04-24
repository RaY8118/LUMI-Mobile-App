import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const Spinner = ({ message = "Loading ..." }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 flex items-center justify-center z-50">
      <Animated.View style={animatedStyle}>
        <Ionicons name="reload" size={40} color="#7C3AED" />
      </Animated.View>
      <Text className="text-2xl font-extrabold text-purple-700 tracking-wide mt-4">
        {message}
      </Text>
    </View>
  );
};

export default Spinner;
