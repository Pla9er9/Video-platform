import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface TokenState {
    value: string | undefined
    username: string | undefined
}

const initialState: TokenState = {
    value: undefined,
    username: undefined
}

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        clearToken: (state) => {
            state.value = undefined
            state.username = undefined
        },
        setToken: (state, action) => {
            state.value = action.payload.token
            state.username = action.payload.username
        }
    }
})

export const store = configureStore({
    reducer: {
        token: tokenSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const { clearToken, setToken } = tokenSlice.actions