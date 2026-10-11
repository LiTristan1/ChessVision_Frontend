import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAppDispatch } from "../hooks/reduxHooks";
import { ChessGame, Position } from "../models/pieces";
import { setCurrentAnalyzedMove } from "../Store/slices/GamesSlices";

type Props = {
    game: ChessGame;
    moves: string[][];
    moveIndex: number;
    setCurrentPosition: React.Dispatch<
        React.SetStateAction<Position>
    >;
};

type SelectedMove = {
    index: number;
    color: "white" | "black";
};

export function MovesGrid({
    game,
    moves,
    moveIndex,
    setCurrentPosition
}: Props) {
    const dispatch = useAppDispatch();

    const [selectedMove, setSelectedMove] =
        useState<SelectedMove | null>(null);

    const handleMovePress = (
        index: number,
        color: "white" | "black"
    ) => {
        const analysisIndex =
            2 * index + (color === "black" ? 1 : 0);

        let current = game.positions?.next[0] ?? null;

        for (let i = 0; i < analysisIndex && current; i++) {
            current = current.next[0] ?? null;
        }

        if (!current) {
            console.log("Position not found:", analysisIndex);
            return;
        }

        setSelectedMove({ index, color });

        dispatch(setCurrentAnalyzedMove(analysisIndex));

        setCurrentPosition(current);
    };

    return (
        <View className="w-full bg-[#080D14] rounded-xl overflow-hidden">

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-[#131E2C] border-b border-[#26364A]">
                <Text className="w-[16%] text-[#71839A] text-xs font-semibold">
                    #
                </Text>

                <Text className="w-[42%] text-[#CBD5E1] text-xs font-semibold">
                    White
                </Text>

                <Text className="w-[42%] text-[#CBD5E1] text-xs font-semibold">
                    Black
                </Text>
            </View>

            {/* Move rows */}
            <ScrollView
                className="w-full max-h-[340px]"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {moves.map((move, index) => {
                    const isSelectedRow =
                        selectedMove?.index === index;

                    const isWhiteSelected =
                        isSelectedRow &&
                        selectedMove?.color === "white";

                    const isBlackSelected =
                        isSelectedRow &&
                        selectedMove?.color === "black";

                    return (
                        <View
                            key={index}
                            className={`
                                flex-row
                                items-center
                                px-3
                                py-1
                                border-l-[3px]
                                ${isSelectedRow
                                    ? "bg-[#1B2C46] border-[#7289FF]"
                                    : index % 2 === 0
                                        ? "bg-[#0D1520] border-transparent"
                                        : "bg-[#111B28] border-transparent"
                                }
                            `}
                        >
                            {/* Move number */}
                            <View className="w-[16%] pl-1">
                                <Text
                                    className={`
                                        text-xs font-medium
                                        ${isSelectedRow
                                            ? "text-[#A5B4FC]"
                                            : "text-[#64748B]"
                                        }
                                    `}
                                >
                                    {index + 1}.
                                </Text>
                            </View>

                            {/* White move */}
                            <Pressable
                                className={`
                                    w-[42%]
                                    rounded-lg
                                    px-3
                                    py-2
                                    ${isWhiteSelected
                                        ? "bg-[#7289FF]"
                                        : "bg-transparent"
                                    }
                                `}
                                onPress={() =>
                                    handleMovePress(index, "white")
                                }
                            >
                                <Text
                                    className={`
                                        text-sm
                                        font-semibold
                                        ${isWhiteSelected
                                            ? "text-[#080D14]"
                                            : "text-[#E2E8F0]"
                                        }
                                    `}
                                >
                                    {move[0]}
                                </Text>
                            </Pressable>

                            {/* Black move */}
                            <Pressable
                                className={`
                                    w-[42%]
                                    rounded-lg
                                    px-3
                                    py-2
                                    ${isBlackSelected
                                        ? "bg-[#7289FF]"
                                        : "bg-transparent"
                                    }
                                `}
                                onPress={() =>
                                    handleMovePress(index, "black")
                                }
                                disabled={!move[1]}
                            >
                                <Text
                                    className={`
                                        text-sm
                                        font-semibold
                                        ${isBlackSelected
                                            ? "text-[#080D14]"
                                            : move[1]
                                                ? "text-[#E2E8F0]"
                                                : "text-[#475569]"
                                        }
                                    `}
                                >
                                    {move[1] || "—"}
                                </Text>
                            </Pressable>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}