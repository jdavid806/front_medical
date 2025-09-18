import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages";

interface PrescriptionPackagesTableProps {
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    ref?: React.RefObject<PrescriptionPackagesTableRef>;
}

export interface PrescriptionPackagesTableRef {
    fetchData: () => void;
}

export const PrescriptionPackagesTable = forwardRef((props: PrescriptionPackagesTableProps, ref) => {

    const { onEdit, onDelete } = props;

    const { clinicalPackages, fetchClinicalPackages, loading: clinicalPackagesLoading } = useClinicalPackages();

    useImperativeHandle(ref, () => ({
        fetchData: fetchClinicalPackages
    }));

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
                        icon={<i className="fas fa-edit me-2"></i>}
                        className="btn btn-primary"
                        onClick={() => onEdit(data)}
                    />
                    <Button
                        label="Eliminar"
                        icon={<i className="fas fa-trash me-2"></i>}
                        className="btn btn-danger"
                        onClick={() => onDelete(data)}
                    />
                </div>
            )
        }
    ];

    return (<>
        <CustomPRTable
            columns={columns}
            data={clinicalPackages}
            onReload={fetchClinicalPackages}
            loading={clinicalPackagesLoading}
        />
    </>);
});