import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CalculatorForm,
    CalculatorState,
    Payment,
    PaymentType,
} from "../types";
import { addMonths } from "../utils/dateUtils.js";

const FULL_PRICE = 26558146;
const APARTMENT_AREA = 45;

const initialForm: CalculatorForm = {
    paymentForm: "30%",
    deposit: 5000000,
    prepayment: Math.round(FULL_PRICE * 0.3),
    prepaymentDate: new Date(2025, 7, 1),
    quantityPayments: 12,
};

const initialState: CalculatorState = {
    form: initialForm,
    payments: [],
    fullPrice: FULL_PRICE,
    apartmentArea: APARTMENT_AREA,
    isValid: true,
};

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

    payments.push({
        id: generatePaymentId(),
        type: "Задаток" as PaymentType,
        day: 1,
        date: new Date(2025, 7, 1),
        amount: form.deposit,
    });

    payments.push({
        id: generatePaymentId(),
        type: "ПВ" as PaymentType,
        day: form.prepaymentDate.getDate(),
        date: form.prepaymentDate,
        amount: form.prepayment,
    });

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
            const updatedForm = { ...state.form, ...action.payload };

            if (action.payload.paymentForm) {
                const percentage =
                    action.payload.paymentForm === "30%" ? 0.3 : 0.2;
                updatedForm.prepayment = Math.round(
                    state.fullPrice * percentage
                );
            }

            state.form = updatedForm;
            state.payments = generatePayments(state.form, state.fullPrice);
        },

        updatePayment: (
            state,
            action: PayloadAction<{ id: string; amount: number }>
        ) => {
            const payment = state.payments.find(
                (p) => p.id === action.payload.id
            );
            if (payment && payment.type === "Транш") {
                payment.amount = action.payload.amount;

                const tranchePayments = state.payments.filter(
                    (p) => p.type === "Транш"
                );
                const remainingAmount =
                    state.fullPrice -
                    state.form.deposit -
                    state.form.prepayment;

                if (payment.amount >= remainingAmount) {
                    payment.amount = remainingAmount;
                    tranchePayments
                        .filter((p) => p.id !== payment.id)
                        .forEach((p) => (p.amount = 0));
                } else {
                    const otherTranches = tranchePayments.filter(
                        (p) => p.id !== payment.id
                    );
                    const otherTotal = otherTranches.reduce(
                        (sum, p) => sum + p.amount,
                        0
                    );
                    const diffToDistribute =
                        remainingAmount - (payment.amount + otherTotal);

                    if (otherTranches.length > 0 && diffToDistribute !== 0) {
                        const perTranche = Math.floor(
                            diffToDistribute / otherTranches.length
                        );
                        let leftover =
                            diffToDistribute -
                            perTranche * otherTranches.length;

                        otherTranches.forEach((p) => {
                            p.amount += perTranche;
                            if (p.amount < 0) {
                                leftover += p.amount;
                                p.amount = 0;
                            }
                        });

                        payment.amount += leftover;
                        if (payment.amount < 0) payment.amount = 0;
                    }
                }
            }
        },

        reorderPayments: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;
            const [moved] = state.payments.splice(oldIndex, 1);
            state.payments.splice(newIndex, 0, moved);

            let trancheIndex = 0;
            state.payments.forEach((payment) => {
                if (payment.type === "Транш") {
                    const firstTrancheDate = addMonths(
                        state.form.prepaymentDate,
                        1
                    );
                    payment.date = addMonths(firstTrancheDate, trancheIndex);
                    payment.day = payment.date.getDate();
                    trancheIndex++;
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

            state.payments.push({
                id: generatePaymentId(),
                type: "Транш",
                day: newDate.getDate(),
                date: newDate,
                amount: 0,
            });

            state.form.quantityPayments = state.payments.filter(
                (p) => p.type === "Транш"
            ).length;

            const tranchePayments = state.payments.filter(
                (p) => p.type === "Транш"
            );
            const remainingAmount =
                state.fullPrice - state.form.deposit - state.form.prepayment;
            const trancheAmount = remainingAmount / tranchePayments.length;

            tranchePayments.forEach((payment) => {
                payment.amount = Math.round(trancheAmount);
            });
        },

        removePayment: (state, action: PayloadAction<string>) => {
            const paymentIndex = state.payments.findIndex(
                (p) => p.id === action.payload
            );
            if (paymentIndex !== -1) {
                const payment = state.payments[paymentIndex];

                if (payment.type === "Транш") {
                    const trancheCount = state.payments.filter(
                        (p) => p.type === "Транш"
                    ).length;
                    if (trancheCount > 1) {
                        state.payments.splice(paymentIndex, 1);
                        state.form.quantityPayments = state.payments.filter(
                            (p) => p.type === "Транш"
                        ).length;

                        const tranchePayments = state.payments.filter(
                            (p) => p.type === "Транш"
                        );
                        const remainingAmount =
                            state.fullPrice -
                            state.form.deposit -
                            state.form.prepayment;
                        const trancheAmount =
                            remainingAmount / tranchePayments.length;

                        tranchePayments.forEach((payment) => {
                            payment.amount = Math.round(trancheAmount);
                        });
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
