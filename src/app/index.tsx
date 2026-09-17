import { verifyInstallation } from "nativewind";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionBox } from "./components/ActionBox";
import { AppTitle } from "./components/appTitle";
import { SearchBar } from "./components/SearchBar";
import { Slide } from "./components/Slide";
import { containers, TextStyles } from "./themes/themes";
export default function Index() {
  verifyInstallation()
  return (
    <SafeAreaView style = {containers.PrimaryContainer}>
      <ScrollView contentContainerStyle = {containers.ScrollContainer}>
        <AppTitle/>
        <Slide
          description = "Analyze chess positions, explore opening trends, and discover how top grandmasters approached similar positions throughout chess history."
          image={require("./public/assets/chessVisionLogo.png")}
        />
        <SearchBar
          placeholder = {"Search an opening, position, or player..."}
        />
        {/**Grid of actions */}
        <View className = "flex flex-row flex-wrap gap-4">
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

        <Text style = {TextStyles.secondary}>
          Recent Analysis
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}


