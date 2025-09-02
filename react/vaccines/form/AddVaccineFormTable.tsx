import React, { forwardRef } from "react";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AddVaccineFormTableProps } from "../interfaces";

export const AddVaccineFormTable = forwardRef((props: AddVaccineFormTableProps, ref) => {

    const { vaccinesFromInventory, onRemove, updateVaccine } = props;

    const columns: CustomPRTableColumnProps[] = [
        {
            field: "name",
            header: "Nombre",
            width: "200px",
            body: (rowData: any) => rowData.name
        },
        {
            field: "dose",
            header: "Dosis",
            width: "200px",
            body: (rowData: any) => (<>
                <InputNumber
                    value={rowData.dose}
                    onChange={(e) => updateVaccine(
                        vaccinesFromInventory.indexOf(rowData),
                        { ...rowData, dose: e.value },
                        "dose",
                        e.value
                    )}
                    mode="decimal"
                    showButtons
                    incrementButtonClassName="btn-primary"
                    decrementButtonClassName="btn-primary"
                    incrementButtonIcon={<i className="fa fa-plus" />}
                    decrementButtonIcon={<i className="fa fa-minus" />}
                    inputMode="numeric"
                    min={1}
                    max={999}
                    className="w-100"
                    inputClassName="w-100"
                    placeholder="Ej: 1"
                />
            </>)
        },
        {
            field: "scheme",
            header: "Esquema",
            width: "200px",
            body: (rowData: any) => (<>
                <InputText
                    value={rowData.scheme}
                    onChange={(e) => updateVaccine(
                        vaccinesFromInventory.indexOf(rowData),
                        { ...rowData, scheme: e.target.value },
                        "scheme",
                        e.target.value
                    )}
                    className="w-100"
                    placeholder="Ej: 0-6 meses"
                />
            </>)
        },
        {
            field: "booster",
            header: "Refuerzo",
            width: "200px",
            body: (rowData: any) => (<>
                <InputText
                    value={rowData.booster}
                    onChange={(e) => updateVaccine(
                        vaccinesFromInventory.indexOf(rowData),
                        { ...rowData, booster: e.target.value },
                        "booster",
                        e.target.value
                    )}
                    className="w-100"
                    placeholder="Ej: Anual"
                />
            </>)
        },
        {
            field: "actions",
            header: "Acciones",
            body: (rowData: any) => (
                <div className="d-flex align-items-center justify-content-center">
                    <Button
                        icon={<i className="fa fa-trash" />}
                        rounded
                        text
                        severity="danger"
                        onClick={() => onRemove({ data: rowData, index: vaccinesFromInventory.indexOf(rowData) })}
                    />
                </div>
            )
        },
    ];

    return (
        <div>
            <CustomPRTable
                data={vaccinesFromInventory}
                disableReload
                disableSearch
                columns={columns}
            />
        </div>
    );
});