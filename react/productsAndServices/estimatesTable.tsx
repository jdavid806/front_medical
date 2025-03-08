import React from "react";
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../components/CustomDataTable.js";
import { useAllTableEstimates } from "./hooks/useAllTableEstimates.js";
import { EstimatesTableActions } from "./estimatesTableActions.js";
import { UserDto } from "../models/models.js";

const estimatesTable = () => {
  const { estimates } = useAllTableEstimates();

  const columns: ConfigColumns[] = [
    { data: "Número" },
    { data: "Fecha de presupuesto" },
    { data: "Fecha vencimiento" },
    { data: "Total" },
    { data: "Monto pagado" },
    { data: "Monto faltante" },
    { data: "Cantidad" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    5: (cell, data: UserDto) => <EstimatesTableActions></EstimatesTableActions>,
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable data={estimates} slots={slots} columns={columns}>
            <thead>
              <tr>
                <th className="border-top custom-th">Número</th>
                <th className="border-top custom-th">Fecha de prespuesto</th>
                <th className="border-top custom-th">Fecha de vencimiento</th>
                <th className="border-top custom-th">Total</th>
                <th className="border-top custom-th">Monto pagado</th>
                <th className="border-top custom-th">Monto faltante</th>
                <th className="border-top custom-th">Cantidad</th>
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

export default estimatesTable;
