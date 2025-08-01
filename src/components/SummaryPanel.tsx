import React, { useMemo } from "react";
import { useAppSelector } from "../hooks/redux";
import {
    calculateSummaryMetrics,
    formatCurrencyWithSymbol,
} from "../utils/calculations";

const SummaryPanel: React.FC = () => {
    const { payments, fullPrice, apartmentArea } = useAppSelector(
        (state) => state.calculator
    );

    const metrics = useMemo(() => {
        return calculateSummaryMetrics(payments, fullPrice, apartmentArea);
    }, [payments, fullPrice, apartmentArea]);

    return (
        <div className="space-y-6">
            {/* Стоимость */}
            <div className="bg-primary text-white rounded-lg p-6">
                <h3 className="text-sm text-white/80 mb-2">Стоимость, ₸:</h3>
                <p className="text-2xl font-bold">
                    {formatCurrencyWithSymbol(metrics.totalCost)}
                </p>
            </div>

            {/* Цена за м² */}
            <div className="bg-primary text-white rounded-lg p-6">
                <h3 className="text-sm text-white/80 mb-2">Цена за м², ₸:</h3>
                <p className="text-2xl font-bold">
                    {formatCurrencyWithSymbol(metrics.pricePerSqm)}
                </p>
            </div>

            {/* ПВ + Задаток */}
            <div className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-sm text-text-secondary mb-2">
                    ПВ+ Задаток
                </h3>
                <p className="text-2xl font-bold text-text mb-2">
                    {formatCurrencyWithSymbol(metrics.depositPlusPrepayment)}
                </p>
                <p className="text-lg text-accent font-medium">
                    {metrics.depositPlusPrepaymentPercent}%
                </p>
            </div>

            {/* Разбивка по годам */}
            <div className="space-y-3">
                {metrics.yearlyBreakdown.map((yearData, index) => (
                    <div
                        key={yearData.year}
                        className="bg-white border border-border rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-text-secondary">
                                за{" "}
                                {index === 0
                                    ? "1 год"
                                    : index === 1
                                    ? "2 года"
                                    : `${index + 1} года`}
                            </h4>
                            <span className="text-lg font-bold text-accent">
                                {yearData.percent}%
                            </span>
                        </div>
                        <p className="text-xl font-bold text-text">
                            {formatCurrencyWithSymbol(yearData.amount)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Дополнительная информация */}
            <div className="bg-border-light rounded-lg p-4 text-center">
                <div className="space-y-2 text-sm text-text-secondary">
                    <p>
                        Общая площадь:{" "}
                        <span className="font-medium text-text">
                            {apartmentArea} м²
                        </span>
                    </p>
                    <p>
                        Всего платежей:{" "}
                        <span className="font-medium text-text">
                            {payments.length}
                        </span>
                    </p>
                    <p>
                        Траншей:{" "}
                        <span className="font-medium text-text">
                            {payments.filter((p) => p.type === "Транш").length}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
