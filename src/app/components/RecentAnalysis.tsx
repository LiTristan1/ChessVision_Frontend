import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Pressable, Text, View } from "react-native";
import { Game } from "../types/responses";

type Props = {
    games: Game[];
    onGamePress?: (game: Game) => void;
};

export default function RecentAnalysis({
    games,
    onGamePress,
}: Props) {
    const recentGames = games.slice(-8).reverse();

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatTimeControl = (timeControl: string) => {
        const [base, increment] = timeControl.split("+");

        const seconds = Number(base);

        if (isNaN(seconds)) return timeControl;

        const minutes = Math.floor(seconds / 60);

        return increment
            ? `${minutes}+${increment}`
            : `${minutes} min`;
    };

    const getResult = (game: Game) => {
        const whiteResult = game.white.result;
        const blackResult = game.black.result;

        if (whiteResult === "win") {
            return {
                label: "1 - 0",
                color: "#86D9AC",
            };
        }

        if (blackResult === "win") {
            return {
                label: "0 - 1",
                color: "#86D9AC",
            };
        }

        return {
            label: "½ - ½",
            color: "#91A8BC",
        };
    };

    return (
        <View className="mb-7">

            {/* Section Header */}
            <View className="flex-row items-center justify-between mb-4">

                <View className="flex-row items-center gap-2.5">
                    <View className="w-8 h-8 rounded-lg bg-[#20364A] items-center justify-center">
                        <FontAwesome6
                            name="clock-rotate-left"
                            size={14}
                            color="#A8C8E7"
                            iconStyle="solid"
                        />
                    </View>

                    <Text className="text-white text-lg font-bold">
                        Recent Analysis
                    </Text>
                </View>

                {recentGames.length > 0 && (
                    <View className="bg-[#20364A] px-2.5 py-1 rounded-full">
                        <Text className="text-[#A8C8E7] text-xs font-semibold">
                            {recentGames.length}
                        </Text>
                    </View>
                )}

            </View>

            {recentGames.length === 0 ? (

                /* Empty State */
                <View className="bg-[#152535] border border-[#263C50] rounded-2xl px-6 py-9 items-center">

                    <View className="w-16 h-16 bg-[#20364A] rounded-2xl items-center justify-center mb-4">
                        <FontAwesome6
                            name="chess-knight"
                            size={27}
                            color="#A8C8E7"
                            iconStyle="solid"
                        />
                    </View>

                    <Text className="text-white text-base font-bold mb-2">
                        No recent analysis
                    </Text>

                    <Text className="text-[#91A8BC] text-sm text-center leading-5 max-w-[250px]">
                        Analyze your first game to start building your chess history.
                    </Text>

                </View>

            ) : (

                /* Game List */
                <View className="gap-2.5">

                    {recentGames.map((game, index) => {
                        const result = getResult(game);

                        return (
                            <Pressable
                                key={`${game.uuid}-${index}`}
                                onPress={() => onGamePress?.(game)}
                                className="bg-[#152535] border border-[#263C50] rounded-2xl px-4 py-3.5 active:opacity-70"
                            >

                                <View className="flex-row items-center">

                                    {/* Chess Icon */}
                                    <View className="w-11 h-11 bg-[#20364A] rounded-xl items-center justify-center mr-3.5">
                                        <FontAwesome6
                                            name="chess-knight"
                                            size={21}
                                            color="#A8C8E7"
                                            iconStyle="solid"
                                        />
                                    </View>

                                    {/* Main Content */}
                                    <View className="flex-1">

                                        {/* Players */}
                                        <View className="flex-row items-center mb-1.5">

                                            <Text
                                                className="text-white text-sm font-bold flex-shrink"
                                                numberOfLines={1}
                                            >
                                                {game.white.username}
                                            </Text>

                                            <Text className="text-[#69849B] text-xs mx-1.5">
                                                vs
                                            </Text>

                                            <Text
                                                className="text-white text-sm font-bold flex-shrink"
                                                numberOfLines={1}
                                            >
                                                {game.black.username}
                                            </Text>

                                        </View>

                                        {/* Metadata */}
                                        <View className="flex-row items-center flex-wrap gap-2">

                                            {/* Time Class */}
                                            <View className="bg-[#233E54] rounded-md px-2 py-0.5">
                                                <Text className="text-[#A8C8E7] text-[10px] font-semibold capitalize">
                                                    {game.time_class}
                                                </Text>
                                            </View>

                                            <Text className="text-[#91A8BC] text-xs">
                                                {formatTimeControl(game.time_control)}
                                            </Text>

                                            <View className="w-1 h-1 rounded-full bg-[#526B80]" />

                                            <Text className="text-[#91A8BC] text-xs">
                                                {formatDate(game.end_time)}
                                            </Text>

                                        </View>

                                    </View>

                                    {/* Right Side */}
                                    <View className="items-end ml-2 gap-2">

                                        <Text
                                            className="text-xs font-bold"
                                            style={{ color: result.color }}
                                        >
                                            {result.label}
                                        </Text>

                                        <FontAwesome6
                                            name="chevron-right"
                                            size={11}
                                            color="#69849B"
                                            iconStyle="solid"
                                        />

                                    </View>

                                </View>

                            </Pressable>
                        );
                    })}

                </View>

            )}

        </View>
    );
}