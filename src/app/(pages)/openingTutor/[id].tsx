
import { ChessBoard } from "@/app/components/ChessBoard";
import { MovesGrid } from "@/app/components/MovesGrid";
import { createDummyChessBoard, GameParser } from "@/app/helpers/GameParser";
import { useAppSelector } from "@/app/hooks/reduxHooks";
import { Position } from "@/app/models/pieces";
import { UCIMove } from "@/app/types/responses";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
    background: "#101722",
    card: "#1C2537",
    cardSecondary: "#242D43",
    border: "#35405C",
    accent: "#9589F7",
    accentDark: "#504B94",
    text: "#F5F5FF",
    muted: "#A4ACCC",
    errorBackground: "#472731",
    errorBorder: "#874250",
};

export default function OpeningTutor() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const allOpenings = useAppSelector(
        state => state.games.openings
    );

    const opening = allOpenings.find(val => val.id === id);

    if (!opening) {
        return (
            <SafeAreaView
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: COLORS.background }}
            >
                <Text className="text-white">
                    Opening not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <OpeningTutorContent
            opening={opening}
            onBack={() => router.back()}
        />
    );
}

type TutorProps = {
    opening: {
        id: string;
        name: string;
        pgn: string;
        eco?: string;
    };
    onBack: () => void;
};

