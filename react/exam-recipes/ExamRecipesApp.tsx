import React, { useEffect, useState } from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import { useExamRecipes } from './hooks/useExamRecipes';
import TableActionsWrapper from '../components/table-actions/TableActionsWrapper';
import { PrintTableAction } from '../components/table-actions/PrintTableAction';
import { DownloadTableAction } from '../components/table-actions/DownloadTableAction';
import { ShareTableAction } from '../components/table-actions/ShareTableAction';
import CustomDataTable from '../components/CustomDataTable';
import { userService } from '../../services/api';

interface ExamRecipesTableItem {
    id: string;
    doctor: string;
    exams: string;
    patientId: string;
    created_at: string;
}

const patientId = new URLSearchParams(window.location.search).get('patient_id');

export const ExamRecipesApp: React.FC = () => {

    const { examRecipes } = useExamRecipes(patientId);
    const [tableExamRecipes, setTableExamRecipes] = useState<ExamRecipesTableItem[]>([])

    useEffect(() => {
        const mappedExamRecipes: ExamRecipesTableItem[] = examRecipes
            .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
            .map(prescription => ({
                id: prescription.id,
                doctor: `${prescription.user.first_name || ''} ${prescription.user.middle_name || ''} ${prescription.user.last_name || ''} ${prescription.user.second_last_name || ''}`,
                exams: prescription.details.map(detail => detail.exam_type.name).join(', '),
                patientId: prescription.patient_id,
                created_at: new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(prescription.created_at))
            }));
        setTableExamRecipes(mappedExamRecipes)
    }, [examRecipes])

    const columns: ConfigColumns[] = [
        { data: 'doctor' },
        { data: 'exams' },
        { data: 'created_at' },
        { orderable: false, searchable: false }
    ];

    const slots = {
        3: (cell, data: ExamRecipesTableItem) => (
            <>
                <div className="text-end flex justify-cointent-end">
                    <TableActionsWrapper>
                        <PrintTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(data.id, "Impresion", "RecetaExamen", "Completa", "Receta_de_examenes");
                        }} />
                        <DownloadTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(data.id, "Descarga", "RecetaExamen", "Completa", "Receta_de_examenes");
                        }} />
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-header">Compartir</li>
                        <ShareTableAction shareType='whatsapp' onTrigger={async () => {
                            const user = await userService.getLoggedUser()
                            //@ts-ignore
                            enviarDocumento(data.id, "Descarga", "RecetaExamen", "Completa", data.patientId, user.id, "Receta_de_examenes")
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
                        data={tableExamRecipes}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Doctor</th>
                                <th className="border-top custom-th">Examenes recetados</th>
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
