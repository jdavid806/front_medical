import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import {
    examTypeService,
    entitiesService,
    taxesService,
    retentionsService,
} from "../../../../services/api";
import { CustomFormModal } from "../../../components/CustomFormModal";
import { Dialog } from "primereact/dialog";
import { ExamConfigFormModal } from "../../../exams-config/components/ExamConfigFormModal";
import { ExamTypeInputs } from "../../../exams-config/components/ExamConfigForm";
import { CustomPRTable } from "../../../components/CustomPRTable";
import { useProductsByType } from "../../../products/hooks/useProductsByType";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";


type EntityRow = {
    entity_id: string | number;
    entity_name?: string;
    price: number;
    tax_charge_id?: string | number;
    tax_name?: string;
    withholding_tax_id?: string | number;
    negotation_type?: string;
    retention_name?: string;
};

export type ProductFormInputs = {
    product_id?: string;
    name: string;
    curp: string;
    attention_type: string;
    exam_type_id?: string;
    sale_price: number;
    copago: number;
    purchase_price: number;
    taxProduct_type?: string;
    toggleEntities?: boolean;
    toggleImpuesto?: boolean;
    entities?: EntityRow[];
    toggleIA?: boolean;
    toggleInsumos?: boolean;
    supplies: any[];
};

interface ProductFormProps {
    formId: string;
    onHandleSubmit: (data: ProductFormInputs) => void;
    initialData?: ProductFormInputs;
    onCancel?: () => void;
    entitiesData: any[];
}

