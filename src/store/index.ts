import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer from "./calculatorSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
    reducer: {
        calculator: calculatorReducer,
        toast: toastReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
                ignoredActionsPaths: [],
                ignoredPaths: [],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
