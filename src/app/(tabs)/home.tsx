import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { getFullProfile } from "../api/player";
import { ActionBox } from "../components/ActionBox";
import { AppTitle } from "../components/appTitle";
import { RatingCard } from "../components/RatingCard";
import RecentAnalysis from "../components/RecentAnalysis";
import { getRecentAnalysis, storeRecentAnalysis } from "../helpers/LocalStorage";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setCurrentAnalyzedMove, setCurrentGame, setHasSelectedGame } from "../Store/slices/GamesSlices";
import { setFullProfile } from "../Store/slices/PlayerSlice";
export default function Home() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.player.fullProfile)
  const recentAnalysis = useAppSelector(state => state.games.recentAnalysis)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const hasSelectedGame = useAppSelector(state => state.games.hasSelectedGame)
  const currGame = useAppSelector(state => state.games.currGame)
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
    getRecentAnalysis()
    //fetch previously analyzed games from local storage

  }, [])



  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "#0C1520" }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <View className="mb-7">
          <AppTitle showOnlyTitle={true} />
        </View>

        {/* Welcome */}
        <View className="mb-7">
          <Text className="text-[#91A8BC] text-xs font-medium mb-2">
            YOUR DASHBOARD
          </Text>

          <Text className="text-white text-[27px] font-bold">
            Welcome back,{" "}
            <Text className="text-[#A8C8E7]">
              {profile?.profile.username ?? "Player"}
            </Text>
          </Text>

          <Text className="text-[#91A8BC] text-sm mt-2">
            Ready to improve your next move?
          </Text>
        </View>

        {/* Ratings */}
        <View className="bg-[#152535] rounded-2xl border border-[#2B4054] p-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-base font-bold">
              Your Ratings
            </Text>

            <Text className="text-[#91A8BC] text-xs">
              Chess.com
            </Text>
          </View>

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

          <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-[#2B4054]">
            <Text className="text-[#91A8BC] text-xs">
              {profile?.profile.league
                ? `${profile.profile.league} League`
                : "Connected account"}
            </Text>

            <Text
              className="text-[#B8D5EC] text-xs font-medium"
              numberOfLines={1}
            >
              {profile?.profile.username ?? "Not loaded"}
            </Text>
          </View>
        </View>

        {/* Analysis Tools */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-white text-xl font-bold">
              Analysis Tools
            </Text>
            <Text className="text-[#91A8BC] text-xs mt-1">
              Explore, study, and improve
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <ActionBox
                  icon="chess-board"
                  description="Analyze Position"
                  onPress={() => { }}
                />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <ActionBox
                  icon="compass"
                  description="Explore Openings"
                  onPress={() => router.navigate("/openings")}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <ActionBox
                  icon="chess-knight"
                  description="GM Games"
                  onPress={() => { }}
                />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <ActionBox
                  icon="chart-line"
                  description="Insights"
                  onPress={() => { }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Analysis */}
        <View className="mb-7">
          <RecentAnalysis
            games={recentAnalysis}
            onGamePress={async (game) => {
              if (hasSelectedGame) {
                await storeRecentAnalysis(currGame);
              }

              console.log("Dispatching: " + game.uuid);

              dispatch(setCurrentGame(game));
              dispatch(setCurrentAnalyzedMove(-1));
              dispatch(setHasSelectedGame(true));

              router.navigate("/(tabs)/analysis");
            }}
          />
        </View>


      </ScrollView>
    </SafeAreaView>
  );


}