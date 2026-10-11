import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    containers,
    TextStyles
} from "../../../themes/themes";

import { getFullGameAnalysis } from "../api/games";
import AnalysisPanel from "../components/AnalysisPanel";
import { ChessBoard } from "../components/ChessBoard";
import { MovesGrid } from "../components/MovesGrid";
import { GameParser } from "../helpers/GameParser";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
    ChessBoardModel,
    ChessGame,
    Position
} from "../models/pieces";
import { setAnalysis, setIsAnalyzing } from "../Store/slices/GamesSlices";
export default function Games() {
    const dispatch = useAppDispatch()
    const currGame = useAppSelector(
        state => state.games.currGame
    );



    const analysis = useAppSelector(
        state => state.games.analysis
    )
    const isAnalyzing = useAppSelector(
        state => state.games.isAnalyzing
    )

    useEffect(() => {
        if (analysis != null) {
            console.log("Analysis Received: " + JSON.stringify(analysis))
        }
    }, [analysis])


    /*
     * Parse the PGN once when this screen is created.
     */

    const [chessGame, setChessGame] = useState<ChessGame>(() => {

        if (currGame?.pgn) {
            return GameParser(currGame.pgn);
        }

        // Fallback empty game
        const board = new ChessBoardModel();
        board.initBoard();

        const position = new Position(
            board,
            [],
            null
        );

        let game = new ChessGame(position)
        game.moveIndex = -1
        return new ChessGame(position);
    });

    useEffect(() => {
        if (!currGame?.pgn) return;

        const parsedGame = GameParser(currGame.pgn);
        if (parsedGame == null) {
            return
        }
        setChessGame(parsedGame);
        setCurrentPosition(parsedGame.positions!!);
        setMoves(parsedGame.moves);

    }, [currGame]);

    useEffect(() => {

        async function analyzeGame() {
            try {
                dispatch(setIsAnalyzing(true))
                const response = await getFullGameAnalysis(chessGame)
                dispatch(setAnalysis(response))
                dispatch(setIsAnalyzing(false))

                console.log("Received game analysis: " + response)
            } catch (e) {
                console.log("Error analyzing game: " + e)
            }
        }


        analyzeGame()

    }, [chessGame])

    /*
     * Start at the initial position of the parsed game.
     *
     * Assuming chessGame.positions is your initial/root Position.
     */


    const dummyBoard = new ChessBoardModel
    dummyBoard.initBoard()
    const dummyPosition = new Position(dummyBoard, [], null)
    const [currentPosition, setCurrentPosition] =
        useState<Position>(() => chessGame.positions ? chessGame.positions : dummyPosition);
    /*
     * chessGame is guaranteed to be ChessGame now,
     * so .moves is safe.
     */
    const [moves, setMoves] =
        useState<string[][]>(() => chessGame.moves);


    const [selectedTab, setSelectedTab] =
        useState<"Moves" | "Analysis" | "Insights">("Moves");

    const analysisMoveIndex = useAppSelector(state => state.games.analyzingMoveIndex)
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
                        className={`
                            flex-1 h-[38px] rounded-xl
                            items-center justify-center
                            ${selectedTab === "Moves"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }
                        `}
                        onPress={() => setSelectedTab("Moves")}
                    >
                        <Text
                            className={`
                                text-[13px]
                                ${selectedTab === "Moves"
                                    ? "text-black font-semibold"
                                    : "text-gray-300"
                                }
                            `}
                        >
                            Moves
                        </Text>
                    </Pressable>


                    <Pressable
                        className={`
                            flex-1 h-[38px] rounded-xl
                            items-center justify-center
                            ${selectedTab === "Analysis"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }
                        `}
                        onPress={() => setSelectedTab("Analysis")}
                    >
                        <Text
                            className={`
                                text-[13px]
                                ${selectedTab === "Analysis"
                                    ? "text-black font-semibold"
                                    : "text-gray-300"
                                }
                            `}
                        >
                            Analysis
                        </Text>
                    </Pressable>


                    <Pressable
                        className={`
                            flex-1 h-[38px] rounded-xl
                            items-center justify-center
                            ${selectedTab === "Insights"
                                ? "bg-[#7289FF]"
                                : "bg-[#101923]"
                            }
                        `}
                        onPress={() => setSelectedTab("Insights")}
                    >
                        <Text
                            className={`
                                text-[13px]
                                ${selectedTab === "Insights"
                                    ? "text-black font-semibold"
                                    : "text-gray-300"
                                }
                            `}
                        >
                            Insights
                        </Text>
                    </Pressable>

                </View>


                <View className="w-full">

                    <ChessBoard
                        currentPosition={currentPosition}
                        setCurrentPosition={setCurrentPosition}
                        chessGame={chessGame}
                        setMoves={setMoves}
                    />

                </View>
                {
                    selectedTab == 'Analysis' &&
                    <AnalysisPanel
                        analysis={analysis}
                        moveIndex={analysisMoveIndex}
                        isAnalyzing={isAnalyzing}
                    />
                }

                {
                    selectedTab == 'Moves' &&
                    <View className="w-full min-h-[300px] bg-[#080B0F]">

                        <MovesGrid
                            game={chessGame}
                            moves={moves}
                            moveIndex={currentPosition.moveIndex}
                            setCurrentPosition={setCurrentPosition}
                        />

                    </View>
                }

            </SafeAreaView>

        </ScrollView>
    );
}