import type { Game, gamesByYear, Opening } from '@/app/types/responses';
import { PositionAnalysis } from '@/app/types/responses';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface GamesSlices {
    totalGames: Record<number, Game[][] | null>
    currGame: Game | null
    analysis: PositionAnalysis[] | null
    isAnalyzing: boolean
    analysisByGameId: Record<string, PositionAnalysis[]>
    analyzingMoveIndex: number
    hasSelectedGame: boolean
    recentAnalysis: Game[]
    openings: Opening[]
}


const initialState: GamesSlices = {
    totalGames: {},
    currGame: null,
    analysis: null,
    analysisByGameId: {},
    isAnalyzing: false,
    analyzingMoveIndex: -1,
    hasSelectedGame: false,
    recentAnalysis: [],
    openings: [],
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
        },
        setHasSelectedGame(state, action: PayloadAction<boolean>) {
            state.hasSelectedGame = action.payload
        },
        setRecentAnalysis(state, action: PayloadAction<Game[]>) {
            state.recentAnalysis = action.payload
        },
        setOpenings(state, action: PayloadAction<Opening[]>) {
            state.openings = action.payload
        },
        setNewGameAnalysis(state, action: PayloadAction<{id: string;analysis: PositionAnalysis[];}>) {
            state.analysisByGameId[action.payload.id] = action.payload.analysis
        }
    }
})
// Action creators are generated for each case reducer function
export const { setGamesByYear, setCurrentGame, setAnalysis, setIsAnalyzing, setCurrentAnalyzedMove, setHasSelectedGame, setRecentAnalysis, setOpenings,setNewGameAnalysis } = GameSlice.actions

export default GameSlice.reducer


