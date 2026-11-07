import { ChessVisionUser, FullProfileResponse } from "@/app/types/responses";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface PlayerSlice {
    fullProfile: FullProfileResponse | null | undefined,
    chessVisionUser: ChessVisionUser | null | undefined
}

const initialState: PlayerSlice = {
    fullProfile: null,
    chessVisionUser: null

}

export const PlayerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setFullProfile(state, action: PayloadAction<FullProfileResponse | undefined | null>) {
            state.fullProfile = action.payload
        },
        setChessVisionUser(state, action: PayloadAction<ChessVisionUser | null | undefined>) {
            state.chessVisionUser = action.payload
        }

    }
})

export const { setFullProfile, setChessVisionUser } = PlayerSlice.actions
export default PlayerSlice.reducer