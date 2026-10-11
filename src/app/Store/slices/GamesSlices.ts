import type { Game, gamesByYear } from '@/app/types/responses';
import { PositionAnalysis } from '@/app/types/responses';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface GamesSlices {
    totalGames: Record<number, Game[][] | null>
    currGame: Game | null
    analysis: PositionAnalysis[] | null
    isAnalyzing: boolean
    analyzingMoveIndex: number
}


const initialState: GamesSlices = {
    totalGames: {},
    currGame: null,
    analysis: null,
    isAnalyzing: false,
    analyzingMoveIndex: -1
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

        setAnalysis(state, action: PayloadAction<PositionAnalysis[] | null>) {
            state.analysis = action.payload
        },

        setIsAnalyzing(state, action: PayloadAction<boolean>) {
            state.isAnalyzing = action.payload
        },
        setCurrentAnalyzedMove(state, action: PayloadAction<number>) {
            state.analyzingMoveIndex = action.payload
        }


    }
})
// Action creators are generated for each case reducer function
export const { setGamesByYear, setCurrentGame, setAnalysis, setIsAnalyzing, setCurrentAnalyzedMove } = GameSlice.actions

export default GameSlice.reducer


