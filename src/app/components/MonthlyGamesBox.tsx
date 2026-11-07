import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { storeRecentAnalysis } from "../helpers/LocalStorage";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setCurrentAnalyzedMove, setCurrentGame, setHasSelectedGame } from '../Store/slices/GamesSlices';
import type { Game } from "../types/responses";
type Props = {
    monthIndex: number;
    games: Game[];
};

export function MonthlyGamesBox({
    monthIndex,
    games
}: Props) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    //check if user has already chosen to analyze a game
    const hasSelectedGame = useAppSelector(state => state.games.hasSelectedGame)
    const currGame = useAppSelector(state => state.games.currGame)

    const [isOpen, setIsOpen] = useState(false);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const month = months[monthIndex];
    const containsSelectedGame =
        hasSelectedGame &&
        currGame?.uuid != null &&
        games.some(game => game.uuid === currGame.uuid);
    return (
        <View className="w-full bg-[#0B1929] rounded-xl overflow-hidden">

            {/* Clickable month header */}
            <Pressable
                onPress={() => setIsOpen(prev => !prev)}
                className={`flex-row justify-between items-center px-4 py-3 ${containsSelectedGame
                    ? "bg-[#173B57] border-l-4 border-l-[#38BDF8]"
                    : "bg-[#0B1929] border-l-4 border-l-transparent"
                    }`}
            >
                <View>
                    <Text
                        className={`text-lg font-semibold ${containsSelectedGame
                            ? "text-[#38BDF8]"
                            : "text-white"
                            }`}
                    >
                        {month}
                    </Text>

                    <Text className="text-gray-400 text-sm">
                        {games.length} {games.length === 1 ? "game" : "games"}
                    </Text>
                </View>

                <Text
                    className={`text-lg ${containsSelectedGame
                        ? "text-[#38BDF8]"
                        : "text-white"
                        }`}
                >
                    {isOpen ? "▲" : "▼"}
                </Text>
            </Pressable>

            {/* Only show games when expanded */}
            {isOpen && (
                <View>
                    {games.map((game, index) => {
                        const isSelected =
                            hasSelectedGame && currGame?.uuid === game.uuid;

                        return (
                            <Pressable
                                key={game.uuid ?? index}
                                className={`px-4 py-3 border-t border-[#1E3042] border-l-4 ${isSelected
                                    ? "bg-[#173B57] border-l-[#38BDF8]"
                                    : "bg-transparent border-l-transparent"
                                    }`}
                                onPress={async () => {
                                    if (hasSelectedGame && currGame) {
                                        await storeRecentAnalysis(currGame);
                                    }

                                    dispatch(setCurrentGame(game));
                                    dispatch(setCurrentAnalyzedMove(-1));
                                    dispatch(setHasSelectedGame(true));

                                    router.navigate("/(tabs)/analysis");
                                }}
                            >
                                <View className="flex-row justify-between items-center">
                                    <View>
                                        <View className="flex-row items-center gap-2">
                                            <Text
                                                className={`font-medium ${isSelected ? "text-[#38BDF8]" : "text-white"
                                                    }`}
                                            >
                                                {game.white.username}
                                            </Text>

                                            {isSelected && (
                                                <Text className="text-[#38BDF8] text-xs font-semibold">
                                                    ✓ Selected
                                                </Text>
                                            )}
                                        </View>

                                        <Text className="text-gray-400 text-sm">
                                            vs
                                        </Text>

                                        <Text className="text-white font-medium">
                                            {game.black.username}
                                        </Text>
                                    </View>

                                    <View className="items-end">
                                        <Text className="text-white font-semibold">
                                            {game.white.result === "win"
                                                ? "1 - 0"
                                                : game.black.result === "win"
                                                    ? "0 - 1"
                                                    : "½ - ½"}
                                        </Text>

                                        <Text className="text-gray-400 text-sm capitalize">
                                            {game.time_class}
                                        </Text>
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