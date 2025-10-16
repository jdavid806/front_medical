import React, { useEffect, useState } from 'react'
import { UserAvailabilityTable } from './components/UserAvailabilityTable';
import UserAvailabilityFormModal from './components/UserAvailabilityFormModal';
import { PrimeReactProvider } from 'primereact/api';
import { UserAvailabilityFormInputs } from './components/UserAvailabilityForm';
import { useUserAvailabilitiesTable } from './hooks/useUserAvailabilitiesTable';
import { useUserAvailability } from './hooks/useUserAvailability';
import { useUserAvailabilityUpdate } from './hooks/useUserAvailabilityUpdate';
import { useUserAvailabilityDelete } from './hooks/useUserAvailabilityDelete';
import { useUserAvailabilityCreate } from './hooks/useUserAvailabilityCreate';
import { convertHHMMSSToDate, convertHHMMToDate } from '../../services/utilidades';

interface UserAvailabilityAppProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;
}
export const UserAvailabilityApp = ({
    onConfigurationComplete,
    isConfigurationContext = false
}: UserAvailabilityAppProps) => {


    const [showFormModal, setShowFormModal] = useState(false)
    const [initialData, setInitialData] = useState<UserAvailabilityFormInputs | undefined>(undefined)

    const { availabilities, fetchData: fetchAvailabilities } = useUserAvailabilitiesTable();
    const { createUserAvailability } = useUserAvailabilityCreate();
    const { updateUserAvailability } = useUserAvailabilityUpdate();
    const { deleteUserAvailability } = useUserAvailabilityDelete();
    const { userAvailability, setUserAvailability, fetchUserAvailability } = useUserAvailability();

    const onCreate = () => {
        setInitialData(undefined)
        setUserAvailability(null)
        setShowFormModal(true)
    }

    // Determinar si está completo
    const isComplete = availabilities && availabilities.length > 0;
    const showValidations = isConfigurationContext;

    useEffect(() => {
        onConfigurationComplete?.(isComplete);
    }, [availabilities, onConfigurationComplete, isComplete]);

    const handleSubmit = async (data: UserAvailabilityFormInputs) => {
        const finalData: UserAvailabilityFormInputs = {
            ...data,
            appointment_type_id: data.appointment_type_id.toString() || '1',
            appointment_duration: data.appointment_duration || 1,
        }
        try {
            if (userAvailability) {
                await updateUserAvailability(userAvailability.id, finalData)
            } else {
                await createUserAvailability(finalData)
            }
            fetchAvailabilities()
            setShowFormModal(false)
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableEdit = (id: string) => {
        fetchUserAvailability(id);
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteUserAvailability(id)
        if (confirmed) fetchAvailabilities()
    };



    useEffect(() => {
        if (userAvailability) {
            const data = {
                user_id: userAvailability?.user_id.toString() ?? '',
                office: userAvailability?.office ?? '',
                module_id: userAvailability?.module_id ?? '',
                otp_enabled: userAvailability.is_active,
                appointment_type_id: userAvailability?.appointment_type_id.toString() ?? '',
                branch_id: userAvailability?.branch_id?.toString() ?? '1',
                appointment_duration: userAvailability?.appointment_duration ?? 0,
                is_group: userAvailability?.is_group ?? false,
                max_capacity: userAvailability?.max_capacity ?? 0,
                days_of_week: Array.isArray(userAvailability?.days_of_week)
                    ? userAvailability.days_of_week.map(day => parseInt(day))
                    : (userAvailability?.days_of_week ? [userAvailability.days_of_week] : []).map(day => parseInt(day)),
                start_time: convertHHMMToDate(userAvailability?.start_time),
                end_time: convertHHMMToDate(userAvailability?.end_time),
                free_slots: userAvailability?.free_slots.map(slot => ({
                    start_time: convertHHMMToDate(slot.start_time),
                    end_time: convertHHMMToDate(slot.end_time)
                })) ?? []
            }
            console.log(userAvailability, data);

            setInitialData(data)
        }
    }, [userAvailability])

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
                                ? 'Horarios configurados correctamente! Puede continuar al siguiente módulo.'
                                : 'Configure al menos un rol de Horarios para habilitar el botón "Siguiente Módulo"'
                            }
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-1">Horarios de Atención</h4>
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
                <UserAvailabilityTable
                    availabilities={availabilities}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                ></UserAvailabilityTable>
                <UserAvailabilityFormModal
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false) }}
                    initialData={initialData}
                ></UserAvailabilityFormModal>
            </PrimeReactProvider>
        </>
    )
}
