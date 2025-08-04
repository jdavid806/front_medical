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
import { entityService, productService, userService, patientService, costCenterService, billingService } from "../../../services/api/index.js";
import { getUserLogged } from "../../../services/utilidades.js";
import AlertManager from "../../../services/alertManager.js";
import { InputTextarea } from "primereact/inputtextarea";
export const BillingByEntity = () => {
  const stepperRef = useRef(null);
  const [entities, setEntities] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [totals, setTotals] = useState({
    unitValue: 0,
    copayment: 0,
    total: 0
  });
  const [dueDate, setDueDate] = useState(null); // Nuevo estado para fecha de vencimiento
  const [creditDays, setCreditDays] = useState("");
  const [paymentMethodChecked, setPaymentMethodChecked] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [taxCharges, setTaxCharges] = useState([]);
  const [taxWithholdings, setTaxWithholdings] = useState([]);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    getValues,
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      elaborationDate: null,
      invoiceType: null,
      entity: {
        id: 0
      },
      costCenter: {
        id: 0
      },
      procedure: [],
      specialist: [],
      patient: [],
      dateRange: [],
      paymentMethod: "",
      observations: "",
      creditDays: "",
      dueDate: null,
      taxCharge: {
        id: 0
      },
      taxWithholding: {
        id: 0
      }
    }
  });
  const invoiceTypes = [{
    label: "Fiscal",
    value: "tax_invoice"
  }, {
    label: "Gubernamental",
    value: "government_invoice"
  }];
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
    const usersMapped = dataUsers.map(user => {
      return {
        ...user,
        full_name: `${user.first_name} ${user.middle_name} ${user.last_name} ${user.second_last_name}`
      };
    });
    setUsers(usersMapped);
  }
  async function loadPatients() {
    const dataPatients = await patientService.getAll();
    const patientsMapped = dataPatients.map(patient => {
      return {
        ...patient,
        full_name: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`
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
    let dataTaxChargesWithholding = await obtenerDatos(urltaxChargesWithholding);
    setTaxWithholdings(dataTaxChargesWithholding.data);
  }
  const getFormErrorMessage = name => {
    return errors[name] ? /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message) : null;
  };
  const validateStep1 = async () => {
    const isValid = await trigger(["elaborationDate", "invoiceType", "entity", "dateRange"]);
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
      patient_ids: values.patient.map(patient => patient.id),
      product_ids: values.procedure.map(procedure => procedure.id),
      user_ids: values.specialist.map(specialist => specialist.id),
      entity_id: values.entity?.id
    };
    billingReport(paramsFilter);
  }
  async function billingReport(filters) {
    const dataBillingReport = await billingService.getBillingReport(filters);
    const dataBillingReportMapped = dataBillingReport.filter(item => item.sub_type === "entity");
    populateBillingReport(dataBillingReportMapped);
  }
  function populateBillingReport(data) {
    let totalValorUnitario = 0;
    let totalCopago = 0;
    let totalGeneral = 0;
    console.log("Data:", data);
    const formattedData = data.map(item => {
      const child_invoice_ids = mappedBilledProcedures(item.billed_procedure);
      const price = Number(item.entity_authorized_amount || 0);
      const amount = item.billed_procedure.reduce((sum, procedure) => sum + Number(procedure.product.copayment || 0), 0);
      const total = price;
      const products = item.billed_procedure.map(procedure => procedure.product.name).join(", ") || "Sin nombre del producto";
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
        total
      };
    });
    console.log("formattedData:", formattedData);
    setBillingData(formattedData);
    setTotals({
      unitValue: totalValorUnitario,
      copayment: totalCopago,
      total: totalGeneral
    });
  }
  function mappedBilledProcedures(billed_procedure) {
    const invoice_ids = [...new Set(billed_procedure.map(procedure => procedure.invoice_id))];
    return invoice_ids;
  }

  // Formateador de moneda
  const currencyFormat = value => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP"
    }).format(value);
  };
  const calculateDueDate = days => {
    const daysNumber = parseInt(days, 10);
    if (!isNaN(daysNumber)) {
      const currentDate = new Date();
      const newDueDate = new Date(currentDate);
      newDueDate.setDate(currentDate.getDate() + daysNumber);
      setDueDate(newDueDate);
      setValue("dueDate", newDueDate);
    } else {
      setDueDate(null);
      setValue("dueDate", null);
    }
  };
  const handleCreditDaysChange = e => {
    const value = e.target.value;
    setCreditDays(value);
    setValue("creditDays", value);
    calculateDueDate(value);
  };
  function formattedDate(date) {
    const dateFormatted = new Date(date).setDate(date.getDate() - 1);
    return new Date(dateFormatted).toISOString().slice(0, 10);
  }
  async function saveBillingByEntity() {
    let userLogged = getUserLogged();
    const formData = getValues();
    const payload = {
      child_invoice_ids: billingData.map(item => item?.child_invoice_ids[0]),
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
        discount: totals.copayment
      },
      invoice_detail: [],
      payments: [],
      observations: formData.observations
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
  const renderTotals = () => /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-round-lg bg-gray-100 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold"
  }, "Total valor unitario:"), /*#__PURE__*/React.createElement(Tag, {
    value: currencyFormat(totals.unitValue),
    severity: "info"
  })), /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold"
  }, "Total copago:"), /*#__PURE__*/React.createElement(Tag, {
    value: currencyFormat(totals.copayment),
    severity: "warning"
  })), /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold"
  }, "Total general:"), /*#__PURE__*/React.createElement(Tag, {
    value: currencyFormat(totals.total),
    severity: "success"
  }))));
  return /*#__PURE__*/React.createElement("div", {
    className: "card d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n b\xE1sica"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n b\xE1sica"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "elaborationDate",
    control: control,
    rules: {
      required: "Fecha de elaboración es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha de elaboraci\xF3n", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-100", {
        "p-invalid": errors.elaborationDate
      }),
      appendTo: "self"
    })), getFormErrorMessage("elaborationDate"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "invoiceType",
    control: control,
    rules: {
      required: "Tipo de factura es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo factura ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      options: invoiceTypes,
      onChange: field.onChange,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.invoiceType
      }),
      appendTo: "self"
    }), getFormErrorMessage("invoiceType"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "costCenter",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Centro de costo"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      optionLabel: "name",
      options: costCenters,
      onChange: field.onChange,
      placeholder: "Seleccione (opcional)",
      filter: true,
      className: "w-100",
      appendTo: "self"
    }))
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros",
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "entity",
    control: control,
    rules: {
      required: "Entidad es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Entidad ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      optionLabel: "name",
      options: entities,
      onChange: field.onChange,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.entity
      }),
      filter: true,
      appendTo: "self"
    }), getFormErrorMessage("entity"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "procedure",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Procedimientos"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(MultiSelect, {
      id: field.name,
      value: field.value,
      optionLabel: "attributes.name",
      options: products,
      onChange: field.onChange,
      placeholder: "Seleccione (opcional)",
      filter: true,
      className: "w-100",
      appendTo: "self"
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "specialist",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Especialistas"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(MultiSelect, {
      id: field.name,
      value: field.value,
      optionLabel: "full_name",
      options: users,
      onChange: field.onChange,
      filter: true,
      placeholder: "Seleccione (opcional)",
      className: "w-100",
      appendTo: "self"
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Pacientes"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(MultiSelect, {
      id: field.name,
      value: field.value,
      optionLabel: "full_name",
      options: patients,
      onChange: field.onChange,
      filter: true,
      placeholder: "Seleccione (opcional)",
      className: "w-100",
      appendTo: "self"
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "dateRange",
    control: control,
    rules: {
      required: "Rango de fechas es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha inicio - fin Procedimiento", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: dateRange,
      onChange: e => {
        setDateRange(e.value);
        field.onChange(e.value);
      },
      selectionMode: "range",
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-100", {
        "p-invalid": errors.dateRange
      }),
      readOnlyInput: true,
      placeholder: "dd/mm/yyyy - dd/mm/yyyy",
      appendTo: "self"
    }), getFormErrorMessage("dateRange"))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: validateStep1
  }))), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n de facturaci\xF3n"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n de facturaci\xF3n"
  }, billingData.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DataTable, {
    value: billingData,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "patientName",
    header: "Paciente",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "authorizationDate",
    header: "Fecha Autorizaci\xF3n",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "products",
    header: "Procedimientos"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "authorizationNumber",
    header: "N\xB0 Autorizaci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Valor Unitario",
    body: rowData => currencyFormat(rowData.price),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Copago",
    body: rowData => currencyFormat(rowData.amount),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total",
    body: rowData => currencyFormat(rowData.total),
    sortable: true
  })), renderTotals()) : /*#__PURE__*/React.createElement("p", null, "No hay datos de facturaci\xF3n para mostrar"))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-between"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Volver",
    severity: "secondary",
    icon: "pi pi-arrow-left",
    onClick: () => stepperRef.current.prevCallback()
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: () => stepperRef.current.nextCallback()
  }))), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "M\xE9todos de pago"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Metodos de pago"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Observaciones"), /*#__PURE__*/React.createElement(InputTextarea, {
      id: field.name,
      value: field.value,
      onChange: field.onChange,
      className: "w-100",
      rows: 5,
      cols: 30
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "paymentMethod",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
      inputId: "metodoPagoCheck",
      checked: paymentMethodChecked,
      onChange: e => {
        setPaymentMethodChecked(e.checked);
        field.onChange(e.checked ? "cash" : "credit");
      }
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "metodoPagoCheck",
      className: "ms-2"
    }, "\xBFDesea cambiar el metodo de pago de cr\xE9dito a contado?"))
  })), paymentMethodChecked && /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "paymentMethod",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "metodoPago"
    }, "M\xE9todo de pago", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: "metodoPago",
      value: field.value,
      options: paymentMethods,
      optionLabel: "method",
      onChange: field.onChange,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.paymentMethod
      }),
      required: true,
      appendTo: "self"
    }), getFormErrorMessage("paymentMethod"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "creditDays",
    control: control,
    rules: {
      required: "Plazo es requerido",
      min: {
        value: 1,
        message: "Mínimo 1 día"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "diasPlazo",
      className: "form-label"
    }, "Plazo (dias) ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, {
      id: "diasPlazo",
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handleCreditDaysChange(e);
      },
      className: classNames("w-100", {
        "p-invalid": errors.creditDays
      }),
      keyfilter: "int"
    }), getFormErrorMessage("creditDays"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "dueDate",
    control: control,
    rules: {
      required: "Fecha de vencimiento es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "fechaVencimiento"
    }, "Fecha de vencimiento", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Calendar, {
      id: "fechaVencimiento",
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        setDueDate(e.value);
      },
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-100", {
        "p-invalid": errors.dueDate
      }),
      readOnlyInput: true,
      appendTo: "self"
    }), getFormErrorMessage("dueDate"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "taxCharge",
    control: control,
    rules: {
      required: "Impuesto cargo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "taxCharge"
    }, "Impuesto cargo ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: "taxChargeSelect",
      value: field.value,
      optionLabel: "name",
      options: taxCharges,
      onChange: field.onChange,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.taxCharge
      }),
      appendTo: "self"
    }), getFormErrorMessage("taxCharge"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "taxWithholding",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "taxWithholding"
    }, "Impuesto retenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "taxWithholdingSelect",
      value: field.value,
      optionLabel: "name",
      options: taxWithholdings,
      onChange: field.onChange,
      placeholder: "Seleccione (opcional)",
      className: "w-100",
      appendTo: "self"
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-between"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Volver",
    severity: "secondary",
    icon: "pi pi-arrow-left",
    onClick: () => stepperRef.current.prevCallback()
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: () => {
      saveBillingByEntity();
    }
  })))));
};