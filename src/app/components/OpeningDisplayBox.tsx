import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from "react-native";
import { colors } from "../../../themes/themes";
import type { Opening } from "../types/responses";
type Props = {
    opening: Opening;
};

export function OpeningDisplayBox({ opening }: Props) {
    const router = useRouter()
    return (
        <Pressable
            onPress={() => router.navigate(`/(pages)/openings/${opening.id}`)}
            className="w-full rounded-xl px-4 py-4 mb-3"
            style={{
                backgroundColor: colors.componentBackground,
                borderWidth: 1,
                borderColor: "#304457"
            }}
        >
            <View className="flex-row items-center gap-4">

                {/* ECO Code Badge */}
                <View
                    className="w-[60px] h-[55px] rounded-lg items-center justify-center"
                    style={{
                        backgroundColor: "#30485D"
                    }}
                >
                    <Text
                        className="text-base font-bold"
                        style={{
                            color: colors.iconTint
                        }}
                    >
                        {opening.eco}
                    </Text>
                </View>

                {/* Opening Information */}
                <View className="flex-1 gap-2">

                    <Text
                        className="text-white text-base font-semibold"
                        numberOfLines={2}
                    >
                        {opening.name}
                    </Text>

                    <Text
                        className="text-gray-400 text-xs"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {opening.pgn}
                    </Text>

                </View>

                {/* Navigation Arrow */}
                <FontAwesome6
                    name="chevron-right"
                    size={14}
                    color={colors.iconTint}
                    iconStyle="solid"
                />

            </View>
        </Pressable>
    );
}