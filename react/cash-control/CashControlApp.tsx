import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useCashControlCreate } from './hooks/useCashControlCreate';
import { CashControlForm, CashControlInputs } from './components/CashControlForm';
import { Card } from 'primereact/card';

export const CashControlApp = () => {

    const { createCashControl } = useCashControlCreate();

    const handleSubmit = async (data: CashControlInputs) => {
        try {
            await createCashControl(data)
            setTimeout(() => {
                window.location.href = 'homeAuditoria';
            }, 2000);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <Card title="Cierre de Caja">
                    <CashControlForm
                        formId="createCashControlForm"
                        onHandleSubmit={handleSubmit}
                    ></CashControlForm>
                    <div className="d-flex justify-content-end">
                        <button
                            type='submit'
                            form='createCashControlForm'
                            className="btn btn-primary my-0">
                            <i className="fas fa-bookmark"></i> Guardar
                        </button>
                    </div>
                </Card>
            </PrimeReactProvider>
        </>
    )
}
