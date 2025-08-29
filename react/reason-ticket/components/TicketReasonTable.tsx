import React, { useEffect, useState } from 'react';
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import TableActionsWrapper from '../../components/table-actions/TableActionsWrapper';
import { EditTableAction } from '../../components/table-actions/EditTableAction';
import { DeleteTableAction } from '../../components/table-actions/DeleteTableAction';
import { TicketReasonDto } from '../../models/models';

interface TicketReasonTableItem {
  id: number;
  label: string;
}

type TicketReasonTableProps = {
  ticketReasons: TicketReasonDto[];
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
};

export const TicketReasonTable: React.FC<TicketReasonTableProps> = ({ ticketReasons, onEditItem, onDeleteItem }) => {
  const [tableReasons, setTableReasons] = useState<TicketReasonTableItem[]>([]);

  useEffect(() => {
    setTableReasons(ticketReasons.map(r => ({
      id: r.id,
      label: r.label
    })));
  }, [ticketReasons]);

  const columns: ConfigColumns[] = [
    { data: 'label' },
    { orderable: false, searchable: false }
  ];

  const slots = {
    1: (cell, data: TicketReasonTableItem) => (
      <div className="d-flex justify-content-end">
        <TableActionsWrapper>
          <EditTableAction onTrigger={() => onEditItem(data.id.toString())} />
          <DeleteTableAction onTrigger={() => onDeleteItem(data.id.toString())} />
        </TableActionsWrapper>
      </div>
    )
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <CustomDataTable data={tableReasons} slots={slots} columns={columns}>
          <thead>
            <tr>
              <th>Label</th>
              <th></th>
            </tr>
          </thead>
        </CustomDataTable>
      </div>
    </div>
  );
};
