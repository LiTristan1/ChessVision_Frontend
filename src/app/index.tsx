import { verifyInstallation } from "nativewind";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTitle } from "./components/appTitle";
import { Slide } from "./components/Slide";
import { containers } from "./themes/themes";

export default function Index() {
  verifyInstallation()
  return (
    <SafeAreaView style = {containers.PrimaryContainer}>
      <AppTitle/>
      <Slide
        description = "Analyze chess positions, explore opening trends, and discover how top grandmasters approached similar positions throughout chess history."
        image={require("./public/assets/chessVisionLogo.png")}
      />
    </SafeAreaView>
  );
}


