import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { Provider } from 'react-redux';
import "../../global.css";
import { storeRecentAnalysis } from "./helpers/LocalStorage";
import { store } from "./Store/store";
export default function RootLayout() {

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {

        if (nextAppState == "background") {
          console.log("Triggered appstate")
          const currGame = store.getState().games.currGame
          if (currGame) {
            console.log('saving game...')
            await storeRecentAnalysis(currGame)
          }
        }
      }
    )

    return () => subscription.remove()
  }, [])

  return (
    <Provider store={store}>
      <Stack screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 250,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}>

        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(pages)" />
      </Stack>
    </Provider>
  );
}


