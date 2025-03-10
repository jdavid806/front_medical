import React, { useState } from 'react'
import { ConfigDropdownMenu } from '../config/components/ConfigDropdownMenu';
import { UserAvailabilityTable } from '../user-availabilities/components/UserAvailabilityTable';
import UserAvailabilityFormModal from '../user-availabilities/components/UserAvailabilityFormModal';
import { PrimeReactProvider } from 'primereact/api';

export const UserSpecialtyApp = () => {

    const [showFormModal, setShowFormModal] = useState(false)
    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(Array.from(formData.entries()));
        console.log(data);
    };

    return (
        <>
            <PrimeReactProvider>
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
