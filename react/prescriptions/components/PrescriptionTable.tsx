import React, { useEffect } from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import { PrescriptionDto, PrescriptionTableItem } from '../../models/models.js';
import CustomDataTable from '../../components/CustomDataTable.js';
import { TableBasicActions } from '../../components/TableBasicActions.js';
import { PrintTableAction } from '../../components/table-actions/PrintTableAction.js';
import { DownloadTableAction } from '../../components/table-actions/DownloadTableAction.js';
import { ShareTableAction } from '../../components/table-actions/ShareTableAction.js';
import TableActionsWrapper from '../../components/table-actions/TableActionsWrapper.js';

interface PrescriptionTableProps {
    prescriptions: PrescriptionDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ prescriptions, onEditItem, onDeleteItem }) => {

    const [tablePrescriotions, setTablePrescriptions] = React.useState<PrescriptionTableItem[]>([])

    useEffect(() => {
        const mappedPrescriptions: PrescriptionTableItem[] = prescriptions
            .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
            .map(prescription => ({
                id: prescription.id,
                doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
                patient: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
                created_at: new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(prescription.created_at))
            }));
        setTablePrescriptions(mappedPrescriptions)
    }, [prescriptions])

    const columns: ConfigColumns[] = [
        { data: 'doctor' },
        { data: 'created_at' },
        { orderable: false, searchable: false }
    ];

    const slots = {
        2: (cell, data: PrescriptionTableItem) => (
            <>
                <div className="text-end flex justify-cointent-end">
                    <TableActionsWrapper>
                        <PrintTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(data.id, "Impresion", "Receta", "Completa", "Receta");
                        }} />
                        <DownloadTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(data.id, "Descarga", "Receta", "Completa", "Receta");
                        }} />
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-header">Compartir</li>
                        <ShareTableAction shareType='whatsapp' onTrigger={() => {
                            //@ts-ignore
                            enviarDocumento(data.id, "Descarga", "Receta", "Completa", patient_id, UserManager.getUser().id, title)
                        }} />
                    </TableActionsWrapper>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={tablePrescriotions}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Doctor</th>
                                <th className="border-top custom-th">Fecha de creación</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}

export default PrescriptionTable
