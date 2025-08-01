import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastMessage } from "../types";

interface ToastState {
    messages: ToastMessage[];
}

const initialState: ToastState = {
    messages: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<ToastMessage, "id">>) => {
            const id = `toast-${Date.now()}-${Math.random()}`;
            const toast: ToastMessage = {
                id,
                duration: 1500,
                ...action.payload,
            };
            state.messages.push(toast);
        },

        removeToast: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(
                (toast) => toast.id !== action.payload
            );
        },

        clearAllToasts: (state) => {
            state.messages = [];
        },
    },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;
