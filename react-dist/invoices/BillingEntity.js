import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { exportToExcel, exportToPDF } from "../accounting/utils/ExportToExcelOptions.js";
import { billingService } from "../../services/api/index.js";
import { SplitButton } from "primereact/splitbutton";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable.js";
export const BillingEntity = () => {
  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de pago
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [montoPago, setMontoPago] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Estado para el modal de recibo de caja
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState(null);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    facturador: "",
    numeroFactura: "",
    entidad: null,
    fechaRango: null,
    montoMinimo: null,
    montoMaximo: null,
    tipoFecha: "elaboracion" // Por defecto filtramos por fecha de elaboración
  });
  const tipoFechaOpciones = [{
    label: "Fecha de Elaboración",
    value: "elaboracion"
  }, {
    label: "Fecha de Vencimiento",
    value: "vencimiento"
  }];

  // Opciones para los selects
  const entidades = [{
    label: "ARS Palic",
    value: "ARS Palic"
  }, {
    label: "ARS Humano",
    value: "ARS Humano"
  }, {
    label: "ARS Universal",
    value: "ARS Universal"
  }, {
    label: "ARS Monumental",
    value: "ARS Monumental"
  }, {
    label: "ARS Renacer",
    value: "ARS Renacer"
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    loadBillingReportData();
  }, []);
  const loadBillingReportData = async () => {
    const response = await billingService.getBillingReportByEntityDetailed();
    console.log("response", response);
    const dataMapped = handleLoadData(response);
    setFacturas(dataMapped);
    setFacturasFiltradas(dataMapped);
    setLoading(false);
  };
  function handleLoadData(data) {
    const dataMapped = data.map(item => {
      const totalAmountFormatted = parseInt(item.main.total_amount, 10);
      const remainingAmountFormatted = parseInt(item.main.remaining_amount, 10);
      const ivaFormatted = parseInt(item.main.iva, 10);
      const subtotalFormatted = parseInt(item.main.subtotal, 10);
      const discountFormatted = parseInt(item.main.discount, 10);
      return {
        id: item.main.id,
        biller: `${item.main.user?.first_name ?? ""} ${item.main.user?.middle_name ?? ""} ${item.main.user?.last_name ?? ""} ${item.main.user?.second_last_name ?? ""}`,
        invoice_code: item.main.invoice_code,
        paid_amount: totalAmountFormatted - remainingAmountFormatted,
        total_amount: totalAmountFormatted,
        elaboration_date: item.main.created_at,
        due_date: item.main.due_date,
        status: item.main.status,
        entity: item.main.entity,
        observations: item.main.observations,
        resolution: item.main.resolution_number,
        iva: ivaFormatted,
        subtotal: subtotalFormatted,
        discount: discountFormatted,
        invoice_linked: item.linked.map(linked => {
          const price = Number(linked.admission_data.entity_authorized_amount || 0);
          const amount = linked.linked_invoice.details.reduce((sum, procedure) => sum + Number(procedure.product.copayment || 0), 0);
          const total = price;
          return {
            id: linked.linked_invoice.id,
            patient_full_name: `${linked.admission_data.patient?.first_name ?? ""} ${linked.admission_data.patient?.middle_name ?? ""} ${linked.admission_data.patient?.last_name ?? ""} ${linked.admission_data.patient?.second_last_name ?? ""}`,
            invoice_code: linked.linked_invoice.invoice_code,
            due_date: linked.linked_invoice.due_date,
            status: linked.linked_invoice.status,
            subtotal: price + amount,
            discount: amount,
            total_amount: total,
            products: linked.linked_invoice.details.map(detail => detail.product.name).join(",")
          };
        })
      };
    });
    return dataMapped;
  }
  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const parseDate = dateString => {
    if (!dateString) return null;

    // Si es solo fecha (YYYY-MM-DD), agregamos tiempo para evitar problemas de zona horaria
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(`${dateString}T12:00:00`);
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let resultadosFiltrados = [...facturas];

    // Filtro por facturador
    if (filtros.facturador) {
      resultadosFiltrados = resultadosFiltrados.filter(factura => factura.biller.toLowerCase().includes(filtros.facturador.toLowerCase()));
    }

    // Filtro por número de factura
    if (filtros.numeroFactura) {
      resultadosFiltrados = resultadosFiltrados.filter(factura => factura.invoice_code.toLowerCase().includes(filtros.numeroFactura.toLowerCase()));
    }

    // Filtro por entidad
    if (filtros.entidad) {
      resultadosFiltrados = resultadosFiltrados.filter(factura => factura.entity?.name === filtros.entidad);
    }

    // Filtro por rango de fechas (corregido)
    if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
      const fechaInicio = new Date(filtros.fechaRango[0]);
      const fechaFin = new Date(filtros.fechaRango[1]);

      // Ajustar la fecha fin para incluir todo el día
      fechaFin.setHours(23, 59, 59, 999);
      resultadosFiltrados = resultadosFiltrados.filter(factura => {
        // Obtener la fecha relevante según el tipo seleccionado
        const fechaFacturaStr = filtros.tipoFecha === "elaboracion" ? factura.elaboration_date : factura.due_date;

        // Convertir a objeto Date
        const fechaFactura = new Date(fechaFacturaStr);

        // Validar que la fecha sea válida
        if (isNaN(fechaFactura.getTime())) return false;
        return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
      });
    }

    // Filtro por monto mínimo
    if (filtros.montoMinimo !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(factura => factura.total_amount >= filtros.montoMinimo);
    }

    // Filtro por monto máximo
    if (filtros.montoMaximo !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(factura => factura.total_amount <= filtros.montoMaximo);
    }
    setFacturasFiltradas(resultadosFiltrados);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      facturador: "",
      numeroFactura: "",
      entidad: null,
      fechaRango: null,
      montoMinimo: null,
      montoMaximo: null,
      tipoFecha: "elaboracion"
    });
    setFacturasFiltradas(facturas);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha

  function formatearFecha(fechaString) {
    // Primero normalizamos la fecha para asegurar que sea válida
    let fechaNormalizada = fechaString;

    // Si es formato "YYYY-MM-DD" sin tiempo, agregamos 'T00:00' para compatibilidad
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      fechaNormalizada += "T00:00:00";
    }
    try {
      const fecha = new Date(fechaNormalizada);
      if (isNaN(fecha.getTime())) throw new Error("Fecha inválida");
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(fecha).replace(/(\d+)/, "$1 de").replace(" de ", " de ");
    } catch {
      return "Fecha inválida";
    }
  }
  function formatearFechaISO(fechaISO) {
    // Verificar el formato esperado (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) {
      return "Formato de fecha no válido";
    }

    // Dividir la fecha en componentes
    const [año, mes, dia] = fechaISO.split("-").map(Number);

    // Crear objeto Date (mes es 0-indexed en JavaScript)
    const fecha = new Date(año, mes - 1, dia);

    // Validar que la fecha sea válida (por si viene "2025-02-30" por ejemplo)
    if (fecha.getFullYear() !== año || fecha.getMonth() + 1 !== mes || fecha.getDate() !== dia) {
      return "Fecha no válida";
    }

    // Formatear usando Intl.DateTimeFormat
    const formateador = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Ajustar el formato para que quede "día de mes, año"
    return formateador.format(fecha).replace(/(\d+)/, "$1 de").replace(" de ", " de ");
  }

  // Estilo para los tags de estado
  const getEstadoSeverity = status => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "En proceso":
        return "info";
      case "Rechazada":
      case "Vencida":
        return "danger";
      case "canceled":
        return "danger";
      default:
        return null;
    }
  };
  const createActionTemplate = (icon, label, colorClass = "") => {
    return () => /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2 p-2 point",
      style: {
        cursor: "pointer"
      } // Agrega el cursor pointer aquí
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${icon} ${colorClass}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  };
  //   Acciones para la tabla
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Generar Recibo",
      template: createActionTemplate("receipt", "Generar Recibo", "text-green-500"),
      command: () => abrirModalRecibo(rowData)
    }, {
      label: "Descargar Excel",
      template: createActionTemplate("file-excel", "Descargar Excel", "text-green-600"),
      command: () => handleDescargarExcel(rowData)
    }, {
      label: "Descargar PDF",
      template: createActionTemplate("file-pdf", "Descargar PDF", "text-red-500"),
      command: () => handleDescargarPDF(rowData)
    }, {
      label: "Imprimir",
      template: createActionTemplate("print", "Imprimir", "text-blue-500"),
      command: () => generarFormatoContable("FacturaEntidad", rowData, "Impresion")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      onClick: () => abrirModalRecibo(rowData),
      disabled: isGeneratingPDF
    }));
  };
  const handleDescargarExcel = invoice => {
    exportToExcel({
      data: invoice.invoice_linked,
      // Pasamos la factura como un array de un elemento
      fileName: `Factura_${invoice.invoice_code}`,
      excludeColumns: ["id"] // Excluimos campos que no queremos mostrar
    });
  };
  const handleDescargarPDF = async invoice => {
    setIsGeneratingPDF(true);
    try {
      // Mostrar estado de carga
      console.info("Generando PDF, por favor espere...", {
        autoClose: 2000
      });
      await exportToPDF({
        data: invoice.invoice_linked,
        fileName: `factura_${invoice.invoice_code || "sin_numero"}`
      });
    } catch (error) {
      console.error("Error en handleDescargarPDF:", {
        error,
        message: error.message,
        stack: error.stack
      });

      // Mostrar error específico al usuario
      if (error.message.includes("No se pudieron cargar las librerías")) {
        console.error("Error: No se pudieron cargar las librerías de PDF. Por favor recargue la página.");
      } else {
        console.error(`Error al generar PDF: ${error.message}`);
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  // const handleImprimirFactura = (factura: FacturacionEntidad) => {
  //   try {
  //     const PDF = window.jspdf?.jsPDF || window.jsPDF;
  //     if (!PDF) {
  //       alert("Error: Librería de PDF no cargada");
  //       return;
  //     }

  //     const doc = new PDF(); // Sin usar .default

  //     if (!window.jsPDF) {
  //       alert("Error: Librería de PDF no cargada");
  //       return;
  //     }

  //     // Para imprimir, primero generamos el PDF y luego lo abrimos en una nueva ventana
  //     const columns = [
  //       { field: "facturador", header: "Facturador" },
  //       { field: "numeroFactura", header: "N° Factura" },
  //       { field: "entidad", header: "Entidad" },
  //       { field: "montoTotal", header: "Monto Total" },
  //       { field: "montoPagado", header: "Monto Pagado" },
  //       { field: "fechaElaboracion", header: "Fecha Elaboración" },
  //       { field: "fechaVencimiento", header: "Fecha Vencimiento" },
  //       { field: "estado", header: "Estado" },
  //     ];
  //     doc.autoTable({
  //       head: [columns.map((col) => col.header)],
  //       body: columns.map((col) => {
  //         if (col.field.includes("fecha")) {
  //           return formatDate(
  //             factura[col.field as keyof FacturacionEntidad] as Date
  //           );
  //         } else if (col.field.includes("monto")) {
  //           return formatCurrency(
  //             factura[col.field as keyof FacturacionEntidad] as number
  //           );
  //         }
  //         return factura[col.field as keyof FacturacionEntidad];
  //       }),
  //     });

  //     const pdfOutput = doc.output("bloburl");
  //     window.open(pdfOutput as unknown as string, "_blank");
  //   } catch (error) {
  //     console.error("Error al imprimir factura:", error);
  //     alert("Error al generar el PDF para imprimir");
  //   }
  // };

  const abrirModalRecibo = factura => {
    console.log("Factura seleccionada para recibo:", factura);
    setFacturaParaRecibo({
      ...factura
    });
    setShowReciboModal(true);
  };
  const cerrarModalRecibo = () => {
    setShowReciboModal(false);
    setFacturaParaRecibo(null);
  };

  // const handlePagarFactura = () => {
  //   if (!facturaSeleccionada) return;

  //   setLoading(true);
  //   // Simular llamada a API para registrar el pago
  //   setTimeout(() => {
  //     const facturasActualizadas = facturas.map((f) => {
  //       if (f.id === facturaSeleccionada.id) {
  //         const nuevoMontoPagado = f.montoPagado + montoPago;
  //         const nuevoEstado =
  //           nuevoMontoPagado >= f.montoTotal ? "Pagada" : "En proceso";

  //         return {
  //           ...f,
  //           montoPagado: nuevoMontoPagado,
  //           estado: nuevoEstado,
  //         };
  //       }
  //       return f;
  //     });

  //     setFacturas(facturasActualizadas);
  //     setLoading(false);
  //   }, 1000);
  // };

  const handleGenerarRecibo = formData => {
    // Aquí puedes manejar la generación del recibo con los datos del formulario

    // Simular generación de recibo
    alert(`Recibo generado para factura ${facturaParaRecibo?.invoice_code}\nMonto: ${formatCurrency(facturaParaRecibo?.paid_amount || 0)}`);
    cerrarModalRecibo();
  };

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Facturador"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.facturador,
    onChange: e => handleFilterChange("facturador", e.target.value),
    placeholder: "Nombre del facturador",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero Factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "B0100010001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoFecha,
    options: tipoFechaOpciones,
    onChange: e => handleFilterChange("tipoFecha", e.value),
    optionLabel: "label",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaRango,
    onChange: e => {
      const value = Array.isArray(e.value) ? e.value : null;
      handleFilterChange("fechaRango", value);
    },
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true,
    readOnlyInput: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n por Entidad",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: facturasFiltradas,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron facturas",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "biller",
    header: "Facturador",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "invoice_code",
    header: "N\xB0 Factura",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "entity.name",
    header: "Entidad",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_amount",
    header: "Monto Total",
    sortable: true,
    body: rowData => formatCurrency(rowData.total_amount),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paid_amount",
    header: "Monto Pagado",
    sortable: true,
    body: rowData => formatCurrency(rowData.paid_amount),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "elaboration_date",
    header: "Fecha Elaboraci\xF3n",
    sortable: true,
    body: rowData => formatearFecha(rowData.elaboration_date),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "due_date",
    header: "Fecha Vencimiento",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.status,
      severity: getEstadoSeverity(rowData.status)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      ...styles.tableCell,
      width: "120px"
    }
  }))), /*#__PURE__*/React.createElement(NewReceiptBoxModal, {
    visible: showReciboModal,
    onHide: cerrarModalRecibo,
    onSubmit: handleGenerarRecibo,
    initialData: {
      cliente: facturaParaRecibo?.third_party?.id?.toString() || "",
      // <-- ✅ Aquí
      idFactura: facturaParaRecibo?.id || 0,
      numeroFactura: facturaParaRecibo?.invoice_code || "",
      fechaElaboracion: facturaParaRecibo?.fecha || new Date(),
      valorPagado: facturaParaRecibo?.monto || 0,
      invoiceType: "entity",
      third_party_id: facturaParaRecibo?.entity?.id || 0
    }
  }));
};