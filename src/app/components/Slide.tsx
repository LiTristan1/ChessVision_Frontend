
import { ImageBackground } from "expo-image";
import { cssInterop } from "nativewind";
import { ImageSourcePropType, Text, View } from "react-native";

cssInterop(ImageBackground, {
    className: "style",
});

type Props = {
    description: string;
    image: ImageSourcePropType;
};

export function Slide({ description, image }: Props) {
    return (
        <View className="w-full h-[225px] rounded-3xl overflow-hidden border border-[#304B63]">
            <ImageBackground
                className="w-full h-full"
                source={image}
                contentPosition="center"
                contentFit="cover"
            >
                <View
                    className="flex-1 justify-between px-5 py-5"
                    style={{
                        backgroundColor: "rgba(8, 18, 30, 0.68)",
                    }}
                >
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#A8C8E7] mr-2" />

                        <Text className="text-[#B8D5EC] text-[11px] font-bold tracking-[2px]">
                            CHESSVISION
                        </Text>
                    </View>

                    <View>
                        <Text className="text-white text-[22px] font-bold mb-2">
                            Improve Every Move.
                        </Text>

                        <Text className="text-[#D2DFEA] text-[13px] leading-5">
                            {description}
                        </Text>

                        <View className="flex-row items-center gap-1.5 mt-5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <View
                                    key={index}
                                    className={`h-1.5 rounded-full ${index === 0
                                            ? "w-6 bg-[#A8C8E7]"
                                            : "w-1.5 bg-[#71889C]"
                                        }`}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
