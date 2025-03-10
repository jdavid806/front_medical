import React, { useState } from 'react'
import PrescriptionTable from '../prescriptions/components/PrescriptionTable';
import PrescriptionModal from './components/PrescriptionModal';
import { usePrescription } from './hooks/usePrescription';
import { Medicine } from '../models/models';


export const PrescriptionApp = () => {
    const { createPrescription} = usePrescription();
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const handleSubmit = (data: any)  => {

        createPrescription(data as unknown as Medicine);
    };

    const handleOpenPrescriptionModal = () => {
        setShowPrescriptionModal(true)
    }

    const handleHidePrescriptionModal = () => {
        setShowPrescriptionModal(false)
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Recetas</h4>
                <div className="text-end mb-2">
                    <div className="">
                        <a
                            className="btn btn-primary"
                            onClick={handleOpenPrescriptionModal}>Nueva Receta
                        </a>
                    </div>
                </div>
            </div>
            <PrescriptionTable></PrescriptionTable>
            <PrescriptionModal
                show={showPrescriptionModal}
                handleSubmit={handleSubmit}
                onHide={handleHidePrescriptionModal}
            ></PrescriptionModal>
        </>
    )
}
