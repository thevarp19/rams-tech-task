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
            <div className="bg-primary text-white rounded-lg px-3 py-2">
                <h3 className="text-sm text-white/80 mb-2">Стоимость, ₸:</h3>
                <p className="text-lg font-bold">
                    {formatCurrencyWithSymbol(metrics.totalCost)}
                </p>
            </div>

            <div className="bg-primary text-white rounded-lg px-3 py-2">
                <h3 className="text-sm text-white/80 mb-2">Цена за м², ₸:</h3>
                <p className="text-lg font-bold">
                    {formatCurrencyWithSymbol(metrics.pricePerSqm)}
                </p>
            </div>

            <div className="bg-white rounded-lg px-3 py-2">
                <h3 className="text-sm text-[#343434] mb-2">ПВ + Задаток</h3>
                <div className="flex gap-2 divide-x-[1px] divide-[#626262] ">
                    <p className="text-lg leading-none font-bold text-[#024638] ">
                        {formatCurrencyWithSymbol(
                            metrics.depositPlusPrepayment
                        )}
                    </p>
                    <p className="text-lg text-accent leading-none font-bold ps-2">
                        {metrics.depositPlusPrepaymentPercent}%
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {metrics.yearlyBreakdown.map((yearData, index) => (
                    <div
                        key={yearData.year}
                        className="bg-white rounded-lg px-3 py-2"
                    >
                        <h4 className="text-sm text-[#343434]">
                            за{" "}
                            {index === 0
                                ? "1 год"
                                : index === 1
                                ? "2 года"
                                : `${index + 1} года`}
                        </h4>
                        <div className="flex gap-2 divide-x-[1px] divide-[#626262] ">
                            <p className="text-lg leading-none font-bold text-[#024638] ">
                                {formatCurrencyWithSymbol(yearData.amount)}
                            </p>
                            <p className="text-lg text-accent leading-none font-bold ps-2">
                                {yearData.percent}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Процентная нагрузка */}
            <div className="bg-white rounded-lg px-3 py-2">
                <h3 className="text-sm text-[#343434] mb-2">
                    Процентная нагрузка
                </h3>
                <p className="text-lg font-bold text-[#024638]">
                    {metrics.simpleBurdenPercent}%
                </p>
            </div>

            {/* NPV без учёта ставки (r = 0) */}
            <div className="bg-white rounded-lg px-3 py-2">
                <h3 className="text-sm text-[#343434] mb-2">NPV (r = 0)</h3>
                <p className="text-lg font-bold text-[#024638]">
                    {formatCurrencyWithSymbol(metrics.calculateNPV())}
                </p>
            </div>

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