const PricesConfigForm: React.FC<ProductFormProps> = ({
    formId,
    onHandleSubmit,
    initialData,
    onCancel,
    entitiesData,
}) => {
    const [showExamType, setShowExamType] = useState(false);
    const [showLabFields, setShowLabFields] = useState(true);
    const [showEntities, setShowEntities] = useState(false);
    const [showTax, setShowTax] = useState(false);
    const [entityRows, setEntityRows] = useState<EntityRow[]>([]);
    const [currentEntity, setCurrentEntity] = useState({
        entity_id: '',
        entity_name: '',
        price: 0,
        tax_charge_id: '',
        tax_name: '',
        withholding_tax_id: '',
        retention_name: '',
        negotation_type: ''
    });
    const [examTypesData, setExamTypesData] = useState<any[]>([]);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [retentions, setRetentions] = useState<any[]>([]);

    // Estado para controlar la visibilidad del modal de exámenes
    const [showExamModal, setShowExamModal] = useState(false);
    const [supply, setSupply] = useState<any | null>(null);

    const { accounts } = useAccountingAccounts();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm<ProductFormInputs>({
        defaultValues: initialData || {
            name: "",
            curp: "",
            attention_type: "",
            exam_type_id: "",
            sale_price: 0,
            copago: 0,
            purchase_price: 0,
            taxProduct_type: "",
            toggleEntities: false,
            toggleImpuesto: false,
            toggleIA: false,
            toggleInsumos: false,
        },
    });


    const { fields, append: addSupply, remove: removeSupply, update: updateSupply } = useFieldArray({
        control,
        name: "supplies"
    });

    const attentionType = watch("attention_type");
    const toggleEntities = watch("toggleEntities");
    const toggleImpuesto = watch("toggleImpuesto");
    const toggleIA = watch("toggleIA");
    const toggleInsumos = watch("toggleInsumos");
    const formSupplies = useWatch({
        control,
        name: "supplies"
    });


    const { productsByType: supplies, fetchProductsByType } = useProductsByType();

    useEffect(() => {
        if (attentionType === "PROCEDURE") {
            setShowExamType(true);
        } else {
            setShowExamType(false);
            setValue("exam_type_id", "");
        }

        if (attentionType === "LABORATORY") {
            setShowLabFields(false);
        } else {
            setShowLabFields(true);
        }
    }, [attentionType, setValue]);

    useEffect(() => {
        setShowEntities(toggleEntities || false);
    }, [toggleEntities]);

    useEffect(() => {
        setShowTax(toggleImpuesto || false);
    }, [toggleImpuesto]);

    useEffect(() => {
        loadExamTypes();
        loadTaxes();
        loadRetentions();
        fetchProductsByType("Insumos");
    }, []);

    useEffect(() => {
        if (initialData) {
            // Establecer product_id si existe para la actualización
            if (initialData.product_id) {
                setValue('product_id', initialData.product_id);
            }

            setValue('name', initialData.name);
            setValue('curp', initialData.curp);
            setValue('attention_type', initialData.attention_type);
            setValue('sale_price', initialData.sale_price);
            setValue('copago', initialData.copago);
            setValue('purchase_price', initialData.purchase_price);
            setValue('exam_type_id', initialData.exam_type_id || '');
            setValue('taxProduct_type', initialData.taxProduct_type || '');

            // Load entities if they exist
            if (initialData.entities && initialData.entities.length > 0) {
                setEntityRows([...initialData.entities]); // Crear nueva copia para forzar re-render
                setValue('toggleEntities', true);
                setShowEntities(true);
            } else {
                setEntityRows([]);
                setValue('toggleEntities', false);
                setShowEntities(false);
            }

            if (initialData.taxProduct_type && initialData.taxProduct_type !== '0') {
                setValue('toggleImpuesto', true);
                setShowTax(true);
            } else {
                setValue('toggleImpuesto', false);
                setShowTax(false);
            }
        } else {
            // Reset form cuando no hay initialData
            setEntityRows([]);
            setShowEntities(false);
            setShowTax(false);
            setValue('toggleEntities', false);
            setValue('toggleImpuesto', false);
        }
    }, [initialData, setValue]);

    const onSubmit: SubmitHandler<ProductFormInputs> = (data) => {
        const submitData: ProductFormInputs = {
            ...data,
            entities: entityRows,
        };

        if (data.attention_type === "LABORATORY") {
            submitData.sale_price = 0;
            submitData.copago = 0;
            submitData.purchase_price = 0;
        }

        onHandleSubmit(submitData);
    };

    const regimeOptions = [
        { label: "Subsidiado", value: "subsidiado" },
        { label: "Contributivo", value: "contributivo" },
        { label: "Pensionado", value: "pensionado" },
        { label: "Privado", value: "privado" },
    ];
    const handleExamSubmit = (data: ExamTypeInputs) => {

        handleCloseExamModal();
        loadExamTypes();
    };

    const getFormErrorMessage = (name: keyof ProductFormInputs) => {
        return (
            errors[name] && <small className="text-danger">{errors[name]?.message}</small>
        );
    };

    async function loadExamTypes() {
        const exmaTypes = await examTypeService.getAll();
        setExamTypesData(exmaTypes);
    }

    async function loadTaxes() {
        const taxes = await taxesService.getTaxes();
        setTaxes(taxes.data);
    }

    async function loadRetentions() {
        const retentions = await retentionsService.getRetentions();
        setRetentions(retentions.data);
    }

    const handleEntityChange = (
        field: keyof typeof currentEntity,
        value: any
    ) => {
        if (field === 'entity_id') {
            const selectedEntity = value ? entitiesData.find(e => e.id == value) : null;
            setCurrentEntity((prev) => ({
                ...prev,
                entity_id: value,
                entity_name: selectedEntity ? selectedEntity.name : ''
            }));
        } else if (field === 'tax_charge_id') {
            const selectedTax = value ? taxes.find(t => t.id == value) : null;
            setCurrentEntity((prev) => ({
                ...prev,
                tax_charge_id: value,
                tax_name: selectedTax ? selectedTax.name : ''
            }));
        } else if (field === 'withholding_tax_id') {
            const selectedRetention = value ? retentions.find(r => r.id == value) : null;
            setCurrentEntity((prev) => ({
                ...prev,
                withholding_tax_id: value,
                retention_name: selectedRetention ? selectedRetention.name : ''
            }));
        } else {
            setCurrentEntity((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const addEntityRow = () => {
        if (currentEntity.entity_id && currentEntity.price > 0) {
            const newRow: EntityRow = {
                entity_id: currentEntity.entity_id,
                entity_name: currentEntity.entity_name,
                price: currentEntity.price,
                tax_charge_id: currentEntity.tax_charge_id || '',
                tax_name: currentEntity.tax_name || 'N/A',
                withholding_tax_id: currentEntity.withholding_tax_id || '',
                negotation_type: currentEntity.negotation_type || '',
                retention_name: currentEntity.retention_name || 'N/A',
            };

            setEntityRows([...entityRows, newRow]);

            // Reset current entity
            setCurrentEntity({
                entity_id: '',
                entity_name: '',
                price: 0,
                tax_charge_id: '',
                tax_name: '',
                withholding_tax_id: '',
                retention_name: '',
                negotation_type: ''
            });
        }
    };

    const removeEntityRow = (rowIndex: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta entidad?')) {
            const newRows = [...entityRows];
            newRows.splice(rowIndex, 1);
            setEntityRows(newRows);
        }
    };

    // Función para abrir el modal de exámenes
    const handleOpenExamModal = () => {
        setShowExamModal(true);
    };

    // Función para cerrar el modal de exámenes
    const handleCloseExamModal = () => {
        setShowExamModal(false);
    };

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Datos de producto</h5>
                <form className="row g-3" id={formId} onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register("product_id")} />

                    <div className="col-12">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field, fieldState }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Nombre del item
                                    </label>
                                    <InputText
                                        className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                                        id={field.name}
                                        placeholder="Nombre del item"
                                        {...field}
                                    />
                                    {getFormErrorMessage("name")}
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-6">
                        <Controller
                            name="curp"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field, fieldState }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Cups
                                    </label>
                                    <InputText
                                        className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                                        id={field.name}
                                        placeholder="Código Cups"
                                        {...field}
                                    />
                                    {getFormErrorMessage("curp")}
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-6">
                        <Controller
                            name="attention_type"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field, fieldState }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Tipo de atención
                                    </label>
                                    <Dropdown
                                        className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        options={[
                                            { label: "Procedimiento", value: "PROCEDURE" },
                                            { label: "Consulta", value: "CONSULTATION" },
                                            { label: "Laboratorio", value: "LABORATORY" },
                                            { label: "Rehabilitación", value: "REHABILITATION" },
                                            { label: "Optometría", value: "OPTOMETRY" }
                                        ]}
                                        placeholder="Seleccionar..."
                                    />
                                    {getFormErrorMessage("attention_type")}
                                </div>
                            )}
                        />
                    </div>

                    {showExamType && (
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-3">
                                <Controller
                                    name="exam_type_id"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-grow-1 me-2">
                                            <label className="form-label" htmlFor={field.name}>
                                                Examen
                                            </label>
                                            <Dropdown
                                                className="w-100"
                                                id={field.name}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={examTypesData.map((exam) => ({
                                                    label: exam.name,
                                                    value: exam.id
                                                }))}
                                                placeholder="Seleccionar..."
                                            />
                                        </div>
                                    )}
                                />
                                <div className="pt-4">
                                    <Button
                                        type="button"
                                        icon={<i className="fas fa-plus"></i>}
                                        className="p-button-primary"
                                        onClick={handleOpenExamModal}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-md-6" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="sale_price"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Precio público
                                    </label>
                                    <InputNumber
                                        className="w-100"
                                        id={field.name}
                                        placeholder="Precio público"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-6" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="copago"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Precio Copago
                                    </label>
                                    <InputNumber
                                        className="w-100"
                                        id={field.name}
                                        placeholder="Precio Copago"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-12" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="purchase_price"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor={field.name}>
                                        Costo
                                    </label>
                                    <InputNumber
                                        className="w-100"
                                        id={field.name}
                                        placeholder="Costo"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-3" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="toggleEntities"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label d-block" htmlFor="toggleEntities">
                                        Agregar entidades
                                    </label>
                                    <InputSwitch
                                        inputId="toggleEntities"
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange(e.value)}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-3" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="toggleImpuesto"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label d-block" htmlFor="toggleImpuesto">
                                        Agregar Impuesto
                                    </label>
                                    <InputSwitch
                                        inputId="toggleImpuesto"
                                        checked={field.value || false}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            if (!e.value) {
                                                setValue('taxProduct_type', '0');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-3" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="toggleInsumos"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label d-block" htmlFor="toggleInsumos">
                                        Agregar Insumos
                                    </label>
                                    <InputSwitch
                                        inputId="toggleInsumos"
                                        checked={field.value || false}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            if (!e.value) {
                                                setValue('taxProduct_type', '0');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="col-md-3" style={{ display: showLabFields ? 'block' : 'none' }}>
                        <Controller
                            name="toggleIA"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-3">
                                    <label className="form-label d-block" htmlFor="toggleIA">
                                        Puede agendar con IA
                                    </label>
                                    <InputSwitch
                                        inputId="toggleIA"
                                        checked={field.value || false}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            if (!e.value) {
                                                setValue('taxProduct_type', '0');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {toggleInsumos && (<>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex flex-column gap-2">
                                <label className="form-label" htmlFor="supply">Insumo</label>
                                <Dropdown
                                    id="supply"
                                    placeholder="Seleccionar insumo"
                                    className="w-100"
                                    showClear
                                    filter
                                    optionLabel="name"
                                    value={supply}
                                    options={supplies}
                                    onChange={(e) => setSupply(e.value)}
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
                                            setSupply(null);
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
                                        field: 'accounting_account_debit_id', header: 'Cuenta contable debita', body: (data: any) => <>
                                            <Dropdown
                                                value={data.accounting_account_debit_id}
                                                options={accounts}
                                                onChange={(e) => {
                                                    updateSupply(formSupplies.indexOf(data), { ...data, accounting_account_debit_id: e.value });
                                                }}
                                                optionLabel="account_name"
                                                optionValue="id"
                                                placeholder="Cuenta contable debita"
                                                appendTo={document.body}
                                                filter
                                                showClear
                                            />
                                        </>
                                    },
                                    {
                                        field: 'accounting_account_credit_id', header: 'Cuenta contable acredita', body: (data: any) => <>
                                            <Dropdown
                                                value={data.accounting_account_credit_id}
                                                options={accounts}
                                                onChange={(e) => {
                                                    updateSupply(formSupplies.indexOf(data), { ...data, accounting_account_credit_id: e.value });
                                                }}
                                                optionLabel="account_name"
                                                optionValue="id"
                                                placeholder="Cuenta contable acredita"
                                                appendTo={document.body}
                                                filter
                                                showClear
                                            />
                                        </>
                                    },
                                    {
                                        field: 'actions', header: 'Acciones', body: (data: any) => (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <Button
                                                    type="button"
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
                        </div>
                    </>)}

                    {showTax && (
                        <div className="col-12">
                            <Controller
                                name="taxProduct_type"
                                control={control}
                                render={({ field }) => (
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor={field.name}>
                                            Tipo de impuesto
                                        </label>
                                        <Dropdown
                                            className="w-100"
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={taxes.map((tax) => ({
                                                label: tax.name,
                                                value: tax.id
                                            }))}
                                            placeholder="Seleccionar..."
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {showEntities && (
                        <div className="col-12">
                            <div className="card p-3 mt-3">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Entidad
                                            </label>
                                            <Dropdown
                                                className="w-100"
                                                value={currentEntity.entity_id}
                                                onChange={(e) => handleEntityChange("entity_id", e.value)}
                                                options={entitiesData.map((entity) => ({
                                                    label: entity.name,
                                                    value: entity.id
                                                }))}
                                                placeholder="Seleccionar..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Precio
                                            </label>
                                            <InputNumber
                                                className="w-100"
                                                placeholder="Precio"
                                                value={currentEntity.price}
                                                onValueChange={(e) => handleEntityChange("price", e.value || 0)}
                                                mode="currency"
                                                currency="COP"
                                                locale="es-CO"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Tipo de impuesto
                                            </label>
                                            <Dropdown
                                                className="w-100"
                                                value={currentEntity.tax_charge_id}
                                                onChange={(e) => handleEntityChange("tax_charge_id", e.value)}
                                                options={taxes.map((tax) => ({
                                                    label: tax.name,
                                                    value: tax.id
                                                }))}
                                                placeholder="Seleccionar..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Tipo de retención
                                            </label>
                                            <Dropdown
                                                className="w-100"
                                                value={currentEntity.withholding_tax_id}
                                                onChange={(e) => handleEntityChange("withholding_tax_id", e.value)}
                                                options={retentions.map((retention) => ({
                                                    label: retention.name,
                                                    value: retention.id
                                                }))}
                                                placeholder="Seleccionar..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Tipo de negociación
                                            </label>
                                            <Dropdown
                                                className="w-100"
                                                value={currentEntity.negotation_type}
                                                onChange={(e) => handleEntityChange("negotation_type", e.value)}
                                                options={regimeOptions}
                                                placeholder="Seleccionar..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 text-end">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={addEntityRow}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {entityRows.length > 0 && (
                                <div className="card p-3 mt-3">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Entidad</th>
                                                <th>Precio</th>
                                                <th>Tipo Impuesto</th>
                                                <th>Tipo Retención</th>
                                                <th>Tipo negociación</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entityRows.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.entity_name}</td>
                                                    <td>{row.price}</td>
                                                    <td>{row.tax_name || 'N/A'}</td>
                                                    <td>{row.retention_name || 'N/A'}</td>
                                                    <td>{row.negotation_type || 'N/A'}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => removeEntityRow(index)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="col-12 text-end mt-4">
                        <button className="btn btn-primary me-2" type="submit">
                            Guardar
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>

                <Dialog
                    header="Crear Exámenes"
                    visible={showExamModal}
                    style={{ width: "90vw", maxWidth: "1000px", height: "80vh" }}
                    onHide={handleCloseExamModal}
                    modal
                >
                    <ExamConfigFormModal
                        show={showExamModal}
                        handleSubmit={handleExamSubmit}
                        onHide={handleCloseExamModal}
                        title="Crear Examen"
                    />
                </Dialog>
            </div>
        </div>
    );
};

export default PricesConfigForm;