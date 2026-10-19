import AsyncStorage from '@react-native-async-storage/async-storage';
import { setRecentAnalysis } from '../Store/slices/GamesSlices';
import { store } from '../Store/store';
import { Game } from '../types/responses';
export async function storeRecentAnalysis(value: Game | null) {


    if (value == null) {
        return
    }
    try {
        const recentlyStored = await getRecentAnalysis()
        let newRecentlyStored = [...recentlyStored].slice(-19)
        newRecentlyStored = [...newRecentlyStored, value]
        const jsonValue = JSON.stringify(newRecentlyStored)
        await AsyncStorage.setItem("recentAnalysis", jsonValue)
    } catch (e) {
        console.log("Error storing chess game: " + e)
    }
}

export async function getRecentAnalysis() {
    try {
        const jsonValue = await AsyncStorage.getItem("recentAnalysis")

        const res = jsonValue != null ? JSON.parse(jsonValue) : []
        console.log("Retrieved recent analysis: " + res)
        store.dispatch(setRecentAnalysis(res))
        return res
    } catch (e) {
        console.log("Error getting recent analysis: " + e)
    }
}

