import { createSlice } from "@reduxjs/toolkit";

const items =
    localStorage.getItem("user") !== null ?
    JSON.parse(localStorage.getItem("user")) :
    [];

const initialState = {
    value: items,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
            localStorage.setItem("user", JSON.stringify(state.value));
        },
        logout: (state) => {
            state.value = null;
            localStorage.setItem("user", JSON.stringify(state.value));
        },
        update: (state, action) => {
            state.value.user = {...state.value.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.value));
        },
    },
});

// Action creators are generated for each case reducer function
export const { login, logout, update } = userSlice.actions;

export default userSlice.reducer;