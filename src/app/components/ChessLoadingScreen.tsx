
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  message: string;
};

export function ChessLoadingScreen({ message }: Props) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1800,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulse.value = withRepeat(
      withTiming(1.12, {
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const knightStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-36 h-36 items-center justify-center">
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 136,
              height: 136,
              borderRadius: 68,
              borderWidth: 4,
              borderColor: "#234B70",
              borderTopColor: "#38A8FF",
              borderRightColor: "#38A8FF",
            },
            ringStyle,
          ]}
        />

        <Animated.View style={knightStyle}>
          <FontAwesome6
            name="chess-knight"
            iconStyle="solid"
            size={54}
            color="#B5DFFF"
          />
        </Animated.View>
      </View>

      <Text className="text-white text-2xl font-bold mt-8">
        Chess
        <Text className="text-[#38A8FF]">Vision</Text>
      </Text>

      <Text className="text-[#B3C8DB] text-base mt-4 text-center">
        {message}
      </Text>

      <Text className="text-[#6F91AE] text-xs mt-4">
        Preparing your chess experience
      </Text>
    </View>
  );
}
