import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
    title: string;
    subtitle: string;
};

export default function PageHeader({ title, subtitle }: Props) {
    const router = useRouter();

    return (
        <View className="w-full px-5 pt-3 pb-5">

            {/* Back Button and Title */}
            <View className="flex-row items-center gap-4">

                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-[#1E3042] items-center justify-center border border-[#263C50]"
                    hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15
                    }}
                >
                    <FontAwesome6
                        name="arrow-left"
                        iconStyle="solid"
                        size={17}
                        color="#A8C8E7"
                    />
                </Pressable>

                <Text className="text-white text-2xl font-bold tracking-tight">
                    {title}
                </Text>

            </View>

            {/* Subtitle */}
            <Text className="text-[#91A8BC] text-sm mt-3 leading-5">
                {subtitle}
            </Text>


        </View>
    );
}