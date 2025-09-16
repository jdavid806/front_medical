import React, { useState } from "react";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages";
import { PrescriptionPackagesFormModal } from "./PrescriptionPackagesFormModal";

export const PrescriptionPackagesApp = () => {

    const { clinicalPackages, fetchClinicalPackages, loading: clinicalPackagesLoading } = useClinicalPackages();

    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'label',
            header: 'Nombre'
        },
        {
            field: 'description',
            header: 'Descripción'
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (data: any) => (
                <div className="d-flex gap-2">
                    <Button
                        label="Editar"
                        icon={<i className="fas fa-edit"></i>}
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedItem(data);
                            setShowFormModal(true);
                        }}
                    />
                    <Button
                        label="Eliminar"
                        icon={<i className="fas fa-trash"></i>}
                        className="btn btn-danger"
                        onClick={() => setSelectedItem(data)}
                    />
                </div>
            )
        }
    ];

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
        <CustomPRTable
            columns={columns}
            data={clinicalPackages}
            onReload={fetchClinicalPackages}
            loading={clinicalPackagesLoading}
        />
        <PrescriptionPackagesFormModal
            packageId={selectedItem?.id}
            visible={showFormModal}
            onHide={() => setShowFormModal(false)}
        />
    </>);
};

