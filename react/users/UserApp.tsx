import React, { useState } from 'react'
import UserTable from './UserTable'
import UserFormModal from './UserFormModal'
import { PrimeReactProvider } from 'primereact/api';
import { UserFormInputs } from './UserForm';
import { useUserCreate } from './hooks/useUserCreate.php.js';

export const UserApp = () => {

    const [showUserFormModal, setShowUserFormModal] = useState(false)
    const { createUser } = useUserCreate()

    const handleSubmit = (data: UserFormInputs) => {
        createUser(data)
    };

    const handleOpenUserFormModal = () => {
        setShowUserFormModal(true)
    }

    const handleHideUserFormModal = () => {
        setShowUserFormModal(false)
    }

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Usuarios</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={handleOpenUserFormModal}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Nuevo
                        </button>
                    </div>
                </div>
                <UserTable></UserTable>
                <UserFormModal
                    show={showUserFormModal}
                    handleSubmit={handleSubmit}
                    onHide={handleHideUserFormModal}
                ></UserFormModal>
            </PrimeReactProvider>
        </>
    )
}
