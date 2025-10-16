import React, { useState, useEffect } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { MakeRequestForm } from "../general-request/components/MakeRequestForm.js";
import { RequestCancellationTableAction } from "../components/table-actions/RequestCancellationTableAction.js";
import { cancelConsultationClaim } from "../../services/koneksiService.js";
export const PharmacyTable = ({
  items,
  onReload,
  onPage,
  onSearch,
  first,
  rows,
  lazy,
  loading,
  onCancelItem,
  totalRecords,
  handleFilter
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const statusOptions = [{
    label: "Pagada",
    value: "paid"
  }, {
    label: "Pendiente",
    value: "pending"
  }, {
    label: "Anulada",
    value: "cancelled"
  }];
  const clientOptions = [{
    label: "Cliente 1",
    value: "1"
  }, {
    label: "Cliente 2",
    value: "2"
  }];
  const onFilter = () => {
    const filterValues = {
      selectedClient,
      selectedStatus,
      selectedDate
    };
    handleFilter && handleFilter(filterValues);
  };
  useEffect(() => {
    onFilter();
  }, [selectedClient, selectedStatus, selectedDate]);

  // ELIMINA ESTA FUNCIÓN LOCAL - ES LA QUE CAUSA EL CONFLICTO
  // const generateInvoice = async (appointmentId: string, download: boolean = false): Promise<void> => {
  //     try {
  //         //@ts-ignore - Esta función ya existe en el contexto global
  //         await generateInvoice(appointmentId, download);
  //         ...
  //     }
  // };

  const cancelClaim = claimId => {
    SwalManager.confirmCancel(async () => {
      try {
        const response = await cancelConsultationClaim(claimId);
        SwalManager.success({
          title: "Éxito",
          text: "Reclamación anulada con éxito."
        });
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la reclamación."
        });
      }
    });
  };
  const handleViewDetails = invoice => {
    SwalManager.info({
      title: "Detalles de Factura",
      text: `Factura: ${invoice.invoice}<br>Cliente: ${invoice.client}<br>Total: $${invoice.total_amount.toFixed(2)}<br>Pagado: $${invoice.paid.toFixed(2)}<br>Pendiente: $${invoice.remaining_amount.toFixed(2)}`
    });
  };
  const handleCancelInvoice = invoiceId => {
    setSelectedInvoiceId(invoiceId);
    setShowCancellationModal(true);
  };
  const handleRegisterPayment = (invoiceId, currentInvoice) => {
    SwalManager.prompt({
      title: "Registrar Pago",
      text: `Ingrese el monto del pago (Máximo: $${currentInvoice.remaining_amount.toFixed(2)}):`,
      input: "number",
      inputValue: currentInvoice.remaining_amount.toFixed(2),
      inputAttributes: {
        min: "0",
        max: currentInvoice.remaining_amount.toString(),
        step: "0.01"
      },
      showCancelButton: true,
      confirmButtonText: "Registrar Pago",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const amount = parseFloat(result.value);
        if (amount > 0 && amount <= currentInvoice.remaining_amount) {
          // Lógica para registrar el pago
          console.log(`Registrando pago de $${amount} para factura ${invoiceId}`);
          SwalManager.success({
            title: "Éxito",
            text: `Pago de $${amount.toFixed(2)} registrado correctamente.`
          });
          onReload && onReload();
        } else {
          SwalManager.error({
            title: "Error",
            text: "El monto ingresado no es válido."
          });
        }
      }
    });
  };
  const getStatusBadge = status => {
    const statusConfig = {
      paid: {
        color: "success",
        text: "PAGADA"
      },
      pending: {
        color: "warning",
        text: "PENDIENTE"
      },
      cancelled: {
        color: "danger",
        text: "ANULADA"
      }
    };
    const config = statusConfig[status] || {
      color: "secondary",
      text: "DESCONOCIDO"
    };
    return /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${config.color}`
    }, config.text);
  };
  const columns = [{
    header: "Factura",
    field: "invoice"
  }, {
    header: "Fecha",
    field: "date"
  }, {
    header: "Cliente",
    field: "client"
  }, {
    header: "Total",
    field: "total_amount",
    body: data => `$${data.total_amount.toFixed(2)}`
  }, {
    header: "Pagado",
    field: "paid",
    body: data => `$${data.paid.toFixed(2)}`
  }, {
    header: "Pendiente",
    field: "remaining_amount",
    body: data => `$${data.remaining_amount.toFixed(2)}`
  }, {
    header: "Estado",
    field: "status",
    body: data => getStatusBadge(data.status)
  }, {
    header: "Acciones",
    field: "",
    body: data => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => handleViewDetails(data)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-eye",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Ver detalles")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: async () => {
        try {
          //@ts-ignore - USAR DIRECTAMENTE LA FUNCIÓN GLOBAL
          await generateInvoice(data.originalItem?.appointment_id || data.id, false);
          SwalManager.success({
            title: "Éxito",
            text: "Factura impresa correctamente."
          });
        } catch (error) {
          console.error("Error al imprimir factura:", error);
          SwalManager.error({
            title: "Error",
            text: "No se pudo imprimir la factura."
          });
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-receipt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Imprimir factura")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: async () => {
        try {
          //@ts-ignore - USAR DIRECTAMENTE LA FUNCIÓN GLOBAL
          await generateInvoice(data.originalItem?.appointment_id || data.id, true);
          SwalManager.success({
            title: "Éxito",
            text: "Factura descargada correctamente."
          });
        } catch (error) {
          console.error("Error al descargar factura:", error);
          SwalManager.error({
            title: "Error",
            text: "No se pudo descargar la factura."
          });
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-receipt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Descargar factura")))), data.status === "pending" && data.remaining_amount > 0 && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => handleRegisterPayment(data.id, data)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-money-bill",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Registrar pago")))), data.koneksiClaimId && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => cancelClaim(data.koneksiClaimId)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Anular reclamaci\xF3n")))), /*#__PURE__*/React.createElement(RequestCancellationTableAction, {
      onTrigger: () => handleCancelInvoice(data.id)
    }))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar facturas de farmacia")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechas",
    className: "form-label"
  }, "Fecha de emisi\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechas",
    name: "rangoFechas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cliente",
    className: "form-label"
  }, "Cliente"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "cliente",
    options: clientOptions,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    placeholder: "Seleccionar cliente",
    className: "w-100",
    value: selectedClient,
    onChange: e => setSelectedClient(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "estado",
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "estado",
    options: statusOptions,
    optionLabel: "label",
    optionValue: "value",
    placeholder: "Seleccionar estado",
    className: "w-100",
    value: selectedStatus,
    onChange: e => setSelectedStatus(e.value),
    showClear: true
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    onClick: () => {
      exportToExcel({
        data: items,
        fileName: `Facturas_Farmacia`,
        excludeColumns: ["id", "originalItem"]
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel me-2"
  }), "Exportar a Excel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: onReload
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-refresh me-2"
  }), "Actualizar")), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: items,
    lazy: lazy,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    loading: loading,
    onPage: onPage,
    onSearch: onSearch,
    onReload: onReload
  }))), /*#__PURE__*/React.createElement(CustomFormModal, {
    show: showCancellationModal,
    onHide: () => setShowCancellationModal(false),
    formId: "cancellationForm",
    title: "Solicitud de anulaci\xF3n de factura"
  }, /*#__PURE__*/React.createElement(MakeRequestForm, {
    formId: "cancellationForm",
    onHandleSubmit: requestData => {
      if (selectedInvoiceId) {
        // Lógica para enviar la solicitud de anulación
        console.log("Solicitud de anulación:", {
          selectedInvoiceId,
          requestData
        });
        SwalManager.success({
          text: "Solicitud de anulación enviada correctamente"
        });
        setShowCancellationModal(false);
        onReload && onReload();
      }
    }
  })));
};