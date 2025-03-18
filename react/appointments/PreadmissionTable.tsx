import React, { useEffect, useState } from "react";
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../components/CustomDataTable";
import { usePreadmissions } from "./hooks/usePreadmission";

export const PreadmissionTable: React.FC = () => {
  const { preadmissions } = usePreadmissions();

  const columns: ConfigColumns[] = [
    { data: "weight", orderable: true },
    { data: "size", orderable: true },
    { data: "imc", orderable: true },
    { data: "glycemia", orderable: true },
    { data: "createdAt", orderable: true },
  ];

  return (
    <div>
      <CustomDataTable columns={columns} data={preadmissions}>
        <thead>
          <tr>
            <th className="border-top custom-th text-start">Peso</th>
            <th className="border-top custom-th text-start">Tamaño</th>
            <th className="border-top custom-th text-start">IMC</th>
            <th className="border-top custom-th text-start">Glucosa</th>
            <th className="border-top custom-th text-start">
              Fecha de creación
            </th>
          </tr>
        </thead>
      </CustomDataTable>
    </div>
  );
};
