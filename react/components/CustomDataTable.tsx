import React from 'react';
import DataTable from 'datatables.net-react';
import DT, { ConfigColumns } from 'datatables.net-bs5';

DataTable.use(DT);

interface CustomDataTableProps {
    children: React.ReactNode;
    data: any[];
    slots?: any;
    columns: ConfigColumns[];
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({ children, data, slots, columns }) => {

    const options = {
        language: {
            url: "https://cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json"
        }
    }

    return (
        <DataTable
            data={data}
            slots={slots}
            options={options}
            columns={columns}
        >
            {children}
        </DataTable>
    );
};

export default CustomDataTable;

