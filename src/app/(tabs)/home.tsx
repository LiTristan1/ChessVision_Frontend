import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { containers } from "../../../themes/themes";
import { getFullProfile } from "../api/player";
import { ActionBox } from "../components/ActionBox";
import { AppTitle } from "../components/appTitle";
import { RatingCard } from "../components/RatingCard";
import { SearchBar } from "../components/SearchBar";
import { Slide } from "../components/Slide";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setFullProfile } from "../Store/slices/PlayerSlice";

export default function Home() {

  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.player.fullProfile)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function getProfile() {
    setIsLoading(true)
    console.log("Use effect getting profile")
    const response = await getFullProfile()

    console.log("Retrieved full user profile: " + JSON.stringify(response))
    dispatch(setFullProfile(response))
    setIsLoading(false)
  }

  useEffect(() => {

    getProfile()
  }, [])

  return (
    <SafeAreaView style={containers.PrimaryContainer}>
      <ScrollView
        contentContainerStyle={[
          containers.ScrollContainer,
          { paddingBottom: 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* App Title */}
        <AppTitle showOnlyTitle={true} />

        {/* Welcome Section */}
        <View className="mt-5 mb-5">
          <Text className="text-[#8FA5BA] text-xs font-semibold tracking-widest mb-2">
            YOUR CHESS DASHBOARD
          </Text>

          <Text className="text-white text-2xl font-bold">
            Welcome back,{" "}
            <Text className="text-[#A8C8E7]">
              {profile?.profile.username ?? "Player"}
            </Text>
          </Text>

          <Text className="text-[#91A8BC] text-sm mt-2">
            Analyze your games and take your chess to the next level.
          </Text>
        </View>

        {/* Player Rating Overview */}
        <View className="bg-[#152535] rounded-2xl border border-[#263C50] p-4 mb-6">

          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white text-base font-semibold">
                Player Overview
              </Text>

              <Text className="text-[#91A8BC] text-xs mt-1">
                Your Chess.com ratings
              </Text>
            </View>

            {profile?.profile.league && (
              <View className="bg-[#243C51] px-3 py-1.5 rounded-full">
                <Text className="text-[#A8C8E7] text-xs font-semibold">
                  {profile.profile.league}
                </Text>
              </View>
            )}
          </View>

          <View className="h-[1px] bg-[#263C50] mb-4" />

          <View className="flex-row gap-2">
            <RatingCard
              title="BLITZ"
              rating={profile?.stats.chess_blitz?.last.rating}
            />

            <RatingCard
              title="RAPID"
              rating={profile?.stats.chess_rapid?.last.rating}
            />

            <RatingCard
              title="BULLET"
              rating={profile?.stats.chess_bullet?.last.rating}
            />
          </View>

          <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-[#263C50]">
            <Text className="text-[#91A8BC] text-xs">
              Chess.com account
            </Text>

            <Text className="text-[#C4D8EA] text-xs font-medium">
              {profile?.profile.username ?? "Not loaded"}
            </Text>
          </View>
        </View>

        {/* Main Introduction */}
        <View className="mb-6">
          <Slide
            description="Analyze chess positions, explore opening trends, and discover how top grandmasters approached similar positions throughout chess history."
            image={require("../public/assets/chessVisionLogo.png")}
          />
        </View>

        {/* Search */}
        <View className="mb-7">
          <Text className="text-white text-lg font-bold mb-1">
            Explore Chess
          </Text>

          <Text className="text-[#91A8BC] text-sm mb-4">
            Discover openings, players, and positions.
          </Text>

          <SearchBar
            placeholder="Search an opening, position, or player..."
          />
        </View>

        {/* Analysis Tools */}
        <View className="mb-7">

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-bold">
              Analysis Tools
            </Text>

            <View className="h-[1px] flex-1 bg-[#263C50] ml-4" />
          </View>

          <View className="flex-row flex-wrap gap-4">
            <ActionBox
              icon="chess-board"
              description="Analyze Position"
            />

            <ActionBox
              icon="compass"
              description="Explore Openings"
            />

            <ActionBox
              icon="chess-knight"
              description="GM Games"
            />

            <ActionBox
              icon="chart-line"
              description="Insights"
            />
          </View>
        </View>

        {/* Recent Analysis */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-bold">
              Recent Analysis
            </Text>

            <View className="h-[1px] flex-1 bg-[#263C50] ml-4" />
          </View>

          <View className="bg-[#152535] border border-[#263C50] rounded-2xl px-5 py-8 items-center justify-center">
            <View className="w-12 h-12 bg-[#20364A] rounded-full items-center justify-center mb-3">
              <Text className="text-[#A8C8E7] text-xl">
                ♞
              </Text>
            </View>

            <Text className="text-white text-sm font-semibold mb-1">
              No recent analysis
            </Text>

            <Text className="text-[#91A8BC] text-xs text-center leading-5">
              Your recently analyzed games and positions will appear here.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}