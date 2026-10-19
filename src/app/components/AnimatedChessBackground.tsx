
import { useEffect } from "react";
import {
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import Svg, {
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const GRID_SIZE = 64;



type WaveProps = {
    width: number;
    baseY: number;
    amplitude: number;
    thickness: number;
    duration: number;
    reverse?: boolean;
    opacity?: number;
    gradientId: string;
};

function FlowingWave({
    width,
    baseY,
    amplitude,
    thickness,
    duration,
    reverse = false,
    opacity = 1,
    gradientId,
}: WaveProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration,
                easing: Easing.inOut(Easing.sin),
            }),
            -1,
            true
        );
    }, [duration]);

    const animatedProps = useAnimatedProps(() => {
        const phase = progress.value * Math.PI * 2;
        const direction = reverse ? -1 : 1;

        const motion = Math.sin(phase) * amplitude * direction;
        const secondaryMotion = Math.cos(phase) * amplitude * 0.45;

        const startX = -width * 0.25;
        const endX = width * 1.25;

        const topStart = baseY - amplitude * 0.4 + motion * 0.3;
        const topEnd = baseY + amplitude * 0.3 - motion * 0.3;

        const topControl1 = baseY - amplitude * 1.8 + motion;
        const topControl2 = baseY + amplitude * 1.6 + secondaryMotion;

        const bottomStart = topStart + thickness;
        const bottomEnd = topEnd + thickness;

        const bottomControl1 =
            topControl1 + thickness * 1.25;

        const bottomControl2 =
            topControl2 + thickness * 0.7;

        return {
            d: `
                M ${startX} ${topStart}

                C ${width * 0.18} ${topControl1},
                  ${width * 0.55} ${topControl2},
                  ${endX} ${topEnd}

                L ${endX} ${bottomEnd}

                C ${width * 0.55} ${bottomControl2},
                  ${width * 0.18} ${bottomControl1},
                  ${startX} ${bottomStart}

                Z
            `,
        };
    });

    return (
        <AnimatedPath
            animatedProps={animatedProps}
            fill={`url(#${gradientId})`}
            opacity={opacity}
        />
    );
}


function GlowingSquare({
    top,
    left,
    delay,
}: {
    top: number;
    left: number;
    delay: number;
}) {
    const glow = useSharedValue(0);

    useEffect(() => {
        glow.value = withRepeat(
            withTiming(1, {
                duration: 3500 + delay,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            glow.value,
            [0, 1],
            [0.05, 0.3]
        ),
        transform: [
            {
                scale: interpolate(
                    glow.value,
                    [0, 1],
                    [0.95, 1.05]
                ),
            },
        ],
    }));

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.glowingSquare,
                { top, left },
                animatedStyle,
            ]}
        />
    );
}

