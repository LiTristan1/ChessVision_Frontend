
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getGameById } from "@/app/api/games";
import { ChessBoard } from "@/app/components/ChessBoard";
import { MovesGrid } from "@/app/components/MovesGrid";
import StockFishEvaluation from "@/app/components/StockfishEvaluation";
import { createDummyChessBoard, GameParser } from "@/app/helpers/GameParser";
import { ChessGame, Position } from "@/app/models/pieces";
import type { StockFishResponse } from "@/app/types/responses";
export default function GrandmasterGame() {
    const router = useRouter();

    const {
        id,
        white,
        black,
        whiteElo,
        blackElo,
        event,
        result
    } = useLocalSearchParams<{
        id: string;
        white?: string;
        black?: string;
        whiteElo?: string;
        blackElo?: string;
        event?: string;
        result?: string;
    }>();

    const [chessGame, setChessGame] =
        useState<ChessGame | null>(null);

    const [currentPosition, setCurrentPosition] =
        useState<Position>(new Position(createDummyChessBoard(), [], null));

    const [moves, setMoves] = useState<string[][]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currEvaluation, setCurrentEvaluation] = useState<StockFishResponse | null>(null)


    //get position evaluation
    useEffect(() => {
        let cancelled = false;
        const position = currentPosition;

        // Immediately display cached evaluation
        setCurrentEvaluation(position.evaluation);

        // Don't fetch if evaluation already exists
        if (position.evaluation != null) return;

        async function getEvaluation() {

            try {
                if (chessGame == null) {
                    return
                }
                await position.getEvaluation(chessGame);
                // Only update UI if position is still selected
                if (!cancelled) {
                    setCurrentEvaluation(position.evaluation);
                }
            } catch (error) {
                console.log("Stockfish evaluation error:", error);
            }
        }

        const timeout = setTimeout(() => {
            getEvaluation();
        }, 800);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };

    }, [currentPosition, chessGame]);
    // Fetch and parse selected grandmaster game
    useEffect(() => {
        let cancelled = false;

        async function loadGame() {
            if (!id) {

                setError("No game ID provided.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                setChessGame(null);
                setCurrentPosition(new Position(createDummyChessBoard(), [], null));
                setMoves([]);

                const pgn = await getGameById(id);
                console.log("Retrieved from call: " + pgn)

                if (typeof pgn !== "string" || !pgn) {
                    console.log("no pgn or type not string pgn: " + pgn)
                    throw new Error("No valid PGN returned.");
                }

                const parsedGame = GameParser(pgn, id);

                if (!parsedGame?.positions) {
                    throw new Error("Unable to parse game.");
                }

                if (cancelled) return

                setChessGame(parsedGame);
                setCurrentPosition(parsedGame.positions);
                setMoves(parsedGame.moves);
                console.log("set Data!");

            } catch (e) {
                if (!cancelled) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Failed to load grandmaster game."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadGame();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // Fetch Stockfish evaluation when position changes
    useEffect(() => {
        if (!currentPosition || !chessGame) return;

        let cancelled = false;

        if (currentPosition.evaluation != null) return;

        const timeout = setTimeout(async () => {
            try {
                await currentPosition.getEvaluation(chessGame);

                if (!cancelled) {
                    // Trigger rerender after evaluation updates
                    setCurrentPosition(current => {
                        if (current !== currentPosition) return current;
                        return current;
                    });
                }
            } catch (e) {
                console.log("Stockfish error:", e);
            }
        }, 800);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [currentPosition, chessGame]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-[#101C28] items-center justify-center gap-3">
                <ActivityIndicator size="large" color="#7289FF" />

                <Text className="text-gray-300">
                    Loading grandmaster game...
                </Text>
            </SafeAreaView>
        );
    }

    if (error || !chessGame) {

        return (
            <SafeAreaView className="flex-1 bg-[#101C28] justify-center p-5 gap-4">
                <Text className="text-white text-xl font-semibold">
                    Unable to load game
                </Text>

                <Text className="text-gray-400">
                    {error ?? "Game data is unavailable."}
                </Text>

                <Pressable
                    className="bg-[#7289FF] rounded-xl p-3 items-center"
                    onPress={() => router.back()}
                >
                    <Text className="text-black font-semibold">
                        Go Back
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#101C28]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 14,
                    paddingBottom: 40,
                    gap: 16
                }}
            >
                {/* Page header */}
                <View className="flex-row items-center gap-3 mt-2">
                    <Pressable
                        onPress={() => router.back()}
                        className="bg-[#152535] rounded-xl px-4 py-3"
                    >
                        <Text className="text-white text-lg">‹</Text>
                    </Pressable>

                    <View className="flex-1">
                        <Text className="text-white text-xl font-bold">
                            Grandmaster Game
                        </Text>

                        <Text className="text-[#A8C8E7] text-xs mt-1">
                            MASTER GAME ARCHIVE
                        </Text>
                    </View>
                </View>

                {/* Player and tournament information */}
                <View className="bg-[#152535] rounded-2xl p-4 gap-4 border border-[#263C50]">

                    <View className="flex-row justify-between items-center">
                        <Text
                            className="text-[#A8C8E7] text-xs flex-1"
                            numberOfLines={2}
                        >
                            {event ?? "Master Game"}
                        </Text>

                        <View className="bg-[#263C50] px-3 py-2 rounded-lg ml-3">
                            <Text className="text-white font-semibold">
                                {result ?? "—"}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">

                        <View className="flex-1 gap-1">
                            <Text
                                className="text-white font-semibold text-base"
                                numberOfLines={1}
                            >
                                {white ?? "White"}
                            </Text>

                            <Text className="text-gray-400 text-xs">
                                White · {whiteElo || "—"}
                            </Text>
                        </View>

                        <Text className="text-gray-500 font-bold mx-3">
                            VS
                        </Text>

                        <View className="flex-1 items-end gap-1">
                            <Text
                                className="text-white font-semibold text-base"
                                numberOfLines={1}
                            >
                                {black ?? "Black"}
                            </Text>

                            <Text className="text-gray-400 text-xs">
                                Black · {blackElo || "—"}
                            </Text>
                        </View>

                    </View>
                </View>

                {/* Chessboard */}
                <View className="w-full">
                    <ChessBoard
                        currentPosition={currentPosition}
                        setCurrentPosition={setCurrentPosition}
                        chessGame={chessGame}
                        setMoves={setMoves}
                        updateAnalysisIndex={false}
                        lockMoves={false}
                        onBack={() => {

                        }}
                        onMove={() => {

                        }}
                        onNext ={() => {
                            
                        }}

                    />
                </View>

                {/* Stockfish evaluation */}
                <View className="bg-[#152535] rounded-xl p-3">
                    <StockFishEvaluation
                        evaluation={currEvaluation}
                    />
                </View>

                {/* Move scoresheet */}
                <View className="bg-[#080B0F] rounded-2xl p-3 gap-3 border border-[#263C50]">

                    <View className="flex-row justify-between items-center">
                        <Text className="text-white text-base font-semibold">
                            Move Scoresheet
                        </Text>

                        <Text className="text-gray-400 text-xs">
                            {moves.flat().length} half-moves
                        </Text>
                    </View>

                    <View className="min-h-[260px]">
                        <MovesGrid
                            game={chessGame}
                            moves={moves}
                            moveIndex={currentPosition.moveIndex}
                            setCurrentPosition={setCurrentPosition}
                            updateAnalysisIndex={false}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
