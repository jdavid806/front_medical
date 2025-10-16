import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { UserRoleFormInputs } from './components/UserRoleForm';
import { useUserRole } from './hooks/useUserRole';
import { useUserRoleDelete } from './hooks/useUserRoleDelete';
import { useRoles } from './hooks/useUserRoles';
import { UserRoleTable } from './components/UserRoleTable';
import { UserRoleFormModal } from './components/UserRoleFormModal';
import { useUserRoleCreate } from './hooks/useUserRoleUpdate';
import { useUserRoleUpdate } from './hooks/useUserRoleCreate';

interface UserRoleAppProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;
}

export const UserRoleApp = ({
    onConfigurationComplete,
    isConfigurationContext = false
}: UserRoleAppProps) => {
    const [showFormModal, setShowFormModal] = useState(false)
    const [initialData, setInitialData] = useState<UserRoleFormInputs | undefined>(undefined)

    const { userRoles, fetchUserRoles } = useRoles();
    const { createUserRole } = useUserRoleCreate();
    const { updateUserRole } = useUserRoleUpdate();
    const { deleteUserRole } = useUserRoleDelete();
    const { userRole, fetchUserRole, setUserRole } = useUserRole();

    // Determinar si está completo
    const isComplete = userRoles && userRoles.length > 0;
    const showValidations = isConfigurationContext;

    useEffect(() => {
        onConfigurationComplete?.(isComplete);
    }, [userRoles, onConfigurationComplete, isComplete]);

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
                {/* Mostrar validaciones solo en contexto de configuración */}
                {showValidations && (
                    <div className="validation-section mb-3">
                        <div className={`alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`}>
                            <i className={`${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`}></i>
                            {isComplete
                                ? '¡Roles configurados correctamente! Puede continuar al siguiente módulo.'
                                : 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"'
                            }
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
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