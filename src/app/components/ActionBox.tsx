import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Pressable, Text, View } from "react-native";

type Props = {
    description: string;
    icon: any;
    onPress: () => void;
};

export function ActionBox({ description, icon, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                width: "100%",
                borderRadius: 16,
            }}
        >
            {({ pressed }) => (
                <View
                    style={{
                        width: "100%",
                        minHeight: 146,
                        borderRadius: 16,
                        padding: 16,
                        justifyContent: "space-between",
                        backgroundColor: pressed ? "#263B50" : "#1B2D3E",
                        borderWidth: 1,
                        borderColor: pressed ? "#527391" : "#2A4054",
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                    }}
                >
                    <View className="flex-row justify-between items-start">
                        <View className="w-12 h-12 rounded-2xl bg-[#253E54] border border-[#34516B] items-center justify-center">
                            <FontAwesome6
                                name={icon}
                                iconStyle="solid"
                                size={21}
                                color="#B5D5F2"
                            />
                        </View>

                        <Text className="text-[#7795AF] text-lg font-medium">
                            ↗
                        </Text>
                    </View>

                    <View className="mt-5">
                        <Text
                            className="text-white text-[15px] font-bold"
                            numberOfLines={2}
                        >
                            {description}
                        </Text>

                        <Text className="text-[#7994AC] text-[11px] mt-1.5">
                            Open tool
                        </Text>
                    </View>
                </View>
            )}
        </Pressable>
    );
}