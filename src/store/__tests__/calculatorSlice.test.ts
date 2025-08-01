import { beforeEach, describe, expect, it } from "vitest";
import { CalculatorState } from "../../types";
import reducer, {
    addPayment,
    initializePayments,
    updateForm,
} from "../calculatorSlice";

const initialState = reducer(undefined, { type: "@@INIT" }) as CalculatorState;

describe("calculatorSlice", () => {
    let state: CalculatorState;

    beforeEach(() => {
        state = reducer(initialState, { type: "@@INIT" }) as CalculatorState;
    });

    it("initializePayments generates payments based on default form", () => {
        state = reducer(state, initializePayments());
        const trancheCount = state.form.quantityPayments;
        expect(state.payments.length).toBe(2 + trancheCount);
    });

    it("updateForm updates paymentForm and recalculates prepayment", () => {
        const updated = reducer(state, updateForm({ paymentForm: "20%" }));
        expect(updated.form.paymentForm).toBe("20%");
        expect(updated.form.prepayment).toBe(
            Math.round(updated.fullPrice * 0.2)
        );
    });

    it("addPayment adds a new tranche and recalculates amounts", () => {
        let s = reducer(state, initializePayments());
        const before = s.payments.filter((p) => p.type === "Транш").length;
        s = reducer(s, addPayment());
        const after = s.payments.filter((p) => p.type === "Транш").length;
        expect(after).toBe(before + 1);
        const trancheTotal = s.payments
            .filter((p) => p.type === "Транш")
            .reduce((sum, p) => sum + p.amount, 0);
        const expectedTotal = s.fullPrice - s.form.deposit - s.form.prepayment;
        expect(Math.abs(trancheTotal - expectedTotal)).toBeLessThanOrEqual(10);
    });
});
