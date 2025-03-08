import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import { useAllPrescriptions } from '../hooks/useAllPrescriptions.js';
import { UserTableActions } from '../../users/UserTableActions.js';
import { PrescriptionDto } from '../../models/models.js';
import CustomDataTable from '../../components/CustomDataTable.js';

const PrescriptionTable = () => {
    const { prescriptions } = useAllPrescriptions();

    const columns: ConfigColumns[] = [
        { data: 'doctor' },
        { data: 'patient' }, // Este campo ahora debería ser una cadena con el nombre completo
        { data: 'created_at' },
        { orderable: false, searchable: false }
    ];

    const slots = {
        3: (cell, data: PrescriptionDto) => (
            <UserTableActions></UserTableActions>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={prescriptions}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Doctor</th>
                                <th className="border-top custom-th">Paciente</th>
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
