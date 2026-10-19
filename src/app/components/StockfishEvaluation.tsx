import { ActivityIndicator, Text, View } from "react-native";
import { StockFishResponse } from "../types/responses";

type Props = {
    evaluation: StockFishResponse | null
};

export default function StockFishEvaluation({ evaluation }: Props) {

    const rawScore = evaluation?.evaluation

    const score = rawScore != null && rawScore != "" ? Number(rawScore) : null
    const mate = evaluation?.mate;

    const isMate = mate !== null && mate !== undefined;
    const hasScore = score != null && typeof score === "number";


    const displayScore = isMate
        ? `M${mate}`
        : hasScore
            ? `${score > 0 ? "+" : ""}${score.toFixed(2)}`
            : "—";

    const description = isMate
        ? mate > 0
            ? "White has a forced mate"
            : mate < 0
                ? "Black has a forced mate"
                : "Checkmate"
        : !hasScore
            ? "Analyzing position..."
            : score > 0.3
                ? "White is better"
                : score < -0.3
                    ? "Black is better"
                    : "Position is approximately equal";

    return (
        <View className="mx-3 mt-3 mb-4 rounded-2xl bg-[#152535] border border-[#263C50] p-4">

            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-base font-semibold">
                    Stockfish Evaluation
                </Text>

                <View className="bg-[#243C51] px-3 py-1 rounded-full">
                    <Text className="text-[#A8C8E7] text-xs font-semibold">
                        Depth 15
                    </Text>
                </View>
            </View>

            <View className="h-[1px] bg-[#263C50] mb-4" />

            <View className="flex-row items-center justify-between">

                <View>
                    <Text className="text-[#91A8BC] text-xs mb-1">
                        POSITION EVALUATION
                    </Text>

                    <Text className="text-white text-3xl font-bold">
                        {displayScore}
                    </Text>

                    <Text className="text-[#91A8BC] text-xs mt-2">
                        {description}
                    </Text>
                </View>

                {!evaluation && (
                    <ActivityIndicator
                        size="small"
                        color="#A8C8E7"
                    />
                )}
            </View>

        </View>
    );
}