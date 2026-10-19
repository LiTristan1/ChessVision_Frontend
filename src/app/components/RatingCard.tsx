
import { Text, View } from "react-native";

type Props = {
    title: string;
    rating?: number;
};

export function RatingCard({ title, rating }: Props) {
    return (
        <View className="flex-1 min-w-0 bg-[#1D3245] rounded-2xl px-2 py-4 items-center border border-[#304B63]">
            <View className="w-7 h-1 rounded-full bg-[#7FAED6] mb-3" />

            <Text className="text-[#A0B8CE] text-[10px] font-bold tracking-wider">
                {title}
            </Text>

            <Text
                className="text-white text-[22px] font-bold mt-2"
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {rating?.toLocaleString() ?? "—"}
            </Text>

            <Text className="text-[#7894AC] text-[10px] mt-1">
                Rating
            </Text>
        </View>
    );
}
