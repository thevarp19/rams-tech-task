import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CalculatorForm,
    CalculatorState,
    Payment,
    PaymentType,
} from "../types";
import { addMonths } from "../utils/dateUtils";

// Константы для расчетов
const FULL_PRICE = 25558146; // 25 558 146 ₸
const APARTMENT_AREA = 39; // 39 м²

const initialForm: CalculatorForm = {
    paymentForm: "30%",
    deposit: 5000000,
    prepayment: 5000000,
    prepaymentDate: new Date(2025, 7, 1), // 01.08.2025
    quantityPayments: 12,
};

const initialState: CalculatorState = {
    form: initialForm,
    payments: [],
    fullPrice: FULL_PRICE,
    apartmentArea: APARTMENT_AREA,
    isValid: true,
};

// Utility functions
const generatePaymentId = () => `payment-${Date.now()}-${Math.random()}`;

const calculateTrancheAmount = (
    form: CalculatorForm,
    fullPrice: number
): number => {
    const remainingAmount = fullPrice - form.deposit - form.prepayment;
    return remainingAmount / form.quantityPayments;
};

const generatePayments = (
    form: CalculatorForm,
    fullPrice: number
): Payment[] => {
    const payments: Payment[] = [];

    // Добавляем задаток
    payments.push({
        id: generatePaymentId(),
        type: "Задаток" as PaymentType,
        day: 1,
        date: new Date(2025, 7, 1), // Июль 2025
        amount: form.deposit,
    });

    // Добавляем ПВ
    payments.push({
        id: generatePaymentId(),
        type: "ПВ" as PaymentType,
        day: form.prepaymentDate.getDate(),
        date: form.prepaymentDate,
        amount: form.prepayment,
    });

    // Добавляем транши
    const trancheAmount = calculateTrancheAmount(form, fullPrice);
    const firstTrancheDate = addMonths(form.prepaymentDate, 1);

    for (let i = 0; i < form.quantityPayments; i++) {
        const trancheDate = addMonths(firstTrancheDate, i);
        payments.push({
            id: generatePaymentId(),
            type: "Транш" as PaymentType,
            day: trancheDate.getDate(),
            date: trancheDate,
            amount: Math.round(trancheAmount),
        });
    }

    return payments;
};

const calculatorSlice = createSlice({
    name: "calculator",
    initialState,
    reducers: {
        updateForm: (state, action: PayloadAction<Partial<CalculatorForm>>) => {
            state.form = { ...state.form, ...action.payload };
            // Пересчитываем платежи при изменении формы
            state.payments = generatePayments(state.form, state.fullPrice);
        },

        updatePayment: (
            state,
            action: PayloadAction<{ id: string; amount: number }>
        ) => {
            const payment = state.payments.find(
                (p) => p.id === action.payload.id
            );
            if (payment) {
                payment.amount = action.payload.amount;
            }
        },

        reorderPayments: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;
            const [moved] = state.payments.splice(oldIndex, 1);
            state.payments.splice(newIndex, 0, moved);

            // Пересчитываем номера и даты после перестановки
            state.payments.forEach((payment, index) => {
                if (payment.type === "Транш") {
                    // Обновляем даты траншей с учетом нового порядка
                    const trancheIndex = state.payments
                        .slice(0, index)
                        .filter((p) => p.type === "Транш").length;

                    const firstTrancheDate = addMonths(
                        state.form.prepaymentDate,
                        1
                    );
                    payment.date = addMonths(firstTrancheDate, trancheIndex);
                    payment.day = payment.date.getDate();
                }
            });
        },

        addPayment: (state) => {
            const lastTranche = state.payments
                .filter((p) => p.type === "Транш")
                .pop();

            const newDate = lastTranche
                ? addMonths(lastTranche.date, 1)
                : addMonths(state.form.prepaymentDate, 1);

            const trancheAmount = calculateTrancheAmount(
                state.form,
                state.fullPrice
            );

            state.payments.push({
                id: generatePaymentId(),
                type: "Транш",
                day: newDate.getDate(),
                date: newDate,
                amount: Math.round(trancheAmount),
            });

            // Обновляем количество платежей в форме
            state.form.quantityPayments = state.payments.filter(
                (p) => p.type === "Транш"
            ).length;
        },

        removePayment: (state, action: PayloadAction<string>) => {
            const paymentIndex = state.payments.findIndex(
                (p) => p.id === action.payload
            );
            if (paymentIndex !== -1) {
                const payment = state.payments[paymentIndex];
                // Можно удалять только транши и должен остаться хотя бы один транш
                if (payment.type === "Транш") {
                    const trancheCount = state.payments.filter(
                        (p) => p.type === "Транш"
                    ).length;
                    if (trancheCount > 1) {
                        state.payments.splice(paymentIndex, 1);
                        state.form.quantityPayments = state.payments.filter(
                            (p) => p.type === "Транш"
                        ).length;
                    }
                }
            }
        },

        setValidation: (state, action: PayloadAction<boolean>) => {
            state.isValid = action.payload;
        },

        initializePayments: (state) => {
            state.payments = generatePayments(state.form, state.fullPrice);
        },
    },
});

export const {
    updateForm,
    updatePayment,
    reorderPayments,
    addPayment,
    removePayment,
    setValidation,
    initializePayments,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
