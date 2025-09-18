import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { PrescriptionPackagesFormModal } from "./PrescriptionPackagesFormModal";
import { PrescriptionPackagesTable } from "./PrescriptionPackagesTable";
import { PrescriptionPackagesTableRef } from "./PrescriptionPackagesTable";
import { useDeletePrescriptionPackage } from "./hooks/useDeletePrescriptionPackage";

export const PrescriptionPackagesApp = () => {

    const { deletePrescriptionPackage } = useDeletePrescriptionPackage();

    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const tableRef = useRef<PrescriptionPackagesTableRef>(null);

    const handleTableDelete = async (item: any) => {
        const confirmed = await deletePrescriptionPackage(item.id)
        if (confirmed) tableRef.current?.fetchData()
    };

    const handleFormSave = () => {
        setShowFormModal(false)
        tableRef.current?.fetchData()
    };

    return (<>
        <div className="d-flex justify-content-between gap-3 mb-3">
            <h2>Paquetes</h2>
            <Button
                label="Agregar nuevo paquete"
                icon={<i className="fas fa-plus me-2"></i>}
                className="btn btn-primary"
                onClick={() => setShowFormModal(true)}
            />
        </div>
        <PrescriptionPackagesTable
            onEdit={(item: any) => {
                setSelectedItem(item);
                setShowFormModal(true);
            }}
            onDelete={handleTableDelete}
            ref={tableRef}
        />
        <PrescriptionPackagesFormModal
            packageId={selectedItem?.id}
            visible={showFormModal}
            onHide={() => {
                setShowFormModal(false)
                setSelectedItem(null)
            }}
            onSave={handleFormSave}
        />
    </>);
};

