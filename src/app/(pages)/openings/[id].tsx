import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PageHeader from "@/app/components/PageHeader";
import { useAppSelector } from "@/app/hooks/reduxHooks";
import { containers } from "../../../../themes/themes";

export default function OpeningDetailsPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const allOpenings = useAppSelector(
        state => state.games.openings
    );

    const currOpening = allOpenings.find(
        opening => opening.id === id
    );

    // Opening wasn't found
    if (!currOpening) {
        return (
            <SafeAreaView style={containers.PrimaryContainer}>
                <PageHeader
                    title="Opening Details"
                    subtitle="Opening not found"
                />

                <View className="flex-1 items-center justify-center px-6">
                    <FontAwesome6
                        name="circle-exclamation"
                        iconStyle="solid"
                        size={36}
                        color="#91A8BC"
                    />

                    <Text className="text-white text-lg font-semibold mt-5">
                        Opening Not Found
                    </Text>

                    <Text className="text-[#91A8BC] text-sm text-center mt-2">
                        The selected opening could not be found.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Split PGN into individual move tokens
    const moves = currOpening.pgn.trim().split(/\s+/);

    const openingClasses: Record<string, string> = {
        A: "Flank Openings",
        B: "Semi-Open Games",
        C: "Open Games",
        D: "Closed Games",
        E: "Indian Defenses"
    };

    return (
        <SafeAreaView style={containers.PrimaryContainer}>

            <PageHeader
                title="Opening Details"
                subtitle="Explore and study opening theory"
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 40,
                    gap: 20
                }}
                showsVerticalScrollIndicator={false}
            >

                {/* Opening Information Card */}
                <View className="bg-[#152535] border border-[#263C50] rounded-2xl p-5">

                    {/* ECO Classification */}
                    <View className="flex-row items-center gap-3 mb-4">

                        <View className="bg-[#243C51] px-3 py-2 rounded-lg">
                            <Text className="text-[#A8C8E7] text-sm font-bold">
                                {currOpening.eco}
                            </Text>
                        </View>

                        <Text className="text-[#91A8BC] text-xs">
                            {openingClasses[currOpening.opening_class]}
                        </Text>

                    </View>

                    {/* Opening Name */}
                    <Text className="text-white text-2xl font-bold">
                        {currOpening.name}
                    </Text>

                    <Text className="text-[#91A8BC] text-sm mt-3 leading-5">
                        Explore the moves and variations of this chess opening.
                    </Text>

                </View>

                {/* Opening Moves */}
                <View className="bg-[#152535] border border-[#263C50] rounded-2xl p-5">

                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-white text-lg font-semibold">
                            Opening Moves
                        </Text>

                        <FontAwesome6
                            name="list-ol"
                            iconStyle="solid"
                            size={17}
                            color="#A8C8E7"
                        />
                    </View>

                    {/* Move Tokens */}
                    <View className="flex-row flex-wrap gap-2">
                        {moves.map((move, index) => (
                            <View
                                key={index}
                                className="bg-[#1E3042] border border-[#263C50] px-3 py-2 rounded-lg"
                            >
                                <Text className="text-[#C4D8EA] text-sm font-medium">
                                    {move}
                                </Text>
                            </View>
                        ))}
                    </View>

                </View>

                {/* Opening Metadata */}
                <View className="bg-[#152535] border border-[#263C50] rounded-2xl p-5">

                    <Text className="text-white text-lg font-semibold mb-5">
                        Opening Information
                    </Text>

                    <View className="flex-row justify-between mb-4">
                        <Text className="text-[#91A8BC] text-sm">
                            ECO Code
                        </Text>

                        <Text className="text-white text-sm font-semibold">
                            {currOpening.eco}
                        </Text>
                    </View>

                    <View className="h-[1px] bg-[#263C50] mb-4" />

                    <View className="flex-row justify-between">
                        <Text className="text-[#91A8BC] text-sm">
                            Opening Category
                        </Text>

                        <Text className="text-white text-sm font-semibold">
                            {currOpening.opening_class}
                        </Text>
                    </View>

                </View>

                {/* Study Button */}
                <Pressable
                    onPress={() => {
                        //Navigate to opening tutor
                        router.navigate({
                            pathname: "/(pages)/openingTutor/[id]",
                            params: {
                                id: String(currOpening.id)
                            }
                        })
                    }}
                    className="bg-[#243C51] border border-[#35516B] rounded-xl py-4 flex-row items-center justify-center gap-3"
                >
                    <FontAwesome6
                        name="book-open"
                        iconStyle="solid"
                        size={17}
                        color="#FFFFFF"
                    />

                    <Text className="text-white text-base font-semibold">
                        Study This Opening
                    </Text>
                </Pressable>

            </ScrollView>

        </SafeAreaView>
    );
}