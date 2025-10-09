import React, { useState, useEffect } from 'react'
import { ConfigDropdownMenu } from '../config/components/ConfigDropdownMenu';
import { UserAvailabilityTable } from '../user-availabilities/components/UserAvailabilityTable';
import UserAvailabilityFormModal from '../user-availabilities/components/UserAvailabilityFormModal';
import { PrimeReactProvider } from 'primereact/api';

interface UserSpecialtyAppProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;
}

export const UserSpecialtyApp: React.FC<UserSpecialtyAppProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false
}) => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        const hasAvailabilities = availabilities && availabilities.length > 0;
        setIsComplete(hasAvailabilities);
        onConfigurationComplete?.(hasAvailabilities);
    }, [availabilities, onConfigurationComplete]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(Array.from(formData.entries()));
        console.log(data);
    };

    const showValidations = isConfigurationContext;

    return (
        <>
            {showValidations && (
                <div className="validation-section mb-3">
                    <div className={`alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`}>
                        <i className={`${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`}></i>
                        {isComplete
                            ? '¡Horarios configurados correctamente! Puede continuar al siguiente módulo.'
                            : 'Configure al menos un horario de atención para habilitar el botón "Siguiente Módulo"'
                        }
                    </div>
                </div>
            )}

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
                <UserAvailabilityTable
                    onDataChange={setAvailabilities}
                ></UserAvailabilityTable>
                <UserAvailabilityFormModal
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false) }}
                ></UserAvailabilityFormModal>
            </PrimeReactProvider>
        </>
    );
};