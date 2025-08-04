import React, { useEffect, useState } from 'react'
import PrescriptionTable from '../prescriptions/components/PrescriptionTable';
import PrescriptionModal from './components/PrescriptionModal';
import { usePrescriptionCreate } from './hooks/usePrescriptionCreate';
import { usePrescription } from './hooks/usePrescription';
import { usePrescriptionDelete } from './hooks/usePrescriptionDelete';
import { usePrescriptionUpdate } from './hooks/usePrescriptionUpdate';
import { PrescriptionFormInputs } from './components/PrescriptionForm';
import { usePatientPrescriptions } from './hooks/usePatientPrescriptions';

const patientId = ((new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id')) ?? "0")

export const PrescriptionApp = () => {
    const { createPrescription } = usePrescriptionCreate();
    const { updatePrescription } = usePrescriptionUpdate();
    const { prescriptions, fetchPrescriptions } = usePatientPrescriptions();
    const { deletePrescription } = usePrescriptionDelete();
    const { prescription, setPrescription, fetchPrescription } = usePrescription();

    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const [initialData, setInitialData] = useState<PrescriptionFormInputs | undefined>(undefined)

    const handleSubmit = async (data: any) => {
        console.log(data);
        const newData = {
            user_id: 1,
            patient_id: +patientId,
            medicines: data,
            is_active: true
        }

        if (prescription) {
            await updatePrescription(prescription.id, newData)
        } else {
            await createPrescription(newData)
        }
        fetchPrescriptions(patientId)
        setShowPrescriptionModal(false)
    };

    const handleTableEdit = (id: string) => {
        fetchPrescription(id);
        setShowPrescriptionModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deletePrescription(id)
        if (confirmed) fetchPrescriptions(patientId)
    }

    const handleOnCreate = () => {
        setInitialData(undefined)
        setPrescription(null)
        setShowPrescriptionModal(true)
    }

    const handleHidePrescriptionModal = () => {
        setShowPrescriptionModal(false)
    }

    useEffect(() => {
        fetchPrescriptions(patientId)
    }, [])

    useEffect(() => {
        console.log('Prescription: ', prescription)
        if (!prescription) return

        setInitialData({
            patient_id: +((new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id')) ?? "0"),
            medicines: prescription.recipe_items,
            user_id: 1,
            is_active: true
        })
    }, [prescription])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Recetas</h4>
                {/* <div className="text-end mb-2">
                    <div className="">
                        <a
                            className="btn btn-primary"
                            onClick={handleOnCreate}>Nueva Receta
                        </a>
                    </div>
                </div> */}
            </div>
            <PrescriptionTable
                prescriptions={prescriptions}
                onEditItem={handleTableEdit}
                onDeleteItem={handleTableDelete}
            ></PrescriptionTable>
            <PrescriptionModal
                title={prescription ? 'Editar receta' : 'Crear receta'}
                show={showPrescriptionModal}
                handleSubmit={handleSubmit}
                onHide={handleHidePrescriptionModal}
                initialData={initialData}
            ></PrescriptionModal>
        </>
    )
}
