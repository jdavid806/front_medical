import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import { useUserAvailabilitiesTable } from '../hooks/useUserAvailabilitiesTable';
import { UserAvailabilityDto } from '../../models/models';
import { UserTableActions } from '../../users/UserTableActions';
import CustomDataTable from '../../components/CustomDataTable';

export const UserAvailabilityTable = () => {
    const { availabilities } = useUserAvailabilitiesTable();

    const columns: ConfigColumns[] = [
        { data: 'doctorName', },
        { data: 'appointmentType' },
        { data: 'daysOfWeek' },
        { data: 'startTime' },
        { data: 'endTime' },
        { data: 'branchName' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        6: (cell, data: UserAvailabilityDto) => (
            <UserTableActions></UserTableActions>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={availabilities}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Usuario</th>
                                <th className="border-top custom-th">Tipo de Cita</th>
                                <th className="border-top custom-th">Día de la Semana</th>
                                <th className="border-top custom-th">Hora de Inicio</th>
                                <th className="border-top custom-th">Hora de Fin</th>
                                <th className="border-top custom-th">Sucursal</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
