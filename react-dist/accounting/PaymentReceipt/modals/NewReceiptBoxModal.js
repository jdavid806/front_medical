import React, { useEffect, useState } from "react";
import { useCreateCashRecipeWithInvoice } from "../../hooks/useCashReceipts.js";
import { usePaymentMethods } from "../../../payment-methods/hooks/usePaymentMethods.js";
import { useThirdParties } from "../../../billing/third-parties/hooks/useThirdParties.js";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { useCentresCosts } from "../../../centres-cost/hooks/useCentresCosts.js";
import { Card } from "primereact/card";
import { formatDate } from "../../../../services/utilidades.js";
const mapFormDataToPayload = formData => {
  const getUserIdFromLocalStorage = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        // Parsear el JSON a objeto
        const userData = JSON.parse(userDataString);

        // Obtener el user_id
        const userId = userData.id;
        return userId;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener userId:", error);
      return null;
    }
  };
  const userId = getUserIdFromLocalStorage();
  return {
    type: formData.tipo.toLowerCase(),
    // "ingreso" o "egreso"
    action: formData.realizarUn,
    subtotal: formData.valorPagado,
    discount: formData.discount,
    iva: formData.iva,
    total_amount: formData.valorPagado,
    observations: formData.observaciones,
    due_date: formData.fechaElaboracion?.toISOString().split("T")[0],
    // 'YYYY-MM-DD'
    paid_amount: formData.valorPagado,
    remaining_amount: 0,
    quantity_total: formData.quantity_total,
    third_party_id: parseInt(formData.clientes),
    user_id: userId,
    // Obtenido dinámicamente
    advance_role: formData.type === "purchase-order" ? "provider" : "customer",
    details: [{
      product_id: 1,
      quantity: 1,
      unit_price: formData.valorPagado,
      amount: formData.valorPagado,
      discount: 0,
      subtotal: formData.valorPagado
    }],
    payments: [{
      payment_method_id: parseInt(formData.metodoPagoId),
      payment_date: formData.fechaElaboracion?.toISOString().split("T")[0],
      amount: Number(formData.valorPagado),
      credit_card_or_bank: formData.origenDinero,
      // Aquí asumiendo que esto representa el banco
      credit_card_or_check_number: "",
      account_number: "",
      notes: ""
    }],
    invoices: [{
      invoice_id: Number(formData.id),
      // Asumiendo que númeroFactura es el ID real
      applied_amount: formData.valorPagado
    }]
  };
};
export const NewReceiptBoxModal = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload,
  initialData
}) => {
  const [formData, setFormData] = useState({
    idFactura: 0,
    cliente: "",
    tipo: "",
    clientes: "",
    realizarUn: "",
    metodoPagoId: "",
    origenDinero: "",
    numeroRecibo: "",
    numeroFactura: initialData?.idFactura || "",
    fechaElaboracion: null,
    centroCosto: initialData?.centreCost?.id?.toString() || "",
    valorPagado: 0,
    observaciones: "",
    archivo: null,
    type: "",
    subtotal: 0,
    discount: 0,
    iva: 0,
    total_amount: 0,
    due_date: new Date(),
    quantity_total: 0,
    third_party_id: 0,
    user_id: 0
  });
  const {
    createCashRecipeWithInvoice,
    isLoading,
    error,
    success
  } = useCreateCashRecipeWithInvoice();
  const {
    paymentMethods,
    loading: loadingPaymentMethods
  } = usePaymentMethods();
  const {
    thirdParties,
    loading: loadingThirdParties
  } = useThirdParties();
  const {
    centresCosts,
    loading: loadingCostCenters
  } = useCentresCosts();
  const [isBlockedInputs, setIsBlockedInputs] = useState(false);
  const [isShowInputs, setIsShowInputs] = useState(false);
  const [cashReceiptType, setCashReceiptType] = useState("");
  const [realizarUnOptions, setRealizarUnOptions] = useState([]);
  const [amounttotalInvoice, setAmounttotalInvoice] = useState(0);
  useEffect(() => {
    if (visible) {
      setFormData(prev => ({
        ...prev,
        id: initialData?.idFactura,
        numeroFactura: (initialData?.invoiceType == "purchase-order" ? "OC " : "CT ") + initialData?.idFactura || prev.idFactura,
        fechaElaboracion: initialData?.fechaElaboracion || prev.fechaElaboracion,
        centroCosto: initialData?.centreCost?.id?.toString() || prev.centroCosto,
        clientes: handleThirdParty(initialData?.invoiceType) || prev.clientes,
        tipo: selectTypeInvoice(initialData?.invoiceType || ""),
        type: initialData?.invoiceType || prev.type,
        discount: initialData?.discount || 0,
        iva: initialData?.iva || 0,
        total_amount: initialData?.total_amount || 0,
        due_date: new Date(initialData?.due_date || prev.due_date),
        quantity_total: initialData?.quantity_total || 0,
        third_party_id: handleThirdParty(initialData?.invoiceType) || 0,
        user_id: Number(initialData?.user_id) || 0
      }));
      setAmounttotalInvoice(initialData?.valorPagado || 0);
      if (initialData?.invoiceType === "purchase-order" || initialData?.invoiceType === "sale-order") {
        setIsBlockedInputs(true);
        setIsShowInputs(true);
      }
      generateOptionsToMakeInvoice(initialData?.invoiceType);
      switch (initialData?.invoiceType) {
        case "purchase-order":
        case "purchase-invoice":
          setCashReceiptType("provider");
          break;
        case "sale-order":
        case "sale-invoice":
          setCashReceiptType("client");
          break;
        case "entity":
          setCashReceiptType("entity");
          break;
      }
    }
  }, [visible, initialData]);
  function selectTypeInvoice(type) {
    switch (type) {
      case "purchase-order":
      case "purchase-invoice":
        return "Egreso";
      case "sale-invoice":
      case "sale-order":
        return "Ingreso";
      case "entity":
        return "Ingreso";
    }
  }
  function handleThirdParty(invoiceType) {
    switch (invoiceType) {
      case "purchase-order":
      case "purchase-invoice":
        return initialData?.cliente || 0;
      case "sale-order":
      case "sale-invoice":
        return initialData?.cliente || 0;
      case "entity":
        const thirdParty = thirdParties.filter(thirdParty => Number(thirdParty.external_id) == initialData?.third_party_id)[0];
        return (thirdParty?.id || 0).toString() || 0;
    }
  }

  // Generar número de recibo automáticamente al abrir el modal
  useEffect(() => {
    if (visible) {
      const generarNumeroRecibo = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const numero = Math.floor(1000 + Math.random() * 9000);
        return `RC-${año}-${numero}`;
      };
      setFormData(prev => ({
        ...prev,
        numeroRecibo: initialData?.numeroRecibo || generarNumeroRecibo(),
        numeroFactura: initialData?.numeroFactura || prev.numeroFactura,
        fechaElaboracion: initialData?.fechaElaboracion || prev.fechaElaboracion
      }));
    }
  }, [visible, initialData]);

  // Datos mock para los dropdowns
  const tipoOptions = [{
    label: "Ingreso",
    value: "Ingreso"
  }, {
    label: "Egreso",
    value: "Egreso"
  }];
  const clientesOptions = thirdParties.filter(c => c.type === cashReceiptType).map(cliente => {
    return {
      label: cliente.name,
      value: String(cliente.id)
    };
  });
  function generateOptionsToMakeInvoice(invoiceType) {
    const realizarUnOptions = [{
      label: "Abono a factura",
      value: "partial_payment"
    }, {
      label: "Anticipo",
      value: "advance_payment"
    }, {
      label: "Pago completo",
      value: "full_payment"
    }];
    let filteredOptions = [];
    switch (invoiceType) {
      case "purchase-invoice":
        filteredOptions = realizarUnOptions.filter(option => option.value !== "advance_payment");
        setRealizarUnOptions(filteredOptions);
        break;
      case "sale-invoice":
        filteredOptions = realizarUnOptions.filter(option => option.value !== "advance_payment");
        setRealizarUnOptions(filteredOptions);
        break;
      case "entity":
        filteredOptions = realizarUnOptions.filter(option => option.value !== "advance_payment");
        setRealizarUnOptions(filteredOptions);
        break;
      case "purchase-order":
      case "sale-order":
        filteredOptions = realizarUnOptions.filter(option => option.value == "advance_payment");
        setRealizarUnOptions(filteredOptions);
        break;
      default:
        setRealizarUnOptions(realizarUnOptions);
        break;
    }
  }
  const metodoPagoOptions = paymentMethods.filter(metodo => metodo.category === "transactional").map(metodo => ({
    label: metodo.method,
    value: metodo.id // o metodo.method si prefieres usar el nombre como valor
  }));
  const centroCostoOptions = centresCosts.map(centro => ({
    label: centro.name,
    value: centro.id.toString()
  }));
  const onInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const onDropdownChange = (e, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.value
    }));
  };
  const onDateChange = e => {
    if (e.value && !Array.isArray(e.value)) {
      setFormData(prev => ({
        ...prev,
        fechaElaboracion: e.value
      }));
    }
  };
  const onNumberChange = (e, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.value
    }));
  };
  const onFileUpload = e => {
    setFormData(prev => ({
      ...prev,
      archivo: e.files[0]
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleSave = async () => {
    const payload = mapFormDataToPayload(formData);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };
  const handleSaveAndDownload = async () => {
    const payload = mapFormDataToPayload(formData);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Recibo de Caja",
    visible: visible,
    style: {
      width: "80vw"
    },
    onHide: onHide,
    maximizable: true,
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tipo",
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "tipo",
    value: formData.tipo,
    options: tipoOptions,
    onChange: e => onDropdownChange(e, "tipo"),
    placeholder: "Seleccione...",
    className: "w-100",
    appendTo: "self",
    filter: true,
    showClear: true,
    disabled: isBlockedInputs
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clientes",
    className: "form-label"
  }, cashReceiptType === "provider" ? "Proveedor" : "Cliente"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "clientes",
    value: formData.clientes,
    options: clientesOptions,
    onChange: e => onDropdownChange(e, "clientes"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "realizarUn",
    className: "form-label"
  }, "Realizar un"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "realizarUn",
    value: formData.realizarUn,
    options: realizarUnOptions,
    onChange: e => {
      onDropdownChange(e, "realizarUn");
      if (e.value === "full_payment") {
        onNumberChange({
          value: amounttotalInvoice ?? 0
        }, "valorPagado");
      }
    },
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "metodoPagoId",
    className: "form-label"
  }, "M\xE9todo de pago"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "metodoPagoId",
    value: formData.metodoPagoId,
    options: metodoPagoOptions,
    onChange: e => onDropdownChange(e, "metodoPagoId"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "valorPagado",
    className: "form-label"
  }, "Valor pagado"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "valorPagado",
    value: formData.valorPagado,
    onValueChange: e => onNumberChange({
      value: e.value ?? 0
    }, "valorPagado"),
    mode: "currency",
    currency: "USD",
    locale: "en-US",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "numeroRecibo",
    className: "form-label"
  }, "N\xFAmero de recibo (Autom\xE1tico)"), /*#__PURE__*/React.createElement(InputText, {
    id: "numeroRecibo",
    value: formData.numeroRecibo,
    className: "w-100",
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "numeroFactura",
    className: "form-label"
  }, formData.type === "purchase-order" ? "Número de orden de compra" : "Número de factura"), /*#__PURE__*/React.createElement(InputText, {
    id: "numeroFactura",
    value: formData.numeroFactura,
    onChange: e => setFormData({
      ...formData,
      numeroFactura: e.target.value
    }),
    className: "w-100",
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaElaboracion",
    className: "form-label"
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechaElaboracion",
    value: formData.fechaElaboracion,
    onChange: e => onDateChange(e),
    dateFormat: "dd/mm/yy",
    className: "w-100",
    showIcon: true,
    placeholder: "Seleccione la fecha",
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "centroCosto",
    className: "form-label"
  }, "Centro de costo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "centroCosto",
    value: formData.centroCosto,
    options: centroCostoOptions,
    onChange: e => onDropdownChange(e, "centroCosto"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Agregar archivo"), /*#__PURE__*/React.createElement(FileUpload, {
    mode: "basic",
    name: "archivo",
    accept: "image/*,.pdf,.doc,.docx",
    maxFileSize: 1000000,
    chooseLabel: "Seleccionar archivo",
    className: "w-100",
    onUpload: onFileUpload
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "observaciones",
    className: "form-label"
  }, "Observaciones"), /*#__PURE__*/React.createElement(InputTextarea, {
    id: "observaciones",
    name: "observaciones",
    value: formData.observaciones,
    onChange: onInputChange,
    rows: 3,
    className: "w-100",
    placeholder: "Detalles adicionales..."
  }))), isShowInputs && /*#__PURE__*/React.createElement(Card, {
    className: "w-100 h-100 summary-card mb-3",
    title: "Informaci\xF3n adicional"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "summary-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary-label"
  }, "Monto total:"), /*#__PURE__*/React.createElement("span", {
    className: "summary-value"
  }, formData.total_amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary-label"
  }, "Descuento:"), /*#__PURE__*/React.createElement("span", {
    className: "summary-value"
  }, formData.discount?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary-label"
  }, "Impuestos:"), /*#__PURE__*/React.createElement("span", {
    className: "summary-value"
  }, formData.iva?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary-label"
  }, "Cantidad total:"), /*#__PURE__*/React.createElement("span", {
    className: "summary-value"
  }, formData.quantity_total?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary-label"
  }, "Fecha de vencimiento:"), /*#__PURE__*/React.createElement("span", {
    className: "summary-value"
  }, formatDate(formData.due_date?.toLocaleDateString("es-ES"), true))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    style: {
      width: "200px",
      padding: "0.5rem 1rem"
    },
    className: "btn btn-phoenix-secondary",
    onClick: handleSave
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Descargar",
    className: "btn btn-primary",
    style: {
      width: "300px",
      padding: "0.5rem 1rem"
    },
    onClick: handleSaveAndDownload
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-download"
  })))), /*#__PURE__*/React.createElement("style", null, `
        .summary-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-top: 20px;
        }

      .summary-card .card-title {
        color: #333;
        font-size: 1.2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }

      .summary-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .summary-label {
        font-weight: 500;
        color: #555;
      }

      .summary-value {
        font-weight: 600;
        color: #222;
      }
        `));
};