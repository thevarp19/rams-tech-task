import { z } from "zod";

export const calculatorFormSchema = z
    .object({
        paymentForm: z.enum(["20%", "30%"], {
            message: "Необходимо выбрать форму оплаты",
        }),
        deposit: z
            .number({
                message: "Задаток обязателен",
            })
            .min(0, "Задаток не может быть отрицательным")
            .max(100000000, "Задаток слишком большой"),
        prepayment: z
            .number()
            .min(0, "ПВ не может быть отрицательным")
            .max(100000000, "ПВ слишком большой"),
        prepaymentDate: z
            .date({
                message: "Дата ПВ обязательна",
            })
            .refine((date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const inputDate = new Date(date);
                inputDate.setHours(0, 0, 0, 0);
                return inputDate >= today;
            }, "Дата ПВ не может быть в прошлом"),
        quantityPayments: z
            .number({
                message: "Количество платежей обязательно",
            })
            .min(12, "Минимум 12 платежей")
            .max(48, "Максимум 48 платежей")
            .step(1, "Количество платежей должно быть целым числом"),
    })
    .refine(
        () => {
            return true;
        },
        {
            message: "Сумма задатка и ПВ не может превышать полную стоимость",
        }
    );

export const paymentSchema = z.object({
    id: z.string(),
    type: z.enum(["Задаток", "ПВ", "Транш"]),
    day: z.number().min(1).max(31),
    date: z.date(),
    amount: z.number().min(0),
    isEditable: z.boolean().optional(),
});

export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