export function AnimatedChessBackground() {
    const { width, height } = useWindowDimensions();

    const ROWS = Math.ceil(height / GRID_SIZE) + 2;
    const COLS = Math.ceil(width / GRID_SIZE) + 2;

    return (
        <View
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
        >
            {/* Background */}
            <View style={styles.background} />

            {/* Chessboard */}
            <View style={styles.board}>
                {Array.from({ length: ROWS }).map((_, row) => (
                    <View key={row} style={styles.boardRow}>
                        {Array.from({ length: COLS }).map((_, col) => (
                            <View
                                key={`${row}-${col}`}
                                style={[
                                    styles.boardSquare,
                                    (row + col) % 2 === 0 &&
                                    styles.boardSquareDark,
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>

            {/* Glowing squares */}
            <GlowingSquare
                top={height * 0.12}
                left={width * 0.15}
                delay={0}
            />

            <GlowingSquare
                top={height * 0.28}
                left={width * 0.72}
                delay={900}
            />

            <GlowingSquare
                top={height * 0.72}
                left={width * 0.12}
                delay={1600}
            />

            <GlowingSquare
                top={height * 0.84}
                left={width * 0.7}
                delay={2400}
            />

            {/* Animated SVG Waves */}
            <Svg
                width={width}
                height={height}
                style={StyleSheet.absoluteFill}
            >
                <Defs>
                    {/* Bright blue ocean ribbon */}
                    <LinearGradient
                        id="oceanBright"
                        x1="0%"
                        y1="0%"
                        x2="65%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor="#04162D" stopOpacity={0.05} />
                        <Stop offset="18%" stopColor="#0648A5" stopOpacity={0.4} />
                        <Stop offset="40%" stopColor="#087BE8" stopOpacity={0.85} />
                        <Stop offset="53%" stopColor="#45C4FF" stopOpacity={0.95} />
                        <Stop offset="65%" stopColor="#1768CE" stopOpacity={0.7} />
                        <Stop offset="85%" stopColor="#082C68" stopOpacity={0.3} />
                        <Stop offset="100%" stopColor="#04162D" stopOpacity={0} />
                    </LinearGradient>

                    {/* Darker, deeper blue ocean ribbon */}
                    <LinearGradient
                        id="oceanDeep"
                        x1="0%"
                        y1="0%"
                        x2="80%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor="#03142D" stopOpacity={0} />
                        <Stop offset="25%" stopColor="#063A8A" stopOpacity={0.35} />
                        <Stop offset="50%" stopColor="#1555BA" stopOpacity={0.6} />
                        <Stop offset="75%" stopColor="#073D91" stopOpacity={0.4} />
                        <Stop offset="100%" stopColor="#04162D" stopOpacity={0} />
                    </LinearGradient>

                    {/* Soft cyan highlights */}
                    <LinearGradient
                        id="oceanGlow"
                        x1="0%"
                        y1="0%"
                        x2="45%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor="#0751AD" stopOpacity={0} />
                        <Stop offset="35%" stopColor="#147DE3" stopOpacity={0.2} />
                        <Stop offset="50%" stopColor="#7BDEFF" stopOpacity={0.7} />
                        <Stop offset="65%" stopColor="#147DE3" stopOpacity={0.2} />
                        <Stop offset="100%" stopColor="#0751AD" stopOpacity={0} />
                    </LinearGradient>
                </Defs>

                {/* Top waves */}
                <FlowingWave
                    width={width}
                    baseY={height * 0.13}
                    amplitude={48}
                    thickness={115}
                    duration={14000}
                    gradientId="oceanDeep"
                    opacity={0.75}
                />

                <FlowingWave
                    width={width}
                    baseY={height * 0.16}
                    amplitude={55}
                    thickness={68}
                    duration={17000}
                    reverse
                    gradientId="oceanBright"
                    opacity={0.85}
                />

                <FlowingWave
                    width={width}
                    baseY={height * 0.19}
                    amplitude={35}
                    thickness={22}
                    duration={19000}
                    gradientId="oceanGlow"
                    opacity={0.85}
                />

                {/* Bottom waves */}
                <FlowingWave
                    width={width}
                    baseY={height * 0.80}
                    amplitude={55}
                    thickness={140}
                    duration={16000}
                    reverse
                    gradientId="oceanDeep"
                    opacity={0.8}
                />

                <FlowingWave
                    width={width}
                    baseY={height * 0.84}
                    amplitude={60}
                    thickness={75}
                    duration={18000}
                    gradientId="oceanBright"
                    opacity={0.85}
                />

                <FlowingWave
                    width={width}
                    baseY={height * 0.87}
                    amplitude={40}
                    thickness={25}
                    duration={20000}
                    reverse
                    gradientId="oceanGlow"
                    opacity={0.9}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "#061321",
    },

    board: {
        ...StyleSheet.absoluteFill,
        opacity: 0.12,
        transform: [{ rotate: "-12deg" }],
    },

    boardRow: {
        flexDirection: "row",
    },

    boardSquare: {
        width: GRID_SIZE,
        height: GRID_SIZE,
        backgroundColor: "#102B46",
    },

    boardSquareDark: {
        backgroundColor: "#071624",
    },

    glowingSquare: {
        position: "absolute",
        width: GRID_SIZE,
        height: GRID_SIZE,
        borderWidth: 1,
        borderColor: "#55B7FF",
        backgroundColor: "rgba(40, 145, 255, 0.12)",
        shadowColor: "#3FA9FF",
        shadowOpacity: 0.8,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
        elevation: 5,
    },
});
