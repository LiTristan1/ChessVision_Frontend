import { FullProfileResponse } from "@/app/types/responses";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface PlayerSlice {
    fullProfile: FullProfileResponse | null | undefined
}

const initialState: PlayerSlice = {
    fullProfile: null
}

export const PlayerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setFullProfile(state, action: PayloadAction<FullProfileResponse | undefined | null>) {
            state.fullProfile = action.payload
        }
    }
})

export const { setFullProfile } = PlayerSlice.actions
export default PlayerSlice.reducer