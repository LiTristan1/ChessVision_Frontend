import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/GamesSlices'
import playerReducer from './slices/PlayerSlice'
export const store = configureStore({
    reducer: {
        games: gameReducer,
        player: playerReducer
    }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store