import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm } from "react-hook-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import {
  entityService,
  productService,
  userService,
  patientService,
  costCenterService,
  billingService,
} from "../../../services/api/index.js";

import { getUserLogged } from "../../../services/utilidades.js";
import AlertManager from "../../../services/alertManager.js";
import { InputTextarea } from "primereact/inputtextarea";

export const BillingByEntity: React.FC = () => {
  const stepperRef = useRef<any>(null);
  const [entities, setEntities] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [billingData, setBillingData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    unitValue: 0,
    copayment: 0,
    total: 0,
  });
  const [dueDate, setDueDate] = useState<Date | null>(null); // Nuevo estado para fecha de vencimiento
  const [creditDays, setCreditDays] = useState<string>("");
  const [paymentMethodChecked, setPaymentMethodChecked] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [taxCharges, setTaxCharges] = useState<any[]>([]);
  const [taxWithholdings, setTaxWithholdings] = useState<any[]>([]);
  const regimeOptions = [
    { label: "Subsidiado", value: "Subsidiado" },
    { label: "Contributivo", value: "Contributivo" },
    { label: "Pensionado", value: "Pensionado" },
    { label: "Privado", value: "Privado" },
    { label: "Complementario", value: "Complementario" },
    { label: "Larimar", value: "Larimar" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      elaborationDate: null,
      invoiceType: null,
      entity: { id: 0 },
      costCenter: { id: 0 },
      procedure: [],
      specialist: [],
      patient: [],
      regime: [],
      dateRange: [],
      paymentMethod: "",
      observations: "",
      creditDays: "",
      dueDate: null,
      taxCharge: { id: 0 },
      taxWithholding: { id: 0 },
    },
  });

  const invoiceTypes = [
    { label: "Fiscal", value: "tax_invoice" },
    { label: "Gubernamental", value: "government_invoice" },
  ];

  useEffect(() => {
    loadEntities();
    loadProducts();
    loadUsers();
    loadPatients();
    loadCostCenters();
    loadPaymentMethods();
    loadTaxCharges();
    loadTaxChargesWithholging();
  }, []);

  async function loadEntities() {
    const dataEntities = await entityService.getAll();
    setEntities(dataEntities.data);
  }

  async function loadProducts() {
    const dataProducts = await productService.getAllProducts();
    setProducts(dataProducts.data);
  }

  async function loadUsers() {
    const dataUsers = await userService.getAllUsers();
    const usersMapped = dataUsers.map((user: any) => {
      return {
        ...user,
        full_name: `${user.first_name} ${user.middle_name} ${user.last_name} ${user.second_last_name}`,
      };
    });
    setUsers(usersMapped);
  }

  async function loadPatients() {
    const dataPatients = await patientService.getAll();
    const patientsMapped = dataPatients.map((patient: any) => {
      return {
        ...patient,
        full_name: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`,
      };
    });
    setPatients(patientsMapped);
  }

  async function loadCostCenters() {
    const dataCostCenters = await costCenterService.getCostCenterAll();
    setCostCenters(dataCostCenters.data);
  }

  async function loadPaymentMethods() {
    //@ts-ignore
    const urlPaymentMethos = obtenerRutaPrincipal() + "/api/v1/admin/payment-methods";
    //@ts-ignore
    let dataPaymentMethos = await obtenerDatos(urlPaymentMethos);
    setPaymentMethods(dataPaymentMethos);
  }

  async function loadTaxCharges() {
    //@ts-ignore
    const urltaxCharges = obtenerRutaPrincipal() + "/api/v1/admin/tax-charges";
    //@ts-ignore
    let dataTaxCharges = await obtenerDatos(urltaxCharges);
    setTaxCharges(dataTaxCharges.data);
  }

  async function loadTaxChargesWithholging() {
    //@ts-ignore
    const urltaxChargesWithholding = obtenerRutaPrincipal() + "/api/v1/admin/tax-withholdings";
    //@ts-ignore
    let dataTaxChargesWithholding = await obtenerDatos(
      urltaxChargesWithholding
    );
    setTaxWithholdings(dataTaxChargesWithholding.data);
  }

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : null;
  };

  const validateStep1 = async () => {
    const isValid = await trigger([
      "elaborationDate",
      "invoiceType",
      "entity",
      "dateRange",
    ]);

    if (isValid) {
      stepperRef.current.nextCallback();
      getFilters();
    }
  };

  async function getFilters() {
    const values = getValues();
    const paramsFilter = {
      start_date: new Date(dateRange[0]).toISOString().slice(0, 10),
      end_date: new Date(dateRange[1]).toISOString().slice(0, 10),
      patient_ids: values.patient.map((patient: any) => patient.id),
      affiliate_type: values.regime.map((item: any) => item),
      product_ids: values.procedure.map((procedure: any) => procedure.id),
      user_ids: values.specialist.map((specialist: any) => specialist.id),
      entity_id: values.entity?.id,
    };

    billingReport(paramsFilter);
  }

  async function billingReport(filters) {
    const dataBillingReport = await billingService.getBillingReport(filters);
    const dataBillingReportMapped = dataBillingReport.filter(
      (item: any) => item.sub_type === "entity"
    );

    populateBillingReport(dataBillingReportMapped);
  }

  function populateBillingReport(data: any[]) {
    let totalValorUnitario = 0;
    let totalCopago = 0;
    let totalGeneral = 0;

    const formattedData = data.map((item) => {
      const child_invoice_ids = mappedBilledProcedures(item.billed_procedure);
      const price = Number(item.entity_authorized_amount || 0);
      const amount = item.billed_procedure.reduce(
        (sum: number, procedure: any) =>
          sum + Number(procedure.product.copayment || 0),
        0
      );
      const total = price;
      const products =
        item.billed_procedure
          .map((procedure: any) => procedure.product.name)
          .join(", ") || "Sin nombre del producto";

      totalValorUnitario += price + amount;
      totalCopago += amount;
      totalGeneral += total;

      return {
        id: item.id,
        patientName: `${item.patient.first_name} ${item.patient.last_name}`,
        authorizationDate: item.authorization_date,
        products,
        authorizationNumber: item.authorization_number,
        child_invoice_ids,
        price: price + amount,
        amount,
        total,
      };
    });

    setBillingData(formattedData);
    setTotals({
      unitValue: totalValorUnitario,
      copayment: totalCopago,
      total: totalGeneral,
    });
  }

  function mappedBilledProcedures(billed_procedure: any[]) {
    const invoice_ids = [
      ...new Set(
        billed_procedure.map((procedure: any) => procedure.invoice_id)
      ),
    ];

    return invoice_ids;
  }

  // Formateador de moneda
  const currencyFormat = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  const calculateDueDate = (days: string) => {
    const daysNumber = parseInt(days, 10);

    if (!isNaN(daysNumber)) {
      const currentDate = new Date();
      const newDueDate: any = new Date(currentDate);
      newDueDate.setDate(currentDate.getDate() + daysNumber);
      setDueDate(newDueDate);
      setValue("dueDate", newDueDate);
    } else {
      setDueDate(null);
      setValue("dueDate", null);
    }
  };

  const handleCreditDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreditDays(value);
    setValue("creditDays", value);
    calculateDueDate(value);
  };

  function formattedDate(date: any) {
    const dateFormatted = new Date(date).setDate(date.getDate() - 1);
    return new Date(dateFormatted).toISOString().slice(0, 10);
  }

  async function saveBillingByEntity() {
    let userLogged = getUserLogged();
    const formData: any = getValues();

    const payload = {
      child_invoice_ids: billingData.map(
        (item: any) => item?.child_invoice_ids[0]
      ),
      tax_charge: `${formData.taxCharge.id}`,
      withholding_tax: `${formData.taxWithholding.id}`,
      billing_type: formData.invoiceType,
      external_id: userLogged.external_id,
      invoice: {
        due_date: formattedDate(formData.dueDate),
        type: "entity",
        entity_id: `${formData.entity.id}`,
        entity_type: formData.invoiceType,
        subtotal: totals.unitValue,
        discount: totals.copayment,
      },
      invoice_detail: [],
      payments: [],
      observations: formData.observations,
    };

    try {
      const response = await billingService.storeByEntity(payload);
      AlertManager.success("Facturación creada exitosamente");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      AlertManager.error("Error al crear la facturación");
      console.error("Error:", error);
    }
  }

  // Render para los totales
  const renderTotals = () => (
    <div className="p-4 border-round-lg bg-gray-100 mt-3">
      <div className="d-flex justify-content-end gap-3">
        <div className="">
          <p className="font-bold">Total valor unitario:</p>
          <Tag value={currencyFormat(totals.unitValue)} severity="info" />
        </div>
        <div className="">
          <p className="font-bold">Total copago:</p>
          <Tag value={currencyFormat(totals.copayment)} severity="warning" />
        </div>
        <div className="">
          <p className="font-bold">Total general:</p>
          <Tag value={currencyFormat(totals.total)} severity="success" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card d-flex justify-content-center">
      <Stepper ref={stepperRef}>
        <StepperPanel header="Información básica">
          <div className="d-flex flex-column">
            <Card title="Información básica">
              <div className="row">
                <div className="col-6 mb-3">
                  <Controller
                    name="elaborationDate"
                    control={control}
                    rules={{ required: "Fecha de elaboración es requerida" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Fecha de elaboración{" "}
                          <span className="text-primary">*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Calendar
                            id={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className={classNames("w-100", {
                              "p-invalid": errors.elaborationDate,
                            })}
                            appendTo={"self"}
                          />
                        </div>
                        {getFormErrorMessage("elaborationDate")}
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="invoiceType"
                    control={control}
                    rules={{ required: "Tipo de factura es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Tipo factura <span className="text-primary">*</span>
                        </label>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          options={invoiceTypes}
                          onChange={field.onChange}
                          placeholder="Seleccione"
                          className={classNames("w-100", {
                            "p-invalid": errors.invoiceType,
                          })}
                          appendTo={"self"}
                        />
                        {getFormErrorMessage("invoiceType")}
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="costCenter"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Centro de costo
                        </label>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          options={costCenters}
                          onChange={field.onChange}
                          placeholder="Seleccione (opcional)"
                          filter
                          className="w-100"
                          appendTo={"self"}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </Card>
            <Card title="Filtros" className="mt-3">
              <div className="row">
                <div className="col-6 mb-3">
                  <Controller
                    name="entity"
                    control={control}
                    rules={{ required: "Entidad es requerida" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Entidad <span className="text-primary">*</span>
                        </label>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          options={entities}
                          onChange={field.onChange}
                          placeholder="Seleccione"
                          className={classNames("w-100", {
                            "p-invalid": errors.entity,
                          })}
                          filter
                          appendTo={"self"}
                        />
                        {getFormErrorMessage("entity")}
                      </>
                    )}
                  />
                </div>
                <div className="col-6 mb-3">
                  <Controller
                    name="procedure"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Procedimientos
                        </label>
                        <div style={{ position: "relative" }}>
                          <MultiSelect
                            id={field.name}
                            value={field.value}
                            optionLabel="attributes.name"
                            options={products}
                            onChange={field.onChange}
                            placeholder="Seleccione (opcional)"
                            filter
                            className="w-100"
                            appendTo={"self"}
                          />
                        </div>
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="specialist"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Especialistas
                        </label>
                        <div style={{ position: "relative" }}>
                          <MultiSelect
                            id={field.name}
                            value={field.value}
                            optionLabel="full_name"
                            options={users}
                            onChange={field.onChange}
                            filter
                            placeholder="Seleccione (opcional)"
                            className="w-100"
                            appendTo={"self"}
                          />
                        </div>
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="patient"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Pacientes
                        </label>
                        <div style={{ position: "relative" }}>
                          <MultiSelect
                            id={field.name}
                            value={field.value}
                            optionLabel="full_name"
                            options={patients}
                            onChange={field.onChange}
                            filter
                            placeholder="Seleccione (opcional)"
                            className="w-100"
                            appendTo={"self"}
                          />
                        </div>
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="regime"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Regimen
                        </label>
                        <div style={{ position: "relative" }}>
                          <MultiSelect
                            id={field.name}
                            value={field.value}
                            optionLabel="label"
                            options={regimeOptions}
                            onChange={field.onChange}
                            filter
                            placeholder="Seleccione (opcional)"
                            className="w-100"
                            appendTo={"self"}
                          />
                        </div>
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="dateRange"
                    control={control}
                    rules={{ required: "Rango de fechas es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Fecha inicio - fin Procedimiento{" "}
                          <span className="text-primary">*</span>
                        </label>
                        <Calendar
                          id={field.name}
                          value={dateRange}
                          onChange={(e) => {
                            setDateRange(e.value);
                            field.onChange(e.value);
                          }}
                          selectionMode="range"
                          dateFormat="dd/mm/yy"
                          showIcon
                          className={classNames("w-100", {
                            "p-invalid": errors.dateRange,
                          })}
                          readOnlyInput
                          placeholder="dd/mm/yyyy - dd/mm/yyyy"
                          appendTo={"self"}
                        />
                        {getFormErrorMessage("dateRange")}
                      </>
                    )}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="d-flex pt-4 justify-content-end">
            <Button
              label="Siguiente"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={validateStep1}
            />
          </div>
        </StepperPanel>
        <StepperPanel header="Información de facturación">
          <div className="d-flex flex-column">
            <Card title="Información de facturación">
              {billingData.length > 0 ? (
                <>
                  <DataTable
                    value={billingData}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                  >
                    <Column field="patientName" header="Paciente" sortable />
                    <Column
                      field="authorizationDate"
                      header="Fecha Autorización"
                      sortable
                    />
                    <Column field="products" header="Procedimientos" />
                    <Column
                      field="authorizationNumber"
                      header="N° Autorización"
                    />
                    <Column
                      field="price"
                      header="Valor Unitario"
                      body={(rowData) => currencyFormat(rowData.price)}
                      sortable
                    />
                    <Column
                      field="amount"
                      header="Copago"
                      body={(rowData) => currencyFormat(rowData.amount)}
                      sortable
                    />
                    <Column
                      field="total"
                      header="Total"
                      body={(rowData) => currencyFormat(rowData.total)}
                      sortable
                    />
                  </DataTable>
                  {renderTotals()}
                </>
              ) : (
                <p>No hay datos de facturación para mostrar</p>
              )}
            </Card>
          </div>
          <div className="d-flex pt-4 justify-content-between">
            <Button
              label="Volver"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="Siguiente"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </div>
        </StepperPanel>
        <StepperPanel header="Métodos de pago">
          <div className="d-flex flex-column">
            <Card title="Metodos de pago">
              <div className="row">
                <div className="col-12 mb-3">
                  <Controller
                    name="observations"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Observaciones
                        </label>
                        <InputTextarea
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          className="w-100"
                          rows={5}
                          cols={30}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="col-12 mb-3">
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          inputId="metodoPagoCheck"
                          checked={paymentMethodChecked}
                          onChange={(e: any) => {
                            setPaymentMethodChecked(e.checked);
                            field.onChange(e.checked ? "cash" : "credit");
                          }}
                        />
                        <label htmlFor="metodoPagoCheck" className="ms-2">
                          ¿Desea cambiar el metodo de pago de crédito a contado?
                        </label>
                      </>
                    )}
                  />
                </div>

                {paymentMethodChecked && (
                  <div className="col-6 mb-3">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <>
                          <label className="form-label" htmlFor="metodoPago">
                            Método de pago{" "}
                            <span className="text-primary">*</span>
                          </label>
                          <Dropdown
                            id="metodoPago"
                            value={field.value}
                            options={paymentMethods}
                            optionLabel="method"
                            onChange={field.onChange}
                            placeholder="Seleccione"
                            className={classNames("w-100", {
                              "p-invalid": errors.paymentMethod,
                            })}
                            required
                            appendTo={"self"}
                          />
                          {getFormErrorMessage("paymentMethod")}
                        </>
                      )}
                    />
                  </div>
                )}

                <div className="col-6 mb-3">
                  <Controller
                    name="creditDays"
                    control={control}
                    rules={{
                      required: "Plazo es requerido",
                      min: { value: 1, message: "Mínimo 1 día" },
                    }}
                    render={({ field }) => (
                      <>
                        <label htmlFor="diasPlazo" className="form-label">
                          Plazo (dias) <span className="text-primary">*</span>
                        </label>
                        <InputText
                          id="diasPlazo"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleCreditDaysChange(e);
                          }}
                          className={classNames("w-100", {
                            "p-invalid": errors.creditDays,
                          })}
                          keyfilter="int"
                        />
                        {getFormErrorMessage("creditDays")}
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="dueDate"
                    control={control}
                    rules={{ required: "Fecha de vencimiento es requerida" }}
                    render={({ field }) => (
                      <>
                        <label
                          className="form-label"
                          htmlFor="fechaVencimiento"
                        >
                          Fecha de vencimiento{" "}
                          <span className="text-primary">*</span>
                        </label>
                        <Calendar
                          id="fechaVencimiento"
                          value={field.value}
                          onChange={(e: any) => {
                            field.onChange(e.value);
                            setDueDate(e.value);
                          }}
                          dateFormat="dd/mm/yy"
                          showIcon
                          className={classNames("w-100", {
                            "p-invalid": errors.dueDate,
                          })}
                          readOnlyInput
                          appendTo={"self"}
                        />
                        {getFormErrorMessage("dueDate")}
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="taxCharge"
                    control={control}
                    rules={{ required: "Impuesto cargo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label className="form-label" htmlFor="taxCharge">
                          Impuesto cargo <span className="text-primary">*</span>
                        </label>
                        <Dropdown
                          id="taxChargeSelect"
                          value={field.value}
                          optionLabel="name"
                          options={taxCharges}
                          onChange={field.onChange}
                          placeholder="Seleccione"
                          className={classNames("w-100", {
                            "p-invalid": errors.taxCharge,
                          })}
                          appendTo={"self"}
                        />
                        {getFormErrorMessage("taxCharge")}
                      </>
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <Controller
                    name="taxWithholding"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label className="form-label" htmlFor="taxWithholding">
                          Impuesto retención
                        </label>
                        <Dropdown
                          id="taxWithholdingSelect"
                          value={field.value}
                          optionLabel="name"
                          options={taxWithholdings}
                          onChange={field.onChange}
                          placeholder="Seleccione (opcional)"
                          className="w-100"
                          appendTo={"self"}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="d-flex pt-4 justify-content-between">
            <Button
              label="Volver"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="Guardar"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => {
                saveBillingByEntity();
              }}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
};
