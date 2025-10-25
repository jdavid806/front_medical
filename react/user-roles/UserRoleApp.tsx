import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { UserRoleFormInputs } from './components/UserRoleForm';
import { useUserRole } from './hooks/useUserRole';
import { useUserRoleDelete } from './hooks/useUserRoleDelete';
import { useUserRoles } from './hooks/useUserRoles';
import { UserRoleTable } from './components/UserRoleTable';
import { UserRoleFormModal } from './components/UserRoleFormModal';
import { useUserRoleCreate } from './hooks/useUserRoleCreate';
import { useUserRoleUpdate } from './hooks/useUserRoleUpdate';
import { userRolesService } from '../../services/api';
import { SwalManager } from '../../services/alertManagerImported';

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
    const [editingRoleId, setEditingRoleId] = useState<number | undefined>(undefined)

    const { userRoles, fetchUserRoles } = useUserRoles();
    const { createUserRole } = useUserRoleCreate();
    const { updateUserRole } = useUserRoleUpdate();
    const { deleteUserRole } = useUserRoleDelete();
    const { userRole, fetchUserRole, setUserRole } = useUserRole();

    const isComplete = userRoles && userRoles.length > 0;
    const showValidations = isConfigurationContext;

    useEffect(() => {
        onConfigurationComplete?.(isComplete);
    }, [userRoles, onConfigurationComplete, isComplete]);

    const onCreate = () => {
        setInitialData(undefined)
        setEditingRoleId(undefined)
        setShowFormModal(true)
    }

    const handleSubmit = async (data: UserRoleFormInputs) => {
        console.log("Datos del formulario:", data)

        try {
            if (userRole) {
                console.log("Editando rol existente:", userRole.id);

                await updateUserRole(userRole.id, data);

                const payload = {
                    "group": data.group,
                    "is_active": true
                }
                await userRolesService.updateGroupRole(userRole.id, payload);

            } else {
                console.log("Creando nuevo rol");

                const createPayload = {
                    "name": data.name,
                    "group": data.group,
                    "is_active": true
                };

                await userRolesService.createRoleUserMenu(createPayload);
                SwalManager.success()
                console.log("Rol básico creado exitosamente");
            }

            fetchUserRoles();
            setShowFormModal(false);
            setUserRole(null);
            setEditingRoleId(undefined);

        } catch (error) {
            console.error('Error al guardar rol:', error);
        }
    };

    const handleTableEdit = (id: string) => {
        fetchUserRole(id);
        setEditingRoleId(Number(id));
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteUserRole(id)
        if (confirmed) {
            SwalManager.success()
            fetchUserRoles()
        }
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

                <UserRoleTable
                    userRoles={userRoles}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                    onReload={fetchUserRoles}
                    onCreateRole={onCreate}
                    loading={false}
                />

                <UserRoleFormModal
                    title={userRole ? 'Editar rol de Usuario' : 'Crear rol de Usuario'}
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => {
                        setShowFormModal(false)
                        setUserRole(null)
                        setEditingRoleId(undefined)
                    }}
                    initialData={initialData}
                    roleId={editingRoleId}
                ></UserRoleFormModal>
            </PrimeReactProvider>
        </>
    )
}