import { Text, View } from "react-native";

type Props = {
    title: string;
    rating?: number;
};

export function RatingCard({ title, rating }: Props) {
    return (
        <View className="flex-1 bg-[#1B2D3E] rounded-xl px-3 py-4 items-center border border-[#2A4054]">
            <Text className="text-[#91A8BC] text-xs font-semibold tracking-wider">
                {title}
            </Text>

            <Text className="text-white text-xl font-bold mt-2">
                {rating?.toLocaleString() ?? "—"}
            </Text>
        </View>
    );
}