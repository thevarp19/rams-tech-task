import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
    addPayment,
    removePayment,
    reorderPayments,
    updatePayment,
} from "../store/calculatorSlice";
import { addToast } from "../store/toastSlice";
import { Payment } from "../types";
import { formatCurrency } from "../utils/calculations";
import { formatDate } from "../utils/dateUtils";

interface SortableRowProps {
    payment: Payment;
    index: number;
    onAmountEdit: (id: string, amount: number) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

const SortableRow: React.FC<SortableRowProps> = ({
    payment,
    index,
    onAmountEdit,
    onRemove,
    canRemove,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(payment.amount.toString());

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: payment.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleAmountEdit = () => {
        const newAmount = Number(editValue);
        if (isNaN(newAmount) || newAmount < 0) {
            setEditValue(payment.amount.toString());
            return;
        }
        onAmountEdit(payment.id, newAmount);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAmountEdit();
        } else if (e.key === "Escape") {
            setEditValue(payment.amount.toString());
            setIsEditing(false);
        }
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-border hover:bg-border-light transition-colors ${
                isDragging ? "shadow-lg" : ""
            }`}
        >
            <td className="px-4 py-3 text-center text-text-secondary">
                <div className="flex items-center justify-center">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                        >
                            <circle cx="3" cy="3" r="1" />
                            <circle cx="3" cy="6" r="1" />
                            <circle cx="3" cy="9" r="1" />
                            <circle cx="9" cy="3" r="1" />
                            <circle cx="9" cy="6" r="1" />
                            <circle cx="9" cy="9" r="1" />
                        </svg>
                    </div>
                    <span className="ml-2">{index + 1}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-text">{payment.type}</td>
            <td className="px-4 py-3 text-text-secondary">{payment.day}</td>
            <td className="px-4 py-3 text-text-secondary">
                {formatDate(payment.date)}
            </td>
            <td
                className="px-4 py-3 text-text cursor-pointer hover:bg-blue-50 transition-colors"
                onDoubleClick={() =>
                    payment.type === "Транш" && setIsEditing(true)
                }
            >
                {isEditing && payment.type === "Транш" ? (
                    <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleAmountEdit}
                        onKeyDown={handleKeyPress}
                        className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                    />
                ) : (
                    `${formatCurrency(payment.amount)} ₸`
                )}
            </td>
            <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                    {payment.type === "Транш" && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-primary hover:text-primary-dark transition-colors p-1"
                                title="Редактировать"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </button>
                            {canRemove && (
                                <button
                                    onClick={() => onRemove(payment.id)}
                                    className="text-error hover:text-red-700 transition-colors p-1"
                                    title="Удалить"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

const PaymentsTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { payments } = useAppSelector((state) => state.calculator);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const trancheCount = payments.filter((p) => p.type === "Транш").length;
    const canRemove = trancheCount > 1;

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = payments.findIndex((p) => p.id === active.id);
            const newIndex = payments.findIndex((p) => p.id === over.id);

            dispatch(reorderPayments({ oldIndex, newIndex }));
        }
    };

    const handleAmountEdit = (id: string, amount: number) => {
        dispatch(updatePayment({ id, amount }));
        dispatch(
            addToast({
                type: "success",
                message: "Сумма обновлена",
            })
        );
    };

    const handleRemove = (id: string) => {
        if (canRemove) {
            dispatch(removePayment(id));
            dispatch(
                addToast({
                    type: "success",
                    message: "Транш удален",
                })
            );
        } else {
            dispatch(
                addToast({
                    type: "error",
                    message:
                        "Нельзя удалить все транши. Должен остаться хотя бы один.",
                })
            );
        }
    };

    const handleAdd = () => {
        dispatch(addPayment());
        dispatch(
            addToast({
                type: "success",
                message: "Новый транш добавлен",
            })
        );
    };

    return (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-semibold text-text">
                    Таблица платежей
                </h2>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center space-x-2"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    <span>Добавить</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                №
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Тип оплаты
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                День
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Дата
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Сумма, ₸
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={payments.map((p) => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {payments.map((payment, index) => (
                                    <SortableRow
                                        key={payment.id}
                                        payment={payment}
                                        index={index}
                                        onAmountEdit={handleAmountEdit}
                                        onRemove={handleRemove}
                                        canRemove={canRemove}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </tbody>
                </table>
            </div>

            {payments.length === 0 && (
                <div className="p-8 text-center text-text-secondary">
                    <p>Нет данных для отображения</p>
                </div>
            )}
        </div>
    );
};

export default PaymentsTable;
