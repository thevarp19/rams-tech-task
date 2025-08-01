import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateForm } from "../store/calculatorSlice";
import { CalculatorFormData, calculatorFormSchema } from "../types/validation";

const PaymentForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { form } = useAppSelector((state) => state.calculator);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<CalculatorFormData>({
        resolver: zodResolver(calculatorFormSchema),
        defaultValues: {
            paymentForm: form.paymentForm,
            deposit: form.deposit,
            prepayment: form.prepayment,
            prepaymentDate: form.prepaymentDate,
            quantityPayments: form.quantityPayments,
        },
        mode: "onChange",
    });

    // Watch all form values for live validation
    const watchedValues = watch();

    const onSubmit = (data: CalculatorFormData) => {
        dispatch(updateForm(data));
    };

    // Initialize store on component mount
    useEffect(() => {
        dispatch(
            updateForm({
                paymentForm: form.paymentForm,
                deposit: form.deposit,
                prepayment: form.prepayment,
                prepaymentDate: form.prepaymentDate,
                quantityPayments: form.quantityPayments,
            })
        );
    }, [
        dispatch,
        form.paymentForm,
        form.deposit,
        form.prepayment,
        form.prepaymentDate,
        form.quantityPayments,
    ]);

    // Handle field changes with store update
    const handleFieldChange = (
        field: keyof CalculatorFormData,
        value: string | number | Date | null
    ) => {
        if (value !== null) {
            setValue(field, value as CalculatorFormData[typeof field]);

            // Update store immediately for smooth UX
            const updatedForm = { ...watchedValues, [field]: value };
            dispatch(updateForm(updatedForm));
        }
    };

    return (
        <div className="bg-white rounded-lg border border-border p-6 h-fit">
            <h2 className="text-xl font-semibold text-text mb-6">
                Калькулятор
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Форма оплаты */}
                <div>
                    <label className="block text-sm font-medium text-text mb-2">
                        Форма оплаты
                    </label>
                    <Controller
                        name="paymentForm"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "paymentForm",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="20%">Рассрочка 20%</option>
                                <option value="30%">Рассрочка 30%</option>
                            </select>
                        )}
                    />
                    {errors.paymentForm && (
                        <p className="mt-1 text-sm text-error">
                            {errors.paymentForm.message}
                        </p>
                    )}
                </div>

                {/* Задаток */}
                <div>
                    <label className="block text-sm font-medium text-text mb-2">
                        Задаток
                    </label>
                    <Controller
                        name="deposit"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="number"
                                min="0"
                                step="1000"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.deposit
                                        ? "border-error"
                                        : "border-border"
                                }`}
                                placeholder="5 000 000 ₸"
                                onChange={(e) =>
                                    handleFieldChange(
                                        "deposit",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        )}
                    />
                    {errors.deposit && (
                        <p className="mt-1 text-sm text-error">
                            {errors.deposit.message}
                        </p>
                    )}
                </div>

                {/* ПВ */}
                <div>
                    <label className="block text-sm font-medium text-text mb-2">
                        ПВ
                    </label>
                    <Controller
                        name="prepayment"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="number"
                                min="0"
                                step="1000"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.prepayment
                                        ? "border-error"
                                        : "border-border"
                                }`}
                                placeholder="5 000 000 ₸"
                                onChange={(e) =>
                                    handleFieldChange(
                                        "prepayment",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        )}
                    />
                    {errors.prepayment && (
                        <p className="mt-1 text-sm text-error">
                            {errors.prepayment.message}
                        </p>
                    )}
                </div>

                {/* Дата ПВ */}
                <div>
                    <label className="block text-sm font-medium text-text mb-2">
                        Дата ПВ
                    </label>
                    <Controller
                        name="prepaymentDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                selected={field.value}
                                onChange={(date) =>
                                    handleFieldChange("prepaymentDate", date)
                                }
                                dateFormat="dd.MM.yyyy"
                                minDate={new Date()}
                                placeholderText="01.08.2025" // TODO: change to current date
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                    errors.prepaymentDate
                                        ? "border-error"
                                        : "border-border"
                                }`}
                            />
                        )}
                    />
                    {errors.prepaymentDate && (
                        <p className="mt-1 text-sm text-error">
                            {errors.prepaymentDate.message}
                        </p>
                    )}
                </div>

                {/* Количество платежей */}
                <div>
                    <label className="block text-sm font-medium text-text mb-2">
                        Количество платежей
                    </label>
                    <Controller
                        name="quantityPayments"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="12"
                                    max="48"
                                    step="1"
                                    value={field.value}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "quantityPayments",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-text-secondary">
                                    <span>12</span>
                                    <span className="font-medium text-text">
                                        {field.value}
                                    </span>
                                    <span>48</span>
                                </div>
                            </div>
                        )}
                    />
                    {errors.quantityPayments && (
                        <p className="mt-1 text-sm text-error">
                            {errors.quantityPayments.message}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => handleFieldChange("quantityPayments", 12)}
                    className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
