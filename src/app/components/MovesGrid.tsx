import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { ChessGame } from "../models/pieces";

type Props = {
    game: ChessGame
    moves: string[][]
};

export function MovesGrid({ game, moves }: Props) {
    const [selectedMove, setSelectedMove] = useState<number | null>(null);
    return (
        <ScrollView className="w-full px-3 ">


            {moves.map((move, index) => {
                const selected = selectedMove === index;

                return (
                    <Pressable
                        key={index}
                        onPress={() => setSelectedMove(index)}
                        className={`
                            flex-row
                            items-center
                            w-full
                            p-2
                            rounded-sm
                           ${selected
                                ? "bg-[#18243A] border border-[#4D7CFE]"
                                : "bg-[#080B0F]"
                            }
                        `}
                    >
                        <Text className="w-[15%] text-gray-400">
                            {index + 1}.
                        </Text>

                        <Text className="w-[35%] text-white font-medium">
                            {move[0]}
                        </Text>
                        <Text className="w-[35%] text-white font-medium">
                            {move[1]}
                        </Text>


                    </Pressable>
                );
            })}

        </ScrollView>
    );
}