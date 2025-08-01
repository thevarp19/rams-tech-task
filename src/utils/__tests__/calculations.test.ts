import { describe, expect, it } from "vitest";
import { Payment } from "../../types";
import {
    calculateSummaryMetrics,
    formatCurrency,
    formatCurrencyWithSymbol,
    validateFormData,
    validatePaymentAmount,
} from "../calculations";

describe("calculations utils", () => {
    const fullPrice = 1_000_000;
    const apartmentArea = 50;

    const payments: Payment[] = [
        {
            id: "d",
            type: "Задаток",
            day: 1,
            date: new Date(2024, 0, 1).toISOString(),
            amount: 100_000,
        },
        {
            id: "p",
            type: "ПВ",
            day: 15,
            date: new Date(2024, 1, 1).toISOString(),
            amount: 200_000,
        },
        {
            id: "t1",
            type: "Транш",
            day: 1,
            date: new Date(2025, 0, 1).toISOString(),
            amount: 300_000,
        },
        {
            id: "t2",
            type: "Транш",
            day: 1,
            date: new Date(2026, 0, 1).toISOString(),
            amount: 400_000,
        },
    ];

    it("formatCurrency formats number with spaces", () => {
        const result = formatCurrency(1234567);
        expect(result).toMatch(/1\s*234\s*567/);
    });

    it("formatCurrencyWithSymbol appends ₸ symbol", () => {
        const result = formatCurrencyWithSymbol(1000);
        expect(result).toMatch(/1\s*000\s*₸/);
    });

    it("calculateSummaryMetrics returns correct basic metrics", () => {
        const metrics = calculateSummaryMetrics(
            payments,
            fullPrice,
            apartmentArea
        );
        expect(metrics.totalCost).toBe(fullPrice);
        expect(metrics.pricePerSqm).toBe(fullPrice / apartmentArea);
        expect(metrics.depositPlusPrepayment).toBe(300_000);
        expect(metrics.depositPlusPrepaymentPercent).toBeCloseTo(30, 1);
        expect(metrics.yearlyBreakdown.length).toBe(2);
        const breakdownYears = metrics.yearlyBreakdown.map((b) => b.year);
        expect(breakdownYears).toEqual([2025, 2026]);
        const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
        const expectedBurden = +((totalPayments / fullPrice - 1) * 100).toFixed(
            1
        );
        expect(metrics.simpleBurdenPercent).toBe(expectedBurden);
        expect(metrics.calculateNPV()).toBe(totalPayments - fullPrice);
        const npv10 = metrics.calculateNPV(0.1);
        expect(npv10).toBeGreaterThan(-fullPrice);
    });

    it("validatePaymentAmount checks range", () => {
        expect(validatePaymentAmount(50, 100)).toBe(true);
        expect(validatePaymentAmount(-10, 100)).toBe(false);
        expect(validatePaymentAmount(150, 100)).toBe(false);
    });

    it("validateFormData returns errors correctly", () => {
        const { isValid, errors } = validateFormData(-10, 0, 100);
        expect(isValid).toBe(false);
        expect(errors.length).toBeGreaterThan(0);

        const ok = validateFormData(10, 10, 100);
        expect(ok.isValid).toBe(true);
    });
});
