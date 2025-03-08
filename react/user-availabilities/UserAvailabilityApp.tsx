import React, { useState } from 'react'
import { ConfigDropdownMenu } from '../config/components/ConfigDropdownMenu';
import { UserAvailabilityTable } from './components/UserAvailabilityTable';
import UserAvailabilityFormModal from './components/UserAvailabilityFormModal';
import { PrimeReactProvider } from 'primereact/api';
import { UserAvailabilityFormInputs } from './components/UserAvailabilityForm';

export const UserAvailabilityApp = () => {

    const [showFormModal, setShowFormModal] = useState(false)
    const handleSubmit = (data: UserAvailabilityFormInputs) => {
        console.log(data);
    };

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Horarios de Atención</h4>
                    <div className="text-end mb-2">
                        <ConfigDropdownMenu
                            title="Nuevo"
                            onItemClick={(e, item) => {
                                if (item.target === '#modalCreateUserOpeningHour') {
                                    setShowFormModal(true)
                                }
                            }}
                        ></ConfigDropdownMenu>
                    </div>
                </div>
                <UserAvailabilityTable></UserAvailabilityTable>
                <UserAvailabilityFormModal
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false) }}
                ></UserAvailabilityFormModal>
            </PrimeReactProvider>
        </>
    )
}
