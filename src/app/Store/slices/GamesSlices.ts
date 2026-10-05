import type { FullAnalysisResultType, Game, gamesByYear } from '@/app/types/responses';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface GamesSlices {
    totalGames: Record<number, Game[][] | null>
    currGame: Game | null
    analysis: FullAnalysisResultType | null
    isAnalyzing: boolean
}


const initialState: GamesSlices = {
    totalGames: {},
    currGame: null,
    analysis: null,
    isAnalyzing: false
}

export const GameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGamesByYear(state, action: PayloadAction<gamesByYear>) {
            state.totalGames[action.payload.year] = action.payload.games

        },

        setCurrentGame(state, action: PayloadAction<Game>) {
            state.currGame = action.payload
        },

        setAnalysis(state, action: PayloadAction<FullAnalysisResultType | null>) {
            state.analysis = action.payload
        }


    }
})
// Action creators are generated for each case reducer function
export const { setGamesByYear, setCurrentGame, setAnalysis } = GameSlice.actions

export default GameSlice.reducer


