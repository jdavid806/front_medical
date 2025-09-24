import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { SuppliesDeliveryFormProps, SuppliesDeliveryFormInputs, SuppliesDeliveryFormData } from "./interfaces";
import { Dropdown } from "primereact/dropdown";
import { useProductsByType } from "../../products/hooks/useProductsByType";
import { CustomPRTable } from "../../components/CustomPRTable";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { getJWTPayload } from "../../../services/utilidades";

export const SuppliesDeliveryForm = (props: SuppliesDeliveryFormProps) => {

    const { formId, onSubmit } = props;
    const { control, handleSubmit, setValue } = useForm<SuppliesDeliveryFormInputs>({
        defaultValues: {
            supply: null,
            supplies: [],
            observations: ""
        }
    });

    const { fields, append: addSupply, remove: removeSupply, update: updateSupply } = useFieldArray({
        control,
        name: "supplies"
    });

    const supply = useWatch({
        control,
        name: "supply"
    });

    const formSupplies = useWatch({
        control,
        name: "supplies"
    });

    const { productsByType: supplies, fetchProductsByType } = useProductsByType();

    const getFormData = (formValues: SuppliesDeliveryFormInputs): SuppliesDeliveryFormData => {
        return {
            products: formValues.supplies.map((supply) => ({
                product_id: supply.id,
                quantity: supply.quantity,
            })),
            status: "pendiente",
            delivery_date: null,
            observations: formValues.observations,
            requested_by: getJWTPayload().sub
        }
    }

    const onSubmitForm = (data: SuppliesDeliveryFormInputs) => {
        onSubmit(getFormData(data));
    };

    useEffect(() => {
        fetchProductsByType("Insumos");
    }, []);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmitForm)}>
            <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-2">
                    <Controller
                        name="supply"
                        control={control}
                        render={({ field }) => (
                            <>
                                <label className="form-label" htmlFor="supply">Insumo</label>
                                <Dropdown
                                    id="supply"
                                    placeholder="Seleccionar insumo"
                                    className="w-100"
                                    showClear
                                    filter
                                    optionLabel="name"
                                    value={field.value}
                                    options={supplies}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            </>
                        )}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        label="Agregar"
                        icon={<i className="fas fa-plus"></i>}
                        onClick={() => {
                            if (supply) {
                                addSupply({
                                    id: supply.id,
                                    name: supply.name,
                                    quantity: 1
                                });
                                setValue("supply", null);
                            }
                        }}
                        className="btn btn-primary"
                        type="button"
                    />
                </div>
                <CustomPRTable
                    columns={[
                        { field: 'name', header: 'Nombre' },
                        {
                            field: 'quantity', header: 'Cantidad', body: (data: any) => <>
                                <InputNumber
                                    value={data.quantity}
                                    onChange={(e) => {
                                        updateSupply(formSupplies.indexOf(data), { ...data, quantity: e.value });
                                    }}
                                    className="w-100"
                                    inputClassName="w-100"
                                    useGrouping={false}
                                    placeholder="Cantidad"
                                />
                            </>
                        },
                        {
                            field: 'actions', header: 'Acciones', body: (data: any) => (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button
                                        icon={<i className="fas fa-trash"></i>}
                                        onClick={() => removeSupply(formSupplies.indexOf(data))}
                                        className="p-button-danger p-button-text"
                                    />
                                </div>
                            )
                        }
                    ]}
                    data={formSupplies}
                    disablePaginator
                    disableReload
                    disableSearch
                />
                <div className="d-flex flex-column gap-2">
                    <Controller
                        name="observations"
                        control={control}
                        render={({ field }) => (
                            <>
                                <label className="form-label" htmlFor="observations">Observaciones</label>
                                <InputTextarea
                                    id="observations"
                                    placeholder="Observaciones"
                                    className="w-100"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    autoResize
                                    rows={3}
                                    cols={30}
                                />
                            </>
                        )}
                    />
                </div>
            </div>
        </form>
    );
};