import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { UserAbsenceTable } from './components/UserAbsenceTable';
import { useUserAbsences } from './hooks/useUserAbsences';
import { useUserAbsence } from './hooks/useUserAbsence';
import { useUserAbsenceCreate } from './hooks/useUserAbsenceCreate';
import { useUserAbsenceUpdate } from './hooks/useUserAbsenceUpdate';
import { useUserAbsenceDelete } from './hooks/useUserAbsenceDelete';
import { UserAbsenceFormInputs } from './components/UserAbsenceForm';
import { UserAbsenceFormModal } from './components/UserAbsenceFormModal';
import { stringToDate } from '../../services/utilidades';

export const UserAbsenceApp = () => {

    const [showFormModal, setShowFormModal] = useState(false)
    const [initialData, setInitialData] = useState<UserAbsenceFormInputs | undefined>(undefined)

    const { userAbsences, fetchUserAbsences } = useUserAbsences();
    const { createUserAbsence } = useUserAbsenceCreate();
    const { updateUserAbsence } = useUserAbsenceUpdate();
    const { deleteUserAbsence } = useUserAbsenceDelete();
    const { userAbsence, setUserAbsence, fetchUserAbsence } = useUserAbsence();

    const onCreate = () => {
        setInitialData(undefined)
        setUserAbsence(null)
        setShowFormModal(true)
    }

    const handleSubmit = async (data: UserAbsenceFormInputs) => {
        const finalData = {
            ...data,
            start_date: data.dateRange?.[0]?.toISOString().split('T')[0] ?? '',
            end_date: data.dateRange?.[1]?.toISOString().split('T')[0] ?? ''
        }

        if (userAbsence) {
            await updateUserAbsence(userAbsence.id, finalData)
        } else {
            await createUserAbsence(finalData, finalData.user_id)
        }
        fetchUserAbsences()
        setShowFormModal(false)
    };

    const handleTableEdit = (id: string) => {
        fetchUserAbsence(id);
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteUserAbsence(id)
        if (confirmed) fetchUserAbsences()
    };

    useEffect(() => {
        setInitialData({
            user_id: userAbsence?.user_id.toString() || '',
            reason: userAbsence?.reason || '',
            dateRange: [stringToDate(userAbsence?.start_date), stringToDate(userAbsence?.end_date)]
        })
    }, [userAbsence])

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Ausencias Programadas</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus"></i> Nuevo
                        </button>
                    </div>
                </div>
                <UserAbsenceTable
                    items={userAbsences}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                >
                </UserAbsenceTable>
                <UserAbsenceFormModal
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false) }}
                    initialData={initialData}
                ></UserAbsenceFormModal>
            </PrimeReactProvider>
        </>
    )
}
