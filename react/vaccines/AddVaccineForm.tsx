import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useVaccines } from "./hooks/useVaccines";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { InputNumber } from "primereact/inputnumber";
import { AddVaccineFormInputs, AddVaccineFormProps, RemoveVaccineEvent, AddVaccineFormTableProps } from "./interfaces";

export const AddVaccineForm = forwardRef((props: AddVaccineFormProps, ref) => {

    const { initialData } = props;

    const {
        control,
        resetField,
    } = useForm<AddVaccineFormInputs>({
        defaultValues: initialData || {
            fromInventory: false,
            vaccinesFromInventory: [],
            vaccineFromInventory: null,
            vaccineName: null,
        },
    });

    const { append: appendVaccine, remove: removeVaccine, update: updateVaccine } = useFieldArray({
        control,
        name: "vaccinesFromInventory"
    });

    const { vaccines } = useVaccines();

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return {
                fromInventory,
                vaccineFromInventory,
                vaccinesFromInventory,
                vaccineName,
            }
        },
    }));

    const fromInventory = useWatch({
        control,
        name: "fromInventory",
    });

    const vaccineFromInventory = useWatch({
        control,
        name: "vaccineFromInventory",
    });

    const vaccinesFromInventory = useWatch({
        control,
        name: "vaccinesFromInventory",
    });

    const vaccineName = useWatch({
        control,
        name: "vaccineName",
    });

    const handleRemoveVaccine = (event: RemoveVaccineEvent) => {
        removeVaccine(event.index);
    };

    const handleUpdateVaccine = (index: number, data: any) => {
        updateVaccine(index, data);
    };

    return (
        <div>
            <div className="mb-3">
                <Controller
                    name="fromInventory"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="d-flex align-items-center gap-2">
                            <InputSwitch
                                checked={field.value}
                                id="fromInventory"
                                name="fromInventory"
                                onChange={(e) => field.onChange(e.value)}
                            />
                            <label htmlFor="fromInventory">Traer vacunas desde el inventario</label>
                        </div>
                    )}
                />
            </div>

            <div className="d-flex gap-2">
                <div className="d-flex flex-grow-1">
                    {fromInventory && (
                        <div className="mb-3 w-100">
                            <Controller
                                name="vaccineFromInventory"
                                control={control}
                                render={({ field }) => (
                                    <div className="w-100 d-flex flex-column gap-2">
                                        <label htmlFor="vaccineFromInventory" className="form-label">Vacuna</label>
                                        <Dropdown
                                            options={vaccines}
                                            optionLabel="label"
                                            className="w-100"
                                            inputId="vaccineFromInventory"
                                            placeholder="Seleccione una vacuna"
                                            filter
                                            showClear
                                            emptyMessage="No se encontraron vacunas"
                                            {...field}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    )}
                    {!fromInventory && (
                        <div className="mb-3 w-100">
                            <Controller
                                name="vaccineName"
                                control={control}
                                render={({ field }) => (
                                    <div className="w-100 d-flex flex-column gap-2">
                                        <label htmlFor="vaccineName" className="form-label">Nombre de la vacuna</label>
                                        <InputText
                                            id="vaccineName"
                                            {...field}
                                            className="w-100"
                                            placeholder="Nombre de la vacuna"
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </div>
                <div className="d-flex align-items-center">
                    <Button
                        label="Agregar"
                        icon={<i className="fa fa-plus" />}
                        disabled={(fromInventory && !vaccineFromInventory) || (!fromInventory && !vaccineName)}
                        onClick={() => {
                            if (fromInventory) {
                                console.log(vaccineFromInventory);
                                appendVaccine({
                                    uuid: Math.random().toString(36).substring(7),
                                    name: vaccineFromInventory.label,
                                    dose: 1,
                                    scheme: "",
                                    booster: ""
                                });
                            } else if (vaccineName) {
                                appendVaccine({
                                    uuid: Math.random().toString(36).substring(7),
                                    name: vaccineName,
                                    dose: 1,
                                    scheme: "",
                                    booster: ""
                                });
                            }
                            resetField("vaccineFromInventory");
                            resetField("vaccineName");
                        }}
                    />
                </div>
            </div>

            <AddVaccineFormTable
                vaccinesFromInventory={vaccinesFromInventory}
                onRemove={handleRemoveVaccine}
                updateVaccine={handleUpdateVaccine}
            />
        </div>
    );
});

export const AddVaccineFormTable = forwardRef((props: AddVaccineFormTableProps, ref) => {

    const { vaccinesFromInventory, onRemove, updateVaccine } = props;

    const columns: CustomPRTableColumnProps[] = [
        { field: "name", header: "Nombre", width: "200px" },
        {
            field: "dose", header: "Dosis", width: "200px", body: (rowData: any) => (<>
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
                    min={0}
                    max={999}
                    className="w-100"
                    inputClassName="w-100"
                />
            </>)
        },
        {
            field: "scheme", header: "Esquema", width: "200px", body: (rowData: any) => (<>
                <InputText
                    value={rowData.scheme}
                    onChange={(e) => updateVaccine(
                        vaccinesFromInventory.indexOf(rowData),
                        { ...rowData, scheme: e.target.value },
                        "scheme",
                        e.target.value
                    )}
                    className="w-100"
                />
            </>)
        },
        {
            field: "booster", header: "Refuerzo", width: "200px", body: (rowData: any) => (<>
                <InputText
                    value={rowData.booster}
                    onChange={(e) => updateVaccine(
                        vaccinesFromInventory.indexOf(rowData),
                        { ...rowData, booster: e.target.value },
                        "booster",
                        e.target.value
                    )}
                    className="w-100"
                />
            </>)
        },
        {
            field: "actions", header: "Acciones", body: (rowData: any) => (
                <Button
                    icon={<i className="fa fa-trash" />}
                    rounded
                    text
                    severity="danger"
                    onClick={() => onRemove({ data: rowData, index: vaccinesFromInventory.indexOf(rowData) })}
                />
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
