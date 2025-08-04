import React, { useState, useEffect } from "react";
import { Controller, set, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  examTypeService,
  entitiesService,
  taxesService,
  retentionsService,
} from "../../../../services/api";

type EntityRow = {
  entity_name: { name: string };
  entity_id: { id: number };
  price: number;
  tax_name?: { name: string };
  tax_id?: { id: number };
  retention_id?: { id: number };
  retention_name?: { name: string };
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
};

interface ProductFormProps {
  formId: string;
  onHandleSubmit: (data: ProductFormInputs) => void;
  initialData?: ProductFormInputs;
}

const PricesConfigForm: React.FC<ProductFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const [showExamType, setShowExamType] = useState(false);
  const [showLabFields, setShowLabFields] = useState(false);
  const [showEntities, setShowEntities] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const [entityRows, setEntityRows] = useState<EntityRow[]>([]);
  const [currentEntity, setCurrentEntity] = useState<
    Omit<EntityRow, "price"> & { price: number | null }
  >({
    entity_id: { id: 0 },
    entity_name: { name: ""  },
    price: null,
    tax_name: { name: "" },
    tax_id: { id: 0 },
    retention_name: { name: "" },
    retention_id: { id: 0 },
  });
  const [examTypesData, setExamTypesData] = useState<any[]>([]);
  const [entitiesData, setEntitiesData] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [retentions, setRetentions] = useState<any[]>([]);

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
    },
  });

  const attentionType = watch("attention_type");
  const toggleEntities = watch("toggleEntities");
  const toggleImpuesto = watch("toggleImpuesto");

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
    loadEntities();
    loadTaxes();
    loadRetentions();
  }, []);

  const onSubmit: SubmitHandler<ProductFormInputs> = (data) => {
    console.log("data: ", data);
    console.log("entityRows: ", entityRows);
    const submitData: ProductFormInputs = {
      ...data,
      entities: entityRows,
    };

    if (data.attention_type === "LABORATORY") {
      submitData.sale_price = 0;
      submitData.copago = 0;
    }

    // onHandleSubmit(submitData);
  };

  const getFormErrorMessage = (name: keyof ProductFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const attentionTypes = [
    { label: "Seleccionar...", value: "" },
    { label: "Procedimiento", value: "PROCEDURE" },
    { label: "Consulta", value: "CONSULTATION" },
    { label: "Laboratorio", value: "LABORATORY" },
    { label: "Rehabilitación", value: "REHABILITATION" },
    { label: "Optometría", value: "OPTOMETRY" },
  ];

  async function loadExamTypes() {
    const exmaTypes = await examTypeService.getAll();
    setExamTypesData(exmaTypes);
  }

  async function loadEntities() {
    const entities = await entitiesService.getEntities();
    setEntitiesData(entities.data);
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
    value: string | number | null
  ) => {
    setCurrentEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEntityRow = () => {
    if (currentEntity.entity_id && currentEntity.price !== null) {
      console.log("currentEntity: ", currentEntity);
      // const newRow: any = {
      //   entity_id: currentEntity.entity_id.id,
      //   price: currentEntity.price,
      //   tax_type: currentEntity?.tax_type?.name || undefined,
      //   retention_type: currentEntity.retention_type?.name || undefined,
      // };

      // setEntityRows([...entityRows, newRow]);

      // // Reset current entity
      // setCurrentEntity({
      //   entity_id: { name: "" },
      //   price: null,
      //   tax_type: { name: "" },
      //   retention_type: { name: "" },
      // });
    }
  };

  const confirmDelete = (rowIndex: number) => {
    confirmDialog({
      message: "¿Estás seguro de eliminar esta entidad?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => {
        const newRows = [...entityRows];
        newRows.splice(rowIndex, 1);
        setEntityRows(newRows);
      },
    });
  };

  const actionBodyTemplate = (
    rowData: any,
    { rowIndex }: { rowIndex: number }
  ) => {
    return (
      <Button
        type="button"
        className="p-button-danger p-button-sm"
        onClick={(e) => {
          e.preventDefault, confirmDelete(rowIndex);
        }}
      >
        <i className="fa-solid fa-trash"></i>
      </Button>
    );
  };

  const priceBodyTemplate = (rowData: EntityRow) => {
    return `$${rowData.price.toFixed(2)}`;
  };

  const entityBodyTemplate = (rowData: EntityRow) => {
    return (
      entitiesData.find((e) => e.value === rowData.entity_id)?.label ||
      rowData.entity_id
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Datos de producto</h5>

          <input type="hidden" {...register("product_id")} />

          <div className="mb-3">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Este campo es requerido" }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="form-label">
                    Nombre del item *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames("w-100", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder="Nombre del item"
                    {...field}
                  />
                  {getFormErrorMessage("name")}
                </>
              )}
            />
          </div>

          <div className="mb-3">
            <Controller
              name="curp"
              control={control}
              rules={{ required: "Este campo es requerido" }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="form-label">
                    Código Cups *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames("w-100", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder="Código Cups"
                    {...field}
                  />
                  {getFormErrorMessage("curp")}
                </>
              )}
            />
          </div>

          <div className="mb-3">
            <Controller
              name="attention_type"
              control={control}
              rules={{ required: "Este campo es requerido" }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name} className="form-label">
                    Tipo de atención *
                  </label>
                  <Dropdown
                    id={field.name}
                    options={attentionTypes}
                    className={classNames("w-100", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder="Seleccionar..."
                    {...field}
                  />
                  {getFormErrorMessage("attention_type")}
                </>
              )}
            />
          </div>

          {showExamType && (
            <div className="mb-3">
              <Controller
                name="exam_type_id"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Examen
                    </label>
                    <Dropdown
                      id={field.name}
                      options={examTypesData}
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      optionLabel="name"
                      placeholder="Seleccionar..."
                      filter
                      appendTo={"self"}
                      {...field}
                    />
                  </>
                )}
              />
            </div>
          )}

          {showLabFields && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <Controller
                    name="sale_price"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Precio público
                        </label>
                        <InputNumber
                          inputId={field.name}
                          mode="currency"
                          currency="USD"
                          locale="en-US"
                          className={classNames("w-100", {
                            "p-invalid": fieldState.error,
                          })}
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          placeholder="Precio público"
                        />
                      </>
                    )}
                  />
                </div>
                <div className="col-md-6">
                  <Controller
                    name="copago"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Precio Copago
                        </label>
                        <InputNumber
                          inputId={field.name}
                          mode="currency"
                          currency="USD"
                          locale="en-US"
                          className={classNames("w-100", {
                            "p-invalid": fieldState.error,
                          })}
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          placeholder="Precio Copago"
                        />
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="mb-3">
                <Controller
                  name="purchase_price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Costo
                      </label>
                      <InputNumber
                        inputId={field.name}
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        className={classNames("w-100", {
                          "p-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        placeholder="Costo"
                      />
                    </>
                  )}
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <Controller
                    name="toggleEntities"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="toggleEntities"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="toggleEntities"
                        >
                          Agregar entidades
                        </label>
                      </div>
                    )}
                  />
                </div>
                <div className="col-md-6">
                  <Controller
                    name="toggleImpuesto"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="toggleImpuesto"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="toggleImpuesto"
                        >
                          Agregar Impuesto
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {showTax && (
            <div className="mb-3">
              <Controller
                name="taxProduct_type"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Tipo de impuesto
                    </label>
                    <Dropdown
                      id={field.name}
                      options={taxes}
                      optionLabel="name"
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder="Seleccionar..."
                      {...field}
                      filter
                      appendTo={"self"}
                    />
                  </>
                )}
              />
            </div>
          )}

          {showEntities && (
            <div className="mb-3">
              <div className="card p-3 mt-3">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Entidad</label>
                    <Dropdown
                      options={entitiesData}
                      placeholder="Seleccionar..."
                      className="w-100"
                      optionLabel="name"
                      value={currentEntity.entity_id}
                      onChange={(e) => handleEntityChange("entity_id", e.value)}
                      filter
                      appendTo={"self"}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Precio</label>
                    <InputNumber
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                      placeholder="Precio"
                      className="w-100"
                      value={currentEntity.price}
                      onValueChange={(e) =>
                        handleEntityChange("price", e.value ?? 0)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Tipo de impuesto</label>
                    <Dropdown
                      options={taxes}
                      placeholder="Seleccionar..."
                      className="w-100"
                      optionLabel="name"
                      value={currentEntity.tax_id}
                      onChange={(e) => handleEntityChange("tax_id", e.value)}
                      filter
                      appendTo={"self"}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Tipo de retención</label>
                    <Dropdown
                      options={retentions}
                      placeholder="Seleccionar..."
                      className="w-100"
                      optionLabel="name"
                      value={currentEntity.retention_id}
                      onChange={(e) =>
                        handleEntityChange("retention_id", e.value)
                      }
                      filter
                      appendTo={"self"}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <Button
                      type="button"
                      label="Agregar"
                      icon="pi pi-plus"
                      onClick={addEntityRow}
                    />
                  </div>
                </div>
              </div>

              {entityRows.length > 0 && (
                <div className="card p-3 mt-3">
                  <DataTable
                    value={entityRows}
                    stripedRows
                    showGridlines
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                    emptyMessage="No hay entidades agregadas"
                  >
                    <Column
                      field="entity_id"
                      header="Entidad"
                      body={entityBodyTemplate}
                      sortable
                    ></Column>
                    <Column
                      field="price"
                      header="Precio"
                      body={priceBodyTemplate}
                      sortable
                    ></Column>
                    <Column
                      field="tax_type"
                      header="Tipo Impuesto"
                      body={(rowData) => rowData.tax_type || "-"}
                      sortable
                    ></Column>
                    <Column
                      field="retention_type"
                      header="Tipo Retención"
                      body={(rowData) => rowData.retention_type || "-"}
                      sortable
                    ></Column>
                    <Column
                      header="Acciones"
                      body={actionBodyTemplate}
                      style={{ width: "100px" }}
                    ></Column>
                  </DataTable>
                </div>
              )}
              <ConfirmDialog />
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              label="Cancelar"
              className="p-button-outlined"
            />
            <Button type="submit" label="Guardar" icon="pi pi-save" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PricesConfigForm;
