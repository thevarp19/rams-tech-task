import React, { useEffect } from "react";
import { Provider } from "react-redux";
import PaymentForm from "./components/PaymentForm";
import PaymentsTable from "./components/PaymentsTable";
import SummaryPanel from "./components/SummaryPanel";
import ToastContainer from "./components/Toast";
import { useAppDispatch } from "./hooks/redux";
import { store } from "./store";
import { initializePayments } from "./store/calculatorSlice";

const AppContent: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Инициализируем платежи при загрузке приложения
        dispatch(initializePayments());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-text text-center mb-8">
                    Калькулятор рассрочки
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Левая колонка - Форма */}
                    <div className="lg:col-span-1">
                        <PaymentForm />
                    </div>

                    {/* Центральная колонка - Таблица */}
                    <div className="lg:col-span-2">
                        <PaymentsTable />
                    </div>

                    {/* Правая колонка - Сводка */}
                    <div className="lg:col-span-1">
                        <SummaryPanel />
                    </div>
                </div>
            </div>

            {/* Toast уведомления */}
            <ToastContainer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
};

export default App;
