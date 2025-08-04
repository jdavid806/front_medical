import React, { useState } from "react";
import { ComissionConfigDto } from "../models/models.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../components/table-actions/DeleteTableAction.js";
import CustomDataTable from "../components/CustomDataTable.js";
import { ConfigColumns } from "datatables.net-bs5";
import { comissionConfig } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";

interface CommissionsTableProps {
  commissions: ComissionConfigDto[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
}

export const CommissionTable: React.FC<CommissionsTableProps> = ({
  commissions,
  onEditItem,
  onDeleteItem,
}) => {
  const columns: ConfigColumns[] = [
    { data: "fullName" },
    { data: "attention_type" },
    { data: "application_type" },
    { data: "commission_type" },
    { data: "commission_value" },
    { data: "percentage_base" },
    { data: "percentage_value" },
    { orderable: false, searchable: false },
  ];

  const onDelete = async (id: string) => {
    const response = await comissionConfig.CommissionConfigDelete(id);
    console.log(response);
    SwalManager.success({
      title: "Registro Eliminado",
    });
  };

  const slots = {
    7: (cell, data: ComissionConfigDto) => (
      <TableActionsWrapper>
        <li style={{ marginBottom: "8px" }}>
          <EditTableAction
            onTrigger={() => onEditItem && onEditItem(data.id)}
          />
        </li>
        <li style={{ marginBottom: "8px" }}>
          <DeleteTableAction onTrigger={() => onDelete(data.id)} />
        </li>
      </TableActionsWrapper>
    ),
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable data={commissions} slots={slots} columns={columns}>
            <thead>
              <tr>
                <th className="border-top custom-th">Profesional</th>
                <th className="border-top custom-th">Tipo de atención</th>
                <th className="border-top custom-th">Tipo de aplicación</th>
                <th className="border-top custom-th">Comisión</th>
                <th className="border-top custom-th">Valor de la comisión</th>
                <th className="border-top custom-th">Porcentaje aplicado</th>
                <th className="border-top custom-th">Porcentaje</th>
                <th
                  className="text-end align-middle pe-0 border-top mb-2"
                  scope="col"
                ></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
