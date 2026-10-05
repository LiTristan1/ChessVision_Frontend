import { ActivityIndicator, Text, View } from "react-native";

export default function Loading() {
    return (
        <View className="w-full py-12 items-center justify-center gap-3">
            <ActivityIndicator
                size="large"
                color="#4D7CFE"
            />

            <Text className="text-gray-400 text-sm">
                Loading games...
            </Text>
        </View>
    );
}