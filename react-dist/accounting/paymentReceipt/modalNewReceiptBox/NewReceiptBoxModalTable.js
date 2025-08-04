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
const mapFormDataToPayload = formData => {
  const getUserIdFromLocalStorage = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.id;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener userId:", error);
      return null;
    }
  };
  const userId = getUserIdFromLocalStorage();
  return {
    type: formData.tipo.toLowerCase(),
    status: "pagado",
    subtotal: formData.valorPagado,
    discount: 0,
    iva: 0,
    total_amount: formData.valorPagado,
    observations: formData.observaciones,
    due_date: formData.fechaElaboracion?.toISOString().split("T")[0],
    paid_amount: formData.valorPagado,
    remaining_amount: 0,
    quantity_total: 1,
    third_party_id: parseInt(formData.clientes),
    user_id: userId,
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
      amount: formData.valorPagado,
      credit_card_or_bank: formData.origenDinero,
      credit_card_or_check_number: "",
      account_number: "",
      notes: ""
    }],
    invoices: [{
      invoice_id: parseInt(formData.numeroFactura),
      applied_amount: formData.valorPagado
    }]
  };
};
export const NewReceiptBoxModalTable = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload,
  initialData
}) => {
  // Función para determinar el tipo de recibo basado en initialData

  const [formData, setFormData] = useState({
    idFactura: 0,
    cliente: "",
    tipo: "",
    clientes: "",
    realizarUn: "",
    metodoPagoId: "",
    origenDinero: "",
    numeroRecibo: "",
    numeroFactura: initialData?.numeroFactura || "",
    fechaElaboracion: null,
    centroCosto: initialData?.centreCost?.id?.toString() || "",
    valorPagado: 0,
    observaciones: "",
    archivo: null
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
  useEffect(() => {
    if (visible) {
      setFormData(prev => ({
        ...prev,
        numeroFactura: initialData?.numeroFactura || prev.numeroFactura,
        fechaElaboracion: initialData?.fechaElaboracion || prev.fechaElaboracion,
        valorPagado: initialData?.valorPagado || prev.valorPagado,
        centroCosto: initialData?.centreCost?.id?.toString() || prev.centroCosto,
        clientes: initialData?.cliente || prev.clientes,
        tipo: ""
      }));
    }
  }, [visible, initialData]);

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
        numeroRecibo: initialData?.numeroRecibo || generarNumeroRecibo()
      }));
    }
  }, [visible, initialData]);

  // Opciones para los dropdowns
  const tipoOptions = [{
    label: "Ingreso",
    value: "Ingreso"
  }, {
    label: "Egreso",
    value: "Egreso"
  }];
  const clientesOptions = thirdParties.map(cliente => ({
    label: cliente.name,
    value: String(cliente.id)
  }));
  const realizarUnOptions = [{
    label: "Anticipo",
    value: "advance_payment"
  }];
  const metodoPagoOptions = paymentMethods.filter(metodo => metodo.category === "transactional").map(metodo => ({
    label: metodo.method,
    value: metodo.id
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
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clientes",
    className: "form-label"
  }, "Clientes"), /*#__PURE__*/React.createElement(Dropdown, {
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
    onChange: e => onDropdownChange(e, "realizarUn"),
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
    className: "w-50",
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
  }))), /*#__PURE__*/React.createElement("div", {
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
  })))));
};