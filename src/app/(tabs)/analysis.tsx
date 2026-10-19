import { useEffect, useState } from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { getFullGameAnalysis } from "../api/games";
import AnalysisPanel from "../components/AnalysisPanel";
import { ChessBoard } from "../components/ChessBoard";
import { MovesGrid } from "../components/MovesGrid";
import StockFishEvaluation from '../components/StockfishEvaluation';
import { GameParser } from "../helpers/GameParser";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
    ChessBoardModel,
    ChessGame,
    Position
} from "../models/pieces";
import { setAnalysis, setIsAnalyzing, setNewGameAnalysis } from "../Store/slices/GamesSlices";
import { PlayerQuickInfo, StockFishResponse } from "../types/responses";
export default function Games() {



    const dispatch = useAppDispatch()
    const currGame = useAppSelector(
        state => state.games.currGame
    );
    const allAnalysisDone = useAppSelector(
        state => state.games.analysisByGameId
    )



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
            const parsedGame = GameParser(currGame.pgn, currGame.id)
            //set evaluation for all moves to null
            return parsedGame
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

        const parsedGame = GameParser(currGame.pgn, currGame.id);
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
                console.log("Getting full analysis for game with id: " + currGame?.id)
                const response = await getFullGameAnalysis(chessGame)
                dispatch(setAnalysis(response))
                dispatch(setIsAnalyzing(false))
                dispatch(setNewGameAnalysis({ id: currGame?.id ?? "", analysis: response }))

                console.log("Received game analysis: " + response)
            } catch (e) {
                setIsAnalyzing(false)
                console.log("Error analyzing game: " + e)
            }
        }

        if (!currGame?.id) {
            return
        }
        if (!allAnalysisDone[currGame.id]) {
            analyzeGame()
        } else {
            dispatch(setAnalysis(allAnalysisDone[currGame?.id]))

        }

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

    useEffect(() => {
        if (!currGame?.id) return;

        const cached = allAnalysisDone[currGame.id];

        console.log("GAME ID:", currGame.id);
        console.log("CACHED POSITIONS:", cached?.length);
        console.log(
            "MASTER GAMES:",
            cached?.[analysisMoveIndex]?.masterGames
        );
        console.log("ANALYSIS INDEX:", analysisMoveIndex);
        console.log("IS ANALYZING:", isAnalyzing);

    }, [currGame?.id, allAnalysisDone, analysisMoveIndex, isAnalyzing]);

    //fetch stockfish eval on every move, should store in some array
    const [currEvaluation, setCurrentEvaluation] = useState<StockFishResponse | null>(null)
    useEffect(() => {
        let cancelled = false;
        const position = currentPosition;

        // Immediately display cached evaluation
        setCurrentEvaluation(position.evaluation);

        // Don't fetch if evaluation already exists
        if (position.evaluation != null) return;

        async function getEvaluation() {
            try {
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


    const gameDate = currGame?.end_time
        ? new Date(currGame.end_time * 1000).toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Unknown date";

    const timeControl = currGame?.time_control
        ?.split("+")
        .map((value, index) => {
            if (index === 0 && !isNaN(Number(value))) {
                return `${Number(value) / 60}`;
            }
            return value;
        })
        .join("+") ?? "Unknown";

    const gameType = currGame?.time_class
        ? currGame.time_class.charAt(0).toUpperCase() +
        currGame.time_class.slice(1)
        : "Chess";

    const gameResult = (player: PlayerQuickInfo) => {
        switch (player.result) {
            case "win":
                return "1";
            case "checkmated":
            case "resigned":
            case "timeout":
            case "abandoned":
                return "0";
            default:
                return "½";
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-[#101722]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 14,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Page Header */}
                <View className="mb-5">
                    <Text className="text-white text-3xl font-bold">
                        Game Analysis
                    </Text>
                    <Text className="text-[#A4ACCC] text-sm mt-1">
                        Review your game and discover improvements
                    </Text>
                </View>

                {/* Game Information */}
                <View className="bg-[#1C2537] rounded-3xl p-5 mb-5 border border-[#35405C]">
                    <View className="flex-row justify-between items-center mb-5">
                        <View className="flex-row items-center gap-2">
                            <FontAwesome6
                                name="chess-board"
                                size={18}
                                color="#9589F7"
                                iconStyle="solid"
                            />
                            <Text className="text-white text-lg font-bold">
                                Game Overview
                            </Text>
                        </View>

                        <View className="bg-[#504B94] rounded-full px-3 py-1.5">
                            <Text className="text-[#E1DDFF] text-xs font-semibold">
                                {gameType}
                            </Text>
                        </View>
                    </View>

                    {/* Players */}
                    <View className="flex-row items-center justify-between">
                        <PlayerCard
                            username={currGame?.white.username ?? "White"}
                            rating={currGame?.white.rating}
                            color="white"
                            score={currGame ? gameResult(currGame.white) : "-"}
                        />

                        <View className="items-center px-2">
                            <Text className="text-[#A4ACCC] text-xs mb-2">
                                VS
                            </Text>
                            <Text className="text-white text-lg font-bold">
                                {currGame
                                    ? `${gameResult(currGame.white)} - ${gameResult(currGame.black)}`
                                    : "-"}
                            </Text>
                        </View>

                        <PlayerCard
                            username={currGame?.black.username ?? "Black"}
                            rating={currGame?.black.rating}
                            color="black"
                            score={currGame ? gameResult(currGame.black) : "-"}
                        />
                    </View>

                    <View className="h-[1px] bg-[#35405C] my-5" />

                    {/* Game Metadata */}
                    <View className="flex-row flex-wrap gap-y-4">
                        <InfoItem label="Date" value={gameDate} />
                        <InfoItem label="Time Control" value={timeControl} />
                        <InfoItem
                            label="Game Type"
                            value={currGame?.rated ? "Rated" : "Casual"}
                        />
                        <InfoItem
                            label="Rules"
                            value={currGame?.rules ?? "Chess"}
                        />
                    </View>

                    {!!currGame?.url && (
                        <Pressable
                            onPress={() => Linking.openURL(currGame.url)}
                            className="bg-[#242D43] rounded-xl py-3 items-center mt-5 border border-[#35405C]"
                        >
                            <Text className="text-[#C8C2FF] font-semibold text-sm">
                                View Original Game ↗
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* Chessboard */}
                <View className="bg-[#1C2537] rounded-3xl overflow-hidden mb-4 border border-[#35405C]">
                    <View className="px-4 pt-4 pb-3 flex-row justify-between items-center">
                        <Text className="text-white text-base font-bold">
                            Game Review
                        </Text>
                        <Text className="text-[#A4ACCC] text-xs">
                            Move {Math.max(0, currentPosition.moveIndex + 1)}
                        </Text>
                    </View>

                    <ChessBoard
                        currentPosition={currentPosition}
                        setCurrentPosition={setCurrentPosition}
                        chessGame={chessGame}
                        setMoves={setMoves}
                        updateAnalysisIndex={true}
                        lockMoves={false}
                        onBack={() => { }}
                        onMove={() => { }}
                        onNext={() => { }}
                    />

                    <View className="h-3" />
                </View>

                {/* Evaluation */}
                <View className="bg-[#1C2537] rounded-2xl p-4 mb-5 border border-[#35405C]">
                    <Text className="text-white text-base font-bold mb-3">
                        Position Evaluation
                    </Text>

                    <StockFishEvaluation evaluation={currEvaluation} />
                </View>

                {/* Tabs */}
                <View className="bg-[#1C2537] rounded-2xl p-1.5 flex-row mb-4 border border-[#35405C]">
                    {(["Moves", "Analysis", "Insights"] as const).map(tab => (
                        <Pressable
                            key={tab}
                            onPress={() => setSelectedTab(tab)}
                            className={`flex-1 py-3 items-center rounded-xl ${selectedTab === tab
                                ? "bg-[#D9D5FF]"
                                : "bg-transparent"
                                }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${selectedTab === tab
                                    ? "text-[#17182A]"
                                    : "text-[#A4ACCC]"
                                    }`}
                            >
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Tab Content */}
                {selectedTab === "Moves" && (
                    <View className="bg-[#1C2537] rounded-3xl p-4 min-h-[250px] border border-[#35405C]">
                        <Text className="text-white text-lg font-bold mb-4">
                            Move History
                        </Text>

                        <MovesGrid
                            game={chessGame}
                            moves={moves}
                            moveIndex={currentPosition.moveIndex}
                            setCurrentPosition={setCurrentPosition}
                            updateAnalysisIndex={true}
                        />
                    </View>
                )}

                {selectedTab === "Analysis" && (
                    <View className="bg-[#1C2537] rounded-3xl p-4 border border-[#35405C]">
                        <Text className="text-white text-lg font-bold mb-4">
                            Engine Analysis
                        </Text>

                        <AnalysisPanel
                            analysis={analysis}
                            moveIndex={analysisMoveIndex}
                            isAnalyzing={isAnalyzing}
                        />
                    </View>
                )}

                {selectedTab === "Insights" && (
                    <View className="bg-[#1C2537] rounded-3xl p-6 items-center border border-[#35405C]">
                        <FontAwesome6
                            name="lightbulb"
                            size={28}
                            color="#9589F7"
                            iconStyle="solid"
                        />
                        <Text className="text-white text-lg font-bold mt-3">
                            Game Insights
                        </Text>
                        <Text className="text-[#A4ACCC] text-center text-sm mt-2">
                            Review your analysis to identify key moments
                            and opportunities for improvement. Coming soon...

                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
type PlayerCardProps = {
    username: string;
    rating?: number;
    color: "white" | "black";
    score: string;
};

function PlayerCard({
    username,
    rating,
    color,
    score,
}: PlayerCardProps) {
    return (
        <View className="flex-1 items-center">
            <View
                className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                style={{
                    backgroundColor:
                        color === "white" ? "#D9D5FF" : "#242D43",
                    borderWidth: 1,
                    borderColor: "#504B94",
                }}
            >
                <Text
                    className="text-3xl"
                    style={{
                        color: color === "white" ? "#17182A" : "#FFFFFF",
                    }}
                >
                    {color === "white" ? "♔" : "♚"}
                </Text>
            </View>

            <Text
                className="text-white font-bold text-sm text-center"
                numberOfLines={1}
            >
                {username}
            </Text>

            <Text className="text-[#A4ACCC] text-xs mt-1">
                {rating ?? "Unrated"}
            </Text>
        </View>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <View className="w-1/2 pr-3">
            <Text className="text-[#A4ACCC] text-xs mb-1">
                {label}
            </Text>
            <Text className="text-white font-semibold text-sm">
                {value}
            </Text>
        </View>
    );
}