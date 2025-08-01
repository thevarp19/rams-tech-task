import { Payment, SummaryMetrics } from "../types";
import { getDateRange, isDateInYear } from "./dateUtils";

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(amount)
        .replace(/,/g, " ");
};

export const formatCurrencyWithSymbol = (amount: number): string => {
    return `${formatCurrency(amount)} ₸`;
};

export const calculateSummaryMetrics = (
    payments: Payment[],
    fullPrice: number,
    apartmentArea: number
): SummaryMetrics => {
    const deposit = payments.find((p) => p.type === "Задаток")?.amount || 0;
    const prepayment = payments.find((p) => p.type === "ПВ")?.amount || 0;
    const depositPlusPrepayment = deposit + prepayment;

    // Цена за м²
    const pricePerSqm = Math.round(fullPrice / apartmentArea);

    // Процент от общей стоимости
    const depositPlusPrepaymentPercent = Math.round(
        (depositPlusPrepayment / fullPrice) * 100
    );

    // Разбивка по годам
    const dates = payments.map((p) => p.date);
    const { minYear, maxYear } = getDateRange(dates);

    const yearlyBreakdown = [];
    for (let year = minYear; year <= maxYear; year++) {
        const yearPayments = payments.filter((p) => isDateInYear(p.date, year));
        const yearAmount = yearPayments.reduce((sum, p) => sum + p.amount, 0);
        const yearPercent = Math.round((yearAmount / fullPrice) * 100);

        if (yearAmount > 0) {
            yearlyBreakdown.push({
                year,
                amount: yearAmount,
                percent: yearPercent,
            });
        }
    }

    return {
        totalCost: fullPrice,
        pricePerSqm,
        depositPlusPrepayment,
        depositPlusPrepaymentPercent,
        yearlyBreakdown,
    };
};

export const validatePaymentAmount = (
    amount: number,
    maxAmount: number
): boolean => {
    return amount >= 0 && amount <= maxAmount;
};

export const validateFormData = (
    deposit: number,
    prepayment: number,
    fullPrice: number
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (deposit < 0) {
        errors.push("Задаток не может быть отрицательным");
    }

    if (prepayment < 0) {
        errors.push("ПВ не может быть отрицательным");
    }

    if (deposit + prepayment > fullPrice) {
        errors.push("Сумма задатка и ПВ не может превышать полную стоимость");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
