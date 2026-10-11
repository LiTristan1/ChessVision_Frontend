import { ScrollView, Text, View } from "react-native";
import { PositionAnalysis } from "../types/responses";



type Props = {
    analysis: PositionAnalysis[] | null;
    moveIndex: number;
    isAnalyzing: boolean;
};

export default function AnalysisPanel({
    analysis,
    moveIndex,
    isAnalyzing
}: Props) {

    // Initial board has moveIndex 0.
    // First analyzed move is analysis[0].
    const positionAnalysis =
        moveIndex >= 0 ? analysis?.[moveIndex] : null;

    const stats = positionAnalysis?.otbStats;
    const masterGames = positionAnalysis?.masterGames ?? [];

    const total = stats?.games ?? 0;

    const whitePercent = total > 0
        ? (stats!.white_wins / total) * 100
        : 0;

    const drawPercent = total > 0
        ? (stats!.draws / total) * 100
        : 0;

    const blackPercent = total > 0
        ? (stats!.black_wins / total) * 100
        : 0;


    console.log("========== ANALYSIS DEBUG ==========");
    console.log("Move Index:", moveIndex);
    console.log("Analysis Length:", analysis?.length);
    console.log("First Analysis:", JSON.stringify(analysis?.[0]));
    console.log("Selected Analysis:", JSON.stringify(positionAnalysis));
    console.log("OTB Stats:", JSON.stringify(stats));
    if (isAnalyzing) {
        return (
            <View className="bg-[#080B0F] rounded-xl p-6 items-center">
                <Text className="text-gray-300">
                    Analyzing game positions...
                </Text>
            </View>
        );
    }

    if (moveIndex === -1) {
        return (
            <View className="bg-[#080B0F] rounded-xl p-6 items-center">
                <Text className="text-gray-400">
                    Select a move to view its analysis.
                </Text>
            </View>
        );
    }

    if (!positionAnalysis || !stats) {
        return (
            <View className="bg-[#080B0F] rounded-xl p-6 items-center">
                <Text className="text-gray-400">
                    No master game data available for this position.
                </Text>
            </View>
        );
    }

    return (
        <View className="w-full bg-[#080B0F] rounded-xl p-4 gap-5">

            {/* Position header */}
            <View>
                <Text className="text-white text-lg font-semibold">
                    Position Analysis
                </Text>

                <Text className="text-gray-400 text-xs mt-1">
                    {positionAnalysis.gameString}
                </Text>
            </View>

            {/* Statistics */}
            <View className="bg-[#101923] rounded-xl p-4 gap-3">

                <Text className="text-white font-semibold text-base">
                    Master Game Statistics
                </Text>

                <Text className="text-gray-400 text-xs">
                    {total.toLocaleString()} recorded games
                </Text>

                {/* Win/draw distribution */}
                <View className="w-full h-4 rounded-full overflow-hidden flex-row bg-gray-700">
                    <View
                        className="bg-white"
                        style={{ width: `${whitePercent}%` }}
                    />
                    <View
                        className="bg-gray-500"
                        style={{ width: `${drawPercent}%` }}
                    />
                    <View
                        className="bg-[#7289FF]"
                        style={{ width: `${blackPercent}%` }}
                    />
                </View>

                <View className="flex-row justify-between">

                    <View className="items-center gap-1">
                        <Text className="text-white font-semibold">
                            {whitePercent.toFixed(1)}%
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            White
                        </Text>
                    </View>

                    <View className="items-center gap-1">
                        <Text className="text-white font-semibold">
                            {drawPercent.toFixed(1)}%
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            Draw
                        </Text>
                    </View>

                    <View className="items-center gap-1">
                        <Text className="text-[#7289FF] font-semibold">
                            {blackPercent.toFixed(1)}%
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            Black
                        </Text>
                    </View>

                </View>
            </View>

            {/* Master games */}
            <View className="gap-3">

                <View className="flex-row justify-between items-center">
                    <Text className="text-white text-base font-semibold">
                        Top Master Games
                    </Text>

                    <Text className="text-gray-400 text-xs">
                        {masterGames.length} games
                    </Text>
                </View>

                <ScrollView
                    nestedScrollEnabled
                    className="max-h-[350px]"
                >
                    <View className="gap-2">

                        {masterGames.map(game => (
                            <View
                                key={game.id}
                                className="bg-[#101923] rounded-lg p-3 gap-2"
                            >
                                <View className="flex-row justify-between items-center">

                                    <Text
                                        className="text-gray-400 text-xs flex-1"
                                        numberOfLines={1}
                                    >
                                        {game.event ?? "Unknown Event"}
                                    </Text>

                                    <Text className="text-[#7289FF] text-xs">
                                        #{game.id}
                                    </Text>

                                </View>

                                <View className="flex-row justify-between items-center">

                                    <View className="flex-1 gap-1">

                                        <Text
                                            className="text-white text-sm font-medium"
                                            numberOfLines={1}
                                        >
                                            {game.white}
                                        </Text>

                                        <Text
                                            className="text-gray-300 text-sm"
                                            numberOfLines={1}
                                        >
                                            {game.black}
                                        </Text>

                                    </View>

                                    <View className="items-end gap-1 ml-3">

                                        <Text className="text-gray-400 text-xs">
                                            {game.white_elo ?? "—"}
                                        </Text>

                                        <Text className="text-gray-400 text-xs">
                                            {game.black_elo ?? "—"}
                                        </Text>

                                    </View>

                                </View>
                            </View>
                        ))}

                        {masterGames.length === 0 && (
                            <Text className="text-gray-400 text-center py-4">
                                No master games found.
                            </Text>
                        )}

                    </View>
                </ScrollView>

            </View>

        </View>
    );
}