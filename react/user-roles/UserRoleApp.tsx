import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { UserRoleFormInputs } from './components/UserRoleForm';
import { useUserRole } from './hooks/useUserRole';
import { useUserRoleDelete } from './hooks/useUserRoleDelete';
import { useRoles } from './hooks/useUserRoles';
import { UserRoleTable } from './components/UserRoleTable';
import { UserRoleFormModal } from './components/UserRoleFormModal';
import { useUserRoleCreate } from './hooks/useUserRoleUpdate';
import { useUserRoleUpdate } from './hooks/useUserRoleCreate';

export const UserRoleApp = () => {
    const [showFormModal, setShowFormModal] = useState(false)
    const [initialData, setInitialData] = useState<UserRoleFormInputs | undefined>(undefined)

    const { userRoles, fetchUserRoles } = useRoles();
    const { createUserRole } = useUserRoleCreate();
    const { updateUserRole } = useUserRoleUpdate();
    const { deleteUserRole } = useUserRoleDelete();
    const { userRole, fetchUserRole, setUserRole } = useUserRole();

    const onCreate = () => {
        setInitialData(undefined)
        setShowFormModal(true)
    }

    const handleSubmit = async (data: UserRoleFormInputs) => {
        try {
            if (userRole) {
                // Actualizar rol existente (incluye menús y permisos)
                await updateUserRole(userRole.id, data);
            } else {
                // Crear nuevo rol (incluye menús y permisos)
                await createUserRole(data);
            }

            fetchUserRoles();
            setShowFormModal(false);
            setUserRole(null);
        } catch (error) {
            console.error('Error al guardar rol:', error);
        }
    };

    const handleTableEdit = (id: string) => {
        fetchUserRole(id);
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteUserRole(id)
        if (confirmed) fetchUserRoles()
    };

    useEffect(() => {
        if (userRole) {
            setInitialData({
                name: userRole.name || '',
                group: userRole.group || '',
                permissions: userRole.permissions?.map(permission => permission.key) || [],
                menus: userRole.menus?.map(item => ({
                    id: item.id,
                    key_: item.key,
                    name: item.label,
                    is_active: item.is_active,
                    pivot: item.pivot
                })) || [],
                menuIds: userRole.menus?.map(menu => menu.id) || []
            });
        } else {
            setInitialData(undefined);
        }
    }, [userRole]);

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Roles de Usuario</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus"></i> Nuevo
                        </button>
                    </div>
                </div>
                <UserRoleTable
                    userRoles={userRoles}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                >
                </UserRoleTable>
                <UserRoleFormModal
                    title={userRole ? 'Editar rol de Usuario' : 'Crear rol de Usuario'}
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => {
                        setShowFormModal(false)
                        setUserRole(null)
                    }}
                    initialData={initialData}
                ></UserRoleFormModal>
            </PrimeReactProvider>
        </>
    )
}