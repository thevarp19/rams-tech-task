export type PaymentType = "Задаток" | "ПВ" | "Транш";

export type PaymentFormType = "20%" | "30%";

export interface Payment {
    id: string;
    type: PaymentType;
    day: number;
    date: string; // Changed from Date to string for Redux serialization
    amount: number;
    isEditable?: boolean;
}

export interface CalculatorForm {
    paymentForm: PaymentFormType;
    deposit: number;
    prepayment: number;
    prepaymentDate: string; // Changed from Date to string for Redux serialization
    quantityPayments: number;
}

export interface CalculatorState {
    form: CalculatorForm;
    payments: Payment[];
    fullPrice: number;
    apartmentArea: number;
    isValid: boolean;
}

export interface SummaryMetrics {
    totalCost: number;
    pricePerSqm: number;
    depositPlusPrepayment: number;
    depositPlusPrepaymentPercent: number;
    yearlyBreakdown: Array<{
        year: number;
        amount: number;
        percent: number;
    }>;
    simpleBurdenPercent: number;
    calculateNPV: (rate?: number) => number;
}

export interface ToastMessage {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
}

export interface ValidationError {
    field: string;
    message: string;
}

export const PaymentFormSchema = {
    paymentForm: ["20%", "30%"] as const,
    deposit: { min: 0, max: 100000000 },
    prepayment: { min: 0, max: 100000000 },
    prepaymentDate: { min: new Date() },
    quantityPayments: { min: 12, max: 48, step: 1 },
};
