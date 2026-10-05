import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containers } from "../../../themes/themes";
import { getUserGames } from "../api/games";
import Loading from "../components/Loading";
import { MonthlyGamesBox } from "../components/MonthlyGamesBox";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setGamesByYear } from "../Store/slices/GamesSlices";
import { gamesByYear } from "../types/responses";

export default function Explorer() {

    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    // Current year + previous 19 years
    const years = Array.from(
        { length: 20 },
        (_, index) => currentYear - index
    );

    const games = useAppSelector(
        state => state.games.totalGames
    );

    const dispatch = useAppDispatch()

    const totalGames =
        games[selectedYear]?.reduce(
            (total, month) => total + month.length,
            0
        ) ?? 0;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return (
        <SafeAreaView style={containers.PrimaryContainer}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 24
                }}
            >

                {/* Page Header */}
                <View className="px-2 pt-3 pb-5">

                    <Text className="text-[#4D7CFE] text-sm font-semibold uppercase tracking-widest">
                        Games
                    </Text>

                    <View className="flex-row items-start justify-between mt-1">

                        {/* Year Dropdown */}
                        <View className="relative">

                            <Pressable
                                onPress={() =>
                                    setYearDropdownOpen(prev => !prev)
                                }
                                className="flex-row items-center gap-2"
                            >
                                <Text className="text-white text-4xl font-bold">
                                    {selectedYear}
                                </Text>

                                <Text className="text-[#4D7CFE] text-lg">
                                    {yearDropdownOpen ? "▲" : "▼"}
                                </Text>
                            </Pressable>

                            {/* Dropdown */}
                            {yearDropdownOpen && (
                                <View className="mt-2 bg-[#0B1929] rounded-xl border border-[#1E3042] overflow-hidden">

                                    {years.map(year => (
                                        <Pressable
                                            key={year}
                                            onPress={async () => {
                                                setSelectedYear(year);
                                                setYearDropdownOpen(false);
                                                if (games[year] == null) {
                                                    setIsLoading(true)

                                                    console.log("Fetching games for year: " + year)
                                                    const response = await getUserGames(year)
                                                    const games_obj: gamesByYear = {
                                                        year: year,
                                                        games: response
                                                    }

                                                    dispatch(setGamesByYear(games_obj))
                                                    setIsLoading(false)

                                                }
                                            }}
                                            className={`px-5 py-3 border-b border-[#1E3042] ${selectedYear === year
                                                ? "bg-[#4D7CFE]"
                                                : "active:bg-[#14263A]"
                                                }`}
                                        >
                                            <Text
                                                className={`text-base font-semibold ${selectedYear === year
                                                    ? "text-white"
                                                    : "text-gray-300"
                                                    }`}
                                            >
                                                {year}
                                            </Text>
                                        </Pressable>
                                    ))}

                                </View>
                            )}

                        </View>

                        {/* Game count / Retry */}
                        <View className="items-end gap-2">

                            <Text className="text-gray-400 text-sm">
                                {totalGames}{" "}
                                {totalGames === 1 ? "game" : "games"}
                            </Text>

                            <Pressable
                                onPress={async () => {
                                    setIsLoading(true)
                                    const response = await getUserGames(selectedYear)
                                    const games_obj: gamesByYear = {
                                        year: selectedYear,
                                        games: response
                                    }

                                    dispatch(setGamesByYear(games_obj))
                                    setIsLoading(false)

                                }
                                }
                                className="bg-[#4D7CFE] px-4 py-2 rounded-lg active:opacity-70"
                            >
                                <Text className="text-white text-sm font-semibold">
                                    Retry
                                </Text>
                            </Pressable>

                        </View>

                    </View>

                    <Text className="text-gray-400 text-sm mt-2">
                        Review your games throughout the year
                    </Text>

                </View>

                {/* Divider */}
                <View className="h-[1px] bg-[#1E3042] mx-2 mb-4" />
                {
                    isLoading ? <Loading /> : (

                        < View className="gap-3 px-2">
                            {/* Monthly Games */}
                            {months.map((month, index) => (
                                <MonthlyGamesBox
                                    key={month}
                                    monthIndex={index}
                                    games={games[selectedYear]?.[index] ?? []}
                                />
                            ))}

                        </View>
                    )

                }

            </ScrollView>


        </SafeAreaView >
    );
}