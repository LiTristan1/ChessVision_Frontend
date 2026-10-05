import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ChessGame, Position } from "../models/pieces";

type Props = {
    game: ChessGame;
    moves: string[][];
    moveIndex: number;
    setCurrentPosition: React.Dispatch<React.SetStateAction<Position>>;
};

type selectedMove = {
    index: number;
    color: "white" | "black";
};

export function MovesGrid({
    game,
    moves,
    moveIndex,
    setCurrentPosition
}: Props) {

    const [selectedMove, setSelectedMove] =
        useState<selectedMove | null>(null);

    return (
        <ScrollView
            className="w-full px-3 py-1"
            showsVerticalScrollIndicator={false}
        >
            {moves.map((move, index) => {

                const selected = selectedMove?.index === index;

                return (
                    <View
                        key={index}
                        className={`
                            flex-row
                            items-center
                            w-full
                            px-2
                            py-1
                            rounded-md
                            ${selected ||
                                (index === moveIndex && selectedMove === null)
                                ? "bg-[#18243A]"
                                : "bg-[#0D1117]"
                            }
                        `}
                    >

                        {/* Move Number */}
                        <Text className="w-[15%] text-[#64748B] text-sm font-medium">
                            {index + 1}.
                        </Text>

                        {/* White Move */}
                        <Pressable
                            className="w-[35%] justify-center px-1 py-1"
                            onPress={() => {

                                var current = game.positions;

                                while (
                                    (
                                        current?.moveIndex != selectedMove?.index ||
                                        current?.position?.whosMove != "white"
                                    ) &&
                                    current != null &&
                                    current != undefined
                                ) {
                                    current = current.next[0];
                                }

                                if (
                                    current != undefined &&
                                    current != null
                                ) {
                                    setSelectedMove({
                                        index: index,
                                        color: "white"
                                    });

                                    setCurrentPosition(current);
                                }
                            }}
                        >
                            <Text
                                className={`
                                    text-sm
                                    font-medium
                                    ${selectedMove?.index === index &&
                                        selectedMove?.color === "white"
                                        ? "text-[#60A5FA]"
                                        : "text-[#E2E8F0]"
                                    }
                                `}
                            >
                                {move[0]}
                            </Text>
                        </Pressable>

                        {/* Black Move */}
                        <Pressable
                            className="w-[35%] justify-center px-1 py-1"
                            onPress={() => {

                                var current = game.positions;

                                while (
                                    (
                                        current?.moveIndex != selectedMove?.index ||
                                        current?.position?.whosMove != "black"
                                    ) &&
                                    current != null &&
                                    current != undefined
                                ) {
                                    current = current.next[0];
                                }

                                if (
                                    current != undefined &&
                                    current != null
                                ) {
                                    setSelectedMove({
                                        index: index,
                                        color: "black"
                                    });

                                    setCurrentPosition(current);
                                }
                            }}
                        >
                            <Text
                                className={`
                                    text-sm
                                    font-medium
                                    ${selectedMove?.index === index &&
                                        selectedMove?.color === "black"
                                        ? "text-[#60A5FA]"
                                        : "text-[#E2E8F0]"
                                    }
                                `}
                            >
                                {move[1]}
                            </Text>
                        </Pressable>

                    </View>
                );
            })}
        </ScrollView>
    );
}