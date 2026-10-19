import { FullProfileResponse } from "@/app/types/responses";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface PlayerSlice {
    fullProfile: FullProfileResponse | null | undefined,
    chessVisionUserName: string
}

const initialState: PlayerSlice = {
    fullProfile: null,
    chessVisionUserName: ""
}

export const PlayerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setFullProfile(state, action: PayloadAction<FullProfileResponse | undefined | null>) {
            state.fullProfile = action.payload
        },
        setChessVisionUserName(state, action: PayloadAction<string>){
            state.chessVisionUserName = action.payload
        }
    }
})

export const { setFullProfile,setChessVisionUserName } = PlayerSlice.actions
export default PlayerSlice.reducer