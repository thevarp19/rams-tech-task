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
                // Ignore these action types
                ignoredActions: [],
                // Ignore these field paths in all actions
                ignoredActionsPaths: [],
                // Ignore these paths in the state
                ignoredPaths: [
                    "calculator.form.prepaymentDate",
                    "calculator.payments.*.date",
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
