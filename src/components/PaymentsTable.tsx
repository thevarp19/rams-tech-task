import {
    closestCenter,
    DndContext,
    DragEndEvent,
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
    index: number | null;
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
    const [originalValue, setOriginalValue] = useState(
        payment.amount.toString()
    );

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
        const numericValue = Number(editValue.replace(/\s/g, ""));
        if (isNaN(numericValue) || numericValue < 0) {
            setEditValue(originalValue);
            setIsEditing(false);
            return;
        }
        onAmountEdit(payment.id, numericValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(originalValue);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAmountEdit();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    const startEditing = () => {
        const formatted = formatCurrency(payment.amount);
        setOriginalValue(formatted);
        setEditValue(formatted);
        setIsEditing(true);
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-border hover:bg-gray-50 transition-colors ${
                isDragging ? "shadow-lg" : ""
            }`}
        >
            <td className="px-4 py-3 text-center text-text-secondary border-r-2 border-gray-200">
                <div className="flex items-center justify-center">
                    {payment.type !== "Задаток" && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded mr-2"
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
                    )}
                    <span>{index ?? ""}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-text font-medium ">{payment.type}</td>
            <td className="px-4 py-3 text-text-secondary ">{payment.day}</td>
            <td className="px-4 py-3 text-text-secondary ">
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {formatDate(payment.date)}
                </span>
            </td>
            <td className="px-4 py-3 text-text ">
                {isEditing && payment.type === "Транш" ? (
                    <div className="bg-gray-50 border border-green-500 rounded p-2">
                        <div className="flex items-center space-x-2">
                            <input
                                value={editValue}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (!/^\d*$/.test(raw)) return;
                                    const formatted =
                                        raw === ""
                                            ? ""
                                            : formatCurrency(Number(raw));
                                    setEditValue(formatted);
                                }}
                                onKeyDown={handleKeyPress}
                                className="flex-1 px-2 py-1 bg-transparent border-none focus:outline-none text-sm"
                                autoFocus
                            />
                            <button
                                onClick={handleAmountEdit}
                                className="text-green-600 hover:text-green-700 p-1"
                                title="Подтвердить"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-[#6C6D6D] hover:text-[#6C6D6D] p-1"
                                title="Отменить"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <span
                        className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={startEditing}
                        title="Нажмите для редактирования"
                    >
                        {formatCurrency(payment.amount)}
                    </span>
                )}
            </td>
            <td className="px-4 py-3 text-center">
                {payment.type === "Транш" && (
                    <div className="flex items-center justify-center space-x-1">
                        {canRemove && (
                            <button
                                onClick={() => onRemove(payment.id)}
                                className="text-[#CFD2D1] hover:text-[#024638] transition-colors p-1"
                                title="Удалить"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M19 13H5v-2h14v2z" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activePayment = payments.find(
                (p) => p.id === active.id.toString()
            );
            const overPayment = payments.find(
                (p) => p.id === over.id.toString()
            );

            if (
                activePayment?.type !== "Задаток" &&
                overPayment?.type !== "Задаток"
            ) {
                const oldIndex = payments.findIndex(
                    (p) => p.id === active.id.toString()
                );
                const newIndex = payments.findIndex(
                    (p) => p.id === over.id.toString()
                );

                dispatch(reorderPayments({ oldIndex, newIndex }));
                dispatch(
                    addToast({
                        type: "success",
                        message: "Порядок траншей обновлен",
                    })
                );
            }
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
        <div className=" max-h-[700px] overflow-y-auto px-2">
            <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full ">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider border-r-2 border-gray-600 h-[50px]">
                                    №
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider border-r-2 border-gray-600 h-[50px]">
                                    Тип оплаты
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider border-r-2 border-gray-600 h-[50px]">
                                    День
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider border-r-2 border-gray-600 h-[50px]">
                                    Дата
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider border-r-2 border-gray-600 h-[50px]">
                                    Сумма, ₸
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
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
                                    items={payments
                                        .filter((p) => p.type !== "Задаток")
                                        .map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {(() => {
                                        let orderIdx = 0;
                                        return payments.map((payment) => {
                                            const displayIndex =
                                                payment.type !== "Задаток"
                                                    ? ++orderIdx
                                                    : null;
                                            return (
                                                <SortableRow
                                                    key={payment.id}
                                                    payment={payment}
                                                    index={displayIndex}
                                                    onAmountEdit={
                                                        handleAmountEdit
                                                    }
                                                    onRemove={handleRemove}
                                                    canRemove={canRemove}
                                                />
                                            );
                                        });
                                    })()}
                                </SortableContext>
                            </DndContext>

                            <tr className="border-b border-border">
                                <td className="px-4 py-3 border-r-2 border-gray-200"></td>
                                <td className="px-4 py-3 "></td>
                                <td className="px-4 py-3 "></td>
                                <td className="px-4 py-3 "></td>
                                <td className="px-4 py-3 "></td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={handleAdd}
                                        className="text-primary hover:text-primary-dark transition-colors p-1"
                                        title="Добавить новый транш"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {payments.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        <p>Нет данных для отображения</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsTable;
