import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useCashControlCreate } from './hooks/useCashControlCreate';
import { CashControlForm, CashControlInputs } from './components/CashControlForm';
import { CustomFormModal } from "../components/CustomFormModal";

export const CashControlApp = () => {

    const { createCashControl } = useCashControlCreate();

    const handleSubmit = async (data: CashControlInputs) => {
        console.log(data);
        await createCashControl(data)
    };

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <CustomFormModal
                    formId='createCashControlForm'
                    show={true}
                    title='Control de caja'
                >
                    <CashControlForm
                        formId="createCashControlForm"
                        onHandleSubmit={handleSubmit}
                    ></CashControlForm>
                </CustomFormModal>
            </PrimeReactProvider>
        </>
    )
}
