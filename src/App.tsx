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
        dispatch(initializePayments());
    }, [dispatch]);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-8">
                    <h1 className="text-3xl font-bold text-text ">
                        Калькулятор
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        <div className="lg:col-span-1">
                            <PaymentForm />
                        </div>

                        <div className="lg:col-span-2">
                            <PaymentsTable />
                        </div>

                        <div className="lg:col-span-1">
                            <SummaryPanel />
                        </div>
                    </div>
                </div>
            </div>

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