function OpeningTutorContent({
    opening,
    onBack,
}: TutorProps) {
    const parsedOpening = useMemo(
        () => GameParser(opening.pgn, opening.id),
        [opening.id, opening.pgn]
    );

    const initialPosition = useMemo(
        () =>
            parsedOpening.positions ??
            new Position(createDummyChessBoard(), [], null),
        [parsedOpening]
    );

    const [colorToPlayAs, setColorToPlayAs] =
        useState<"white" | "black">("white");

    const [progress, setProgress] = useState(0);

    const [currentPosition, setCurrentPosition] =
        useState<Position>(initialPosition);

    const [allMoves, setAllMoves] = useState<string[][]>(
        parsedOpening.moves
    );

    const [lockMoves, setLockMoves] = useState(false);
    const [showMoves, setShowMoves] = useState(false);

    const pendingUserMove = useRef(false);
    const [isValidatingMove, setIsValidatingMove] = useState(false);
    const [isOpponentTurnReady, setIsOpponentTurnReady] = useState(false);
    const movesToPlay = useMemo(() => {
        const result: UCIMove[] = [];
        let temp: Position | null = initialPosition;

        while (temp !== null) {
            if (
                temp.move &&
                temp.position?.whosMove !== colorToPlayAs
            ) {
                result.push(temp.move);
            }

            temp = temp.next[0] ?? null;
        }

        return result;
    }, [initialPosition, colorToPlayAs]);

    const totalMoves = movesToPlay.length;

    const progressPercentage =
        totalMoves > 0
            ? Math.min((progress / totalMoves) * 100, 100)
            : 0;

    const isUsersTurn =
        currentPosition.position?.whosMove === colorToPlayAs;

    const isComplete =
        totalMoves > 0 && progress >= totalMoves;

    function checkMove() {
        const expectedMove = movesToPlay[progress];
        const playedMove = currentPosition.move;

        if (!expectedMove || !playedMove) return;

        const isCorrect =
            playedMove.from === expectedMove.from &&
            playedMove.to === expectedMove.to &&
            playedMove.promotion === expectedMove.promotion;

        if (isCorrect) {
            setProgress(prev => prev + 1);
            setLockMoves(false);
            setIsOpponentTurnReady(true);
        } else {
            setLockMoves(true);
            setIsOpponentTurnReady(false);
        }
    }

    useEffect(() => {
        if (!pendingUserMove.current) return;

        pendingUserMove.current = false;
        checkMove();
        setIsValidatingMove(false);

    }, [currentPosition]);

    function changeColor(color: "white" | "black") {
        pendingUserMove.current = false;
        setColorToPlayAs(color);
        setCurrentPosition(initialPosition);
        setProgress(0);
        setLockMoves(false);
    }

    function retryMove() {
        if (currentPosition.prev) {
            setCurrentPosition(currentPosition.prev);
        }

        pendingUserMove.current = false;
        setLockMoves(false);
    }


    useEffect(() => {

        console.log("===== AUTO MOVE DEBUG =====");
        console.log("Current move:", currentPosition.move);
        console.log("Whose turn:", currentPosition.position?.whosMove);
        console.log("Playing as:", colorToPlayAs);
        console.log("Locked:", lockMoves);
        console.log("Validating:", isValidatingMove);
        console.log("Complete:", isComplete);
        console.log("Next position:", currentPosition.next[0]);
        if (lockMoves || isValidatingMove || isComplete) return;

        if (currentPosition.position?.whosMove === colorToPlayAs) {
            return;
        }

        const nextPosition = currentPosition.next[0];

        if (!nextPosition) return;

        const timeout = setTimeout(() => {
            setCurrentPosition(nextPosition);
        }, 650);

        return () => clearTimeout(timeout);

    }, [
        currentPosition,
        colorToPlayAs,
        lockMoves,
        isValidatingMove,
        isComplete
    ]);
    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.background }}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 18,
                    paddingTop: 12,
                    paddingBottom: 36,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <Pressable
                        onPress={onBack}
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                        style={{
                            backgroundColor: COLORS.card,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                        }}
                    >
                        <Text
                            className="text-2xl"
                            style={{ color: COLORS.text }}
                        >
                            ←
                        </Text>
                    </Pressable>

                    <View className="flex-1">
                        <Text
                            className="text-2xl font-bold"
                            style={{ color: COLORS.text }}
                        >
                            Opening Tutor
                        </Text>
                        <Text
                            className="text-sm mt-1"
                            style={{ color: COLORS.muted }}
                        >
                            Practice and master chess openings
                        </Text>
                    </View>
                </View>

                {/* Opening Information */}
                <View
                    className="rounded-3xl p-4 flex-row items-center mb-4"
                    style={{
                        backgroundColor: COLORS.card,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <View
                        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                        style={{ backgroundColor: COLORS.accentDark }}
                    >
                        <Text className="text-3xl">♞</Text>
                    </View>

                    <View className="flex-1">
                        <Text
                            className="text-xl font-bold"
                            style={{ color: COLORS.text }}
                        >
                            {opening.name}
                        </Text>

                        <Text
                            className="text-sm mt-1"
                            style={{ color: COLORS.muted }}
                        >
                            {opening.eco
                                ? `${opening.eco} • Opening Practice`
                                : "Opening Practice"}
                        </Text>
                    </View>
                </View>

                {/* Perspective Selector */}
                <View
                    className="rounded-2xl p-1.5 flex-row mb-3"
                    style={{
                        backgroundColor: COLORS.card,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    {(["white", "black"] as const).map(color => {
                        const selected = colorToPlayAs === color;

                        return (
                            <Pressable
                                key={color}
                                onPress={() => changeColor(color)}
                                className="flex-1 flex-row items-center justify-center rounded-xl py-3"
                                style={{
                                    backgroundColor: selected
                                        ? "#D9D5FF"
                                        : "transparent",
                                }}
                            >
                                <Text
                                    className="text-xl mr-2"
                                    style={{
                                        color: selected
                                            ? "#17182A"
                                            : COLORS.muted,
                                    }}
                                >
                                    {color === "white" ? "♙" : "♟"}
                                </Text>

                                <Text
                                    className="font-semibold"
                                    style={{
                                        color: selected
                                            ? "#17182A"
                                            : COLORS.muted,
                                    }}
                                >
                                    {color === "white"
                                        ? "Play White"
                                        : "Play Black"}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Score Sheet Toggle */}
                <Pressable
                    onPress={() => setShowMoves(prev => !prev)}
                    className="rounded-2xl py-3 items-center mb-5"
                    style={{
                        backgroundColor: COLORS.cardSecondary,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <Text
                        className="font-semibold"
                        style={{ color: "#C8C2FF" }}
                    >
                        {showMoves
                            ? "Hide ScoreSheet  ↑"
                            : "☷  Show ScoreSheet  ↓"}
                    </Text>
                </Pressable>

                {/* Progress Card */}
                <View
                    className="rounded-3xl p-5 mb-5"
                    style={{
                        backgroundColor: COLORS.card,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text
                                className="text-sm font-medium mb-1"
                                style={{ color: COLORS.muted }}
                            >
                                Your Progress
                            </Text>

                            <Text
                                className="text-3xl font-bold"
                                style={{ color: COLORS.text }}
                            >
                                {progress}
                                <Text
                                    className="text-lg"
                                    style={{ color: COLORS.muted }}
                                >
                                    {" / "}{totalMoves}
                                </Text>
                            </Text>
                        </View>

                        <View
                            className="rounded-full px-3 py-2"
                            style={{ backgroundColor: COLORS.cardSecondary }}
                        >
                            <Text
                                className="text-sm font-semibold"
                                style={{ color: "#C8C2FF" }}
                            >
                                {Math.round(progressPercentage)}%
                            </Text>
                        </View>
                    </View>

                    <View
                        className="h-2.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "#353B59" }}
                    >
                        <View
                            className="h-full rounded-full"
                            style={{
                                width: `${progressPercentage}%`,
                                backgroundColor: COLORS.accent,
                            }}
                        />
                    </View>
                </View>

                {/* Chessboard Card */}
                <View
                    className="rounded-3xl overflow-hidden mb-4"
                    style={{
                        backgroundColor: COLORS.card,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <View className="flex-row justify-between items-center px-4 pt-4 pb-3">
                        <Text
                            className="text-base font-semibold"
                            style={{ color: COLORS.text }}
                        >
                            Practice Board
                        </Text>

                        <Text
                            className="text-xs"
                            style={{ color: COLORS.muted }}
                        >
                            Playing as {colorToPlayAs === "white" ? "White" : "Black"}
                        </Text>
                    </View>

                    <ChessBoard
                        currentPosition={currentPosition}
                        setCurrentPosition={setCurrentPosition}
                        chessGame={parsedOpening}
                        setMoves={setAllMoves}
                        lockMoves={lockMoves}
                        onBack={() => {
                            setLockMoves(false);
                        }}
                        onNext={() => {
                            if (
                                currentPosition.position?.whosMove ===
                                colorToPlayAs &&
                                progress < movesToPlay.length
                            ) {
                                setProgress(prev => prev + 1);
                            }
                        }}
                        onMove={() => {
                            pendingUserMove.current = true;
                            setIsValidatingMove(true);

                        }}
                    />

                    <View className="h-3" />
                </View>

                {/* Status Message */}
                {lockMoves ? (
                    <View
                        className="rounded-3xl p-4 mb-4"
                        style={{
                            backgroundColor: COLORS.errorBackground,
                            borderWidth: 1,
                            borderColor: COLORS.errorBorder,
                        }}
                    >
                        <View className="flex-row items-center mb-3">
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: "#793440" }}
                            >
                                <Text className="text-white text-xl">×</Text>
                            </View>

                            <View className="flex-1">
                                <Text className="text-white font-bold text-base">
                                    Not quite the right move
                                </Text>
                                <Text
                                    className="text-sm mt-1"
                                    style={{ color: "#E8B8C3" }}
                                >
                                    Go back and try again.
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={retryMove}
                            className="rounded-xl py-3 items-center"
                            style={{
                                backgroundColor: "#783C4A",
                                borderWidth: 1,
                                borderColor: "#985563",
                            }}
                        >
                            <Text className="text-white font-semibold">
                                ← Try Again
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <View
                        className="rounded-3xl p-4 flex-row items-center mb-4"
                        style={{
                            backgroundColor: COLORS.card,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                        }}
                    >
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                            style={{ backgroundColor: COLORS.accentDark }}
                        >
                            <Text className="text-2xl">✦</Text>
                        </View>

                        <View className="flex-1">
                            <Text
                                className="font-bold text-base"
                                style={{ color: COLORS.text }}
                            >
                                {isComplete
                                    ? "Opening Complete!"
                                    : isUsersTurn
                                        ? "Find the next move"
                                        : "Opponent's turn"}
                            </Text>

                            <Text
                                className="text-sm mt-1"
                                style={{ color: COLORS.muted }}
                            >
                                {isComplete
                                    ? "Great work! You've completed this opening."
                                    : isUsersTurn
                                        ? "Play the correct move in this opening line."
                                        : "Follow the next move in the opening."}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Optional ScoreSheet */}
                {showMoves && (
                    <View
                        className="rounded-3xl p-4 mb-4"
                        style={{
                            backgroundColor: COLORS.card,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                        }}
                    >
                        <View className="flex-row justify-between items-center mb-3">
                            <Text
                                className="text-lg font-bold"
                                style={{ color: COLORS.text }}
                            >
                                ☷  ScoreSheet
                            </Text>

                            <Pressable
                                onPress={() => setShowMoves(false)}
                            >
                                <Text
                                    className="font-medium"
                                    style={{ color: COLORS.accent }}
                                >
                                    Hide
                                </Text>
                            </Pressable>
                        </View>

                        <MovesGrid
                            game={parsedOpening}
                            moves={allMoves}
                            moveIndex={0}
                            setCurrentPosition={setCurrentPosition}
                            updateAnalysisIndex={false}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
