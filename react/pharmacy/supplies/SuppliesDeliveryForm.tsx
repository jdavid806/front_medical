import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { SuppliesDeliveryFormProps, SuppliesDeliveryFormInputs, SuppliesDeliveryFormData } from "./interfaces";
import { Dropdown } from "primereact/dropdown";
import { useProductsByType } from "../../products/hooks/useProductsByType";
import { CustomPRTable } from "../../components/CustomPRTable";
import { Button } from "primereact/button";

export const SuppliesDeliveryForm = (props: SuppliesDeliveryFormProps) => {

    const { formId, onSubmit } = props;
    const { control, handleSubmit } = useForm<SuppliesDeliveryFormInputs>({
        defaultValues: {
            quantity: 0,
            supply: null,
            supplies: []
        }
    });

    const { fields, append: addSupply, remove: removeSupply } = useFieldArray({
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
            quantity: formValues.quantity,
            supply: formValues.supply,
            supplies: formValues.supplies
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
                <div className="d-flex flex-column gap-2">
                    <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                            <>
                                <label className="form-label" htmlFor="quantity">Cantidad</label>
                                <InputNumber
                                    inputId="quantity"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) => field.onChange(e.value)}
                                    onValueChange={(e) => field.onChange(e.value)}
                                    useGrouping={false}
                                    placeholder="Cantidad"
                                    className="w-100"
                                    inputClassName="w-100"
                                />
                            </>
                        )}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        label="Agregar"
                        icon={<i className="fas fa-plus"></i>}
                        onClick={() => addSupply(supply)}
                        className="btn btn-outline-primary"
                    />
                </div>
                <CustomPRTable
                    columns={[
                        { field: 'name', header: 'Nombre' },
                        { field: 'quantity', header: 'Cantidad' },
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
                />
            </div>
        </form>
    );
};