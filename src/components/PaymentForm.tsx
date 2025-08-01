import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import CalendarIcon from "../assets/Field/Dropdown + Title + Ava/Outline/General/Calendar.svg";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateForm } from "../store/calculatorSlice";
import { CalculatorFormData, calculatorFormSchema } from "../types/validation";
import { formatCurrency } from "../utils/calculations";

const PaymentForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { form, fullPrice } = useAppSelector((state) => state.calculator);

    const {
        control,
        handleSubmit,
        formState: { errors },
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

    const onSubmit = (data: CalculatorFormData) => {
        dispatch(updateForm(data));
    };

    return (
        <div className="bg-white h-fit">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="border border-border rounded py-[6px] px-[10px] relative">
                    <label className="block text-xs font-normal text-secondary ps-1">
                        Форма оплаты
                    </label>
                    <Controller
                        name="paymentForm"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="w-full rounded focus:outline-none !text-base font-semibold"
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

                <div className="border border-border rounded py-[6px] px-[10px] relative">
                    <label className="block text-xs font-normal text-secondary">
                        Задаток
                    </label>
                    <Controller
                        name="deposit"
                        control={control}
                        render={({ field }) => {
                            const percent = Math.round(
                                (field.value / fullPrice) * 100
                            );
                            const progress = (field.value / fullPrice) * 100;
                            return (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <div className="flex items-baseline space-x-1">
                                            <h4 className="font-semibold">
                                                {formatCurrency(field.value)}
                                            </h4>
                                            <span className="text-text-secondary">
                                                ₸
                                            </span>
                                        </div>
                                        <div className="flex items-baseline space-x-1">
                                            <h4 className="font-semibold">
                                                {percent}
                                            </h4>
                                            <span className="text-text-secondary">
                                                %
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-[7px] left-0 right-0 w-[90%] mx-auto">
                                        <input
                                            type="range"
                                            min={0}
                                            max={fullPrice}
                                            step={10000}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="slider w-full"
                                            style={
                                                {
                                                    "--progress": `${progress}%`,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    />
                    {errors.deposit && (
                        <p className="mt-1 text-sm text-error">
                            {errors.deposit.message}
                        </p>
                    )}
                </div>

                <div className="border border-border rounded py-[6px] px-[10px] relative">
                    <label className="block text-xs font-normal text-secondary">
                        ПВ
                    </label>
                    <Controller
                        name="prepayment"
                        control={control}
                        render={({ field }) => {
                            const percent = Math.round(
                                (field.value / fullPrice) * 100
                            );
                            const progress = (field.value / fullPrice) * 100;
                            return (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <div className="flex items-baseline space-x-1">
                                            <h4 className="font-semibold">
                                                {formatCurrency(field.value)}
                                            </h4>
                                            <span className="text-text-secondary">
                                                ₸
                                            </span>
                                        </div>
                                        <div className="flex items-baseline space-x-1">
                                            <h4 className="font-semibold">
                                                {percent}
                                            </h4>
                                            <span className="text-text-secondary">
                                                %
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-[7px] left-0 right-0 w-[90%] mx-auto">
                                        <input
                                            type="range"
                                            min={0}
                                            max={fullPrice}
                                            step={10000}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="slider w-full"
                                            style={
                                                {
                                                    "--progress": `${progress}%`,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    />
                    {errors.prepayment && (
                        <p className="mt-1 text-sm text-error">
                            {errors.prepayment.message}
                        </p>
                    )}
                </div>

                <div className="border border-border rounded py-[6px] px-[10px] relative">
                    <label className="block text-xs font-normal text-secondary">
                        Дата ПВ
                    </label>
                    <Controller
                        name="prepaymentDate"
                        control={control}
                        render={({ field }) => (
                            <div className="relative w-full">
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="dd.MM.yyyy"
                                    wrapperClassName="w-full"
                                    minDate={new Date()}
                                    placeholderText="01.08.2025"
                                    className={`!w-full rounded focus:outline-none !text-base font-semibold ${
                                        errors.prepaymentDate
                                            ? "border-error"
                                            : "border-border"
                                    }`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <img
                                        src={CalendarIcon}
                                        alt="Calendar"
                                        className="w-5 h-5"
                                    />
                                </div>
                            </div>
                        )}
                    />
                    {errors.prepaymentDate && (
                        <p className="mt-1 text-sm text-error">
                            {errors.prepaymentDate.message}
                        </p>
                    )}
                </div>

                <div className="border border-border rounded py-[6px] px-[10px] relative">
                    <label className="block text-xs text-secondary font-normal">
                        Количество платежей
                    </label>
                    <Controller
                        name="quantityPayments"
                        control={control}
                        render={({ field }) => {
                            const progress =
                                ((field.value - 12) / (48 - 12)) * 100;
                            return (
                                <div className="space-y-3">
                                    <div className="flex justify-between font-semibold text-base text-text">
                                        <span>12</span>
                                        <span className="font-normal text-text text-xs">
                                            {field.value}
                                        </span>
                                        <span>48</span>
                                    </div>
                                    <div className="absolute -bottom-[7px] left-0 right-0 w-[90%] mx-auto">
                                        <input
                                            type="range"
                                            min={12}
                                            max={48}
                                            step={1}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="slider w-full"
                                            style={
                                                {
                                                    "--progress": `${progress}%`,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    />
                    {errors.quantityPayments && (
                        <p className="mt-1 text-sm text-error">
                            {errors.quantityPayments.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
