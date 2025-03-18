import React, { useEffect, useState } from 'react'
import UserTable from './UserTable'
import UserFormModal from './UserFormModal'
import { PrimeReactProvider } from 'primereact/api';
import { UserFormConfig, UserFormInputs } from './UserForm';
import { useUserCreate } from './hooks/useUserCreate.php.js';
import { useAllTableUsers } from './hooks/useAllTableUsers.js';
import { useUserUpdate } from './hooks/useUserUpdate.js';
import { useUser } from './hooks/useUser.js';
import { set } from 'react-hook-form';

export const UserApp = () => {

    const [showUserFormModal, setShowUserFormModal] = useState(false)
    const [initialData, setInitialData] = useState<UserFormInputs | undefined>(undefined)
    const [initialUserFormConfig] = useState<UserFormConfig>({
        credentials: {
            visible: true
        }
    })
    const [userFormConfig, setUserFormConfig] = useState<UserFormConfig>(initialUserFormConfig)

    const { createUser } = useUserCreate();
    const { updateUser } = useUserUpdate();
    const { user, setUser, fetchUser } = useUser();
    const { users, fetchUsers } = useAllTableUsers();

    const onCreate = () => {
        setInitialData(undefined)
        setUserFormConfig(initialUserFormConfig)
        setUser(null)
        setShowUserFormModal(true)
    }

    const handleSubmit = async (data: UserFormInputs) => {
        const finalData: UserFormInputs = {
            ...data,
            user_specialty_id: data.user_specialty_id === null || data.user_specialty_id === 0 ? 1 : data.user_specialty_id
        }
        if (user) {
            await updateUser(user.id, finalData)
        } else {
            await createUser(finalData)
        }
        fetchUsers()
        setShowUserFormModal(false)
    };

    const handleHideUserFormModal = () => {
        setShowUserFormModal(false)
    }

    const handleTableEdit = (id: string) => {
        fetchUser(id);
        setShowUserFormModal(true);
        setUserFormConfig({
            credentials: {
                visible: false
            }
        })
    };

    useEffect(() => {
        if (user) {
            setInitialData({
                username: '',
                email: user.email || '',
                password: '',
                first_name: user.first_name || '',
                middle_name: user.middle_name || '',
                last_name: user.last_name || '',
                second_last_name: user.second_last_name || '',
                user_role_id: +user.user_role_id || 0,
                user_specialty_id: +user.user_specialty_id || 0,
                country_id: user?.country_id.toString() || '',
                city_id: user?.city_id.toString() || '',
                gender: user.gender || '',
                address: user.address || '',
                phone: user.phone || '',
            })
        }
    }, [user])

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
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Nuevo
                        </button>
                    </div>
                </div>
                <UserTable
                    users={users}
                    onEditItem={handleTableEdit}
                ></UserTable>
                <UserFormModal
                    title='Crear usuario'
                    show={showUserFormModal}
                    handleSubmit={handleSubmit}
                    onHide={handleHideUserFormModal}
                    initialData={initialData}
                    config={userFormConfig}
                ></UserFormModal>
            </PrimeReactProvider>
        </>
    )
}
