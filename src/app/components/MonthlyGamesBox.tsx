import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAppDispatch, } from "../hooks/reduxHooks";
import { setCurrentGame } from '../Store/slices/GamesSlices';
import type { Game } from "../types/responses";
type Props = {
    monthIndex: number;
    games: Game[];
};

export function MonthlyGamesBox({
    monthIndex,
    games
}: Props) {
    const dispatch = useAppDispatch()
    useEffect(() => {
        console.log("First game:", {
            white: games[0]?.white.username,
            whiteRating: games[0]?.white.rating,
            black: games[0]?.black.username,
            blackRating: games[0]?.black.rating,
            result: games[0]?.pgn.match(/\[Result "(.*?)"\]/)?.[1],
            timeClass: games[0]?.time_class,
            uuid: games[0]?.uuid
        });
    }, [games])
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

    return (
        <View className="w-full bg-[#0B1929] rounded-xl overflow-hidden">

            {/* Clickable month header */}
            <Pressable
                onPress={() => setIsOpen(prev => !prev)}
                className="flex-row justify-between items-center px-4 py-3"
            >
                <View>
                    <Text className="text-white text-lg font-semibold">
                        {month}
                    </Text>

                    <Text className="text-gray-400 text-sm">
                        {games.length} {games.length === 1 ? "game" : "games"}
                    </Text>
                </View>

                {/* Simple expand indicator */}
                <Text className="text-white text-lg">
                    {isOpen ? "▲" : "▼"}
                </Text>
            </Pressable>

            {/* Only show games when expanded */}
            {isOpen && (
                <View>
                    {games.map((game, index) => (
                        <Pressable
                            key={game.uuid ?? index}
                            className="px-4 py-3 border-t border-[#1E3042]"
                            onPress={async () => {
                                console.log("Dispatching: " + game.uuid)
                                dispatch(setCurrentGame(game))

                            }}
                        >
                            <View className="flex-row justify-between items-center">

                                <View>
                                    <Text className="text-white font-medium">
                                        {game.white.username}
                                    </Text>

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
                    ))}
                </View>
            )}

        </View>
    );
}