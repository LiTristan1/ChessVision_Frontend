import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from "../components/ChessBoard";
import { MovesGrid } from "../components/MovesGrid";
import { ChessBoardModel, ChessGame, Position } from "../models/pieces";
import { containers, TextStyles } from "../themes/themes";
export default function Games() {

    let initChessBoard = new ChessBoardModel()
    initChessBoard.initBoard()
    let initPosition = new Position(initChessBoard, [], null)

    const [chessGame, setChessGame] =
        useState(new ChessGame(initPosition))

    const [currentPosition, setCurrentPosition] =
        useState<Position>(initPosition)

    const [moves, setMoves] = useState<string[][]>(chessGame.moves)
    const [selectedTab, setSelectedTab] =
        useState<"Moves" | "Analysis" | "Insights">("Moves");
    console.log("Initialized moves", moves)
    return (
        <ScrollView style={containers.PrimaryContainer}>
            <SafeAreaView>
                <Text style={TextStyles.tertiary}>
                    Magnus Carlsen vs Hikaru Nakamura
                </Text>
                <Text style={TextStyles.subtitle}>
                    Speed Chess Championship 2023
                </Text>

                <View className="w-full flex-row gap-2 mt-3 mb-3">

                    <Pressable
                        className={`flex-1 h-[38px] rounded-xl items-center justify-center
            ${selectedTab === "Moves"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }`
                        }
                        onPress={() => setSelectedTab("Moves")}
                    >
                        <Text
                            className={`text-[13px] ${selectedTab === "Moves"
                                ? "text-black font-semibold"
                                : "text-gray-300"
                                }`}
                        >
                            Moves
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 h-[38px] rounded-xl items-center justify-center
            ${selectedTab === "Analysis"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }`
                        }
                        onPress={() => setSelectedTab("Analysis")}
                    >
                        <Text
                            className={`text-[13px] ${selectedTab === "Analysis"
                                ? "text-black font-semibold"
                                : "text-gray-300"
                                }`}
                        >
                            Analysis
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 h-[38px] rounded-xl items-center justify-center
            ${selectedTab === "Insights"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }`
                        }
                        onPress={() => setSelectedTab("Insights")}
                    >
                        <Text
                            className={`text-[13px] ${selectedTab === "Insights"
                                ? "text-black font-semibold"
                                : "text-gray-300"
                                }`}
                        >
                            Insights
                        </Text>
                    </Pressable>

                </View>
                <View
                    className='w-full'
                >
                    <ChessBoard
                        currentPosition={currentPosition}
                        setCurrentPosition={setCurrentPosition}
                        chessGame={chessGame}
                        setMoves={setMoves}
                    />
                </View>
                <View className='w-full min-h-[300px] bg-[#080B0F]'>
                    <MovesGrid
                        game={chessGame}
                        moves={moves}
                    />
                </View>

            </SafeAreaView>
        </ScrollView>
    )
}