import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
// import { invoiceService } from "../../services/api";
import { formatDate } from "../../services/utilidades.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
import { SplitButton } from "primereact/splitbutton";
import { invoiceService } from "../../services/api/index.js";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable.js";
export const DebitCreditNotes = () => {
  const [notas, setNotas] = useState([]);
  const [notasFiltradas, setNotasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const [filtros, setFiltros] = useState({
    numeroNota: "",
    cliente: "",
    identificacion: "",
    rangoFechas: null,
    tipoNota: null
  });
  const tiposNota = [{
    label: "Débito",
    value: "Débito"
  }, {
    label: "Crédito",
    value: "Crédito"
  }];
  useEffect(() => {
    loadNotes();
  }, []);
  async function loadNotes() {
    setLoading(true);
    const responseNotes = await invoiceService.getNotes();
    console.log("Notas", responseNotes);
    const dataMapped = handleDataMapped(responseNotes.data);
    setNotas(dataMapped);
    setNotasFiltradas(dataMapped);
    setLoading(false);
  }
  function handleDataMapped(data) {
    const dataMapped = data.map(note => {
      return {
        ...note,
        cliente: note.invoice.third_party ? `${note.invoice.third_party.first_name ?? ""} ${note.invoice.third_party.middle_name ?? ""} ${note.invoice.third_party.last_name ?? ""} ${note.invoice.third_party.second_last_name ?? ""}` : "Sin cliente",
        tipo: note.type === "debit" ? "Débito" : "Crédito"
      };
    });
    return dataMapped;
  }
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    setLoading(true);
    let resultados = [...notas];

    // Filtro por número de nota
    if (filtros.numeroNota) {
      resultados = resultados.filter(nota => nota.numeroNota.toLowerCase().includes(filtros.numeroNota.toLowerCase()));
    }

    // Filtro por cliente
    if (filtros.cliente) {
      resultados = resultados.filter(nota => nota.cliente.toLowerCase().includes(filtros.cliente.toLowerCase()));
    }

    // Filtro por identificación
    if (filtros.identificacion) {
      resultados = resultados.filter(nota => nota.identificacion.includes(filtros.identificacion));
    }

    // Filtro por tipo de nota
    if (filtros.tipoNota) {
      resultados = resultados.filter(nota => nota.tipoNota === filtros.tipoNota);
    }

    // Filtro por rango de fechas
    if (filtros.rangoFechas && filtros.rangoFechas.length === 2) {
      const [inicio, fin] = filtros.rangoFechas;
      resultados = resultados.filter(nota => {
        const fechaNota = new Date(nota.fechaNota);
        return fechaNota >= inicio && fechaNota <= fin;
      });
    }
    setTimeout(() => {
      setNotasFiltradas(resultados);
      setLoading(false);
    }, 300);
  };
  const limpiarFiltros = () => {
    setFiltros({
      numeroNota: "",
      cliente: "",
      identificacion: "",
      rangoFechas: null,
      tipoNota: null
    });
    setNotasFiltradas(notas);
  };
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const getTipoNotaSeverity = tipo => {
    return tipo === "debit" ? "danger" : "success";
  };
  function handleDataMappedToExport(dataToExport) {
    const dataFormatted = dataToExport.map(item => {
      return {
        "no. nota": item.id,
        "tipo nota": item.tipo,
        cliente: item.cliente,
        factura: item.invoice.invoice_code,
        fecha_nota: formatDate(item.created_at),
        valor_nota: formatCurrency(item.amount),
        motivo: item.reason
      };
    });
    return dataFormatted;
  }
  function handleDescargarExcel(data) {
    const formatedData = handleDataMappedToExport(data);
    exportToExcel({
      data: formatedData,
      fileName: `notas`
    });
  }
  function exportToPDF(data) {
    const table = `
          <style>
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 25px;
            font-size: 12px;
          }
          th { 
            background-color: rgb(66, 74, 81); 
            color: white; 
            padding: 10px; 
            text-align: left;
            font-weight: normal;
          }
          td { 
            padding: 10px 8px; 
            border-bottom: 1px solid #eee;
          }
          </style>
      
          <table>
            <thead>
              <tr>
                <th>No. nota</th>
                <th>Tipo nota</th>
                <th>Cliente</th>
                <th>Factura</th>
                <th>Fecha nota</th>
                <th>Valor nota</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              ${data.reduce((acc, item) => acc + `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.tipo ?? ""}</td>
                  <td>${item.cliente ?? ""}</td>
                  <td>${item.invoice.invoice_code ?? ""}</td>
                  <td>${formatDate(item.created_at) ?? ""}</td>
                  <td>${formatCurrency(item.amount) ?? ""}</td>
                  <td>${item.reason ?? ""}</td>
                </tr>
              `, "")}
            </tbody>
          </table>`;
    const configPDF = {
      name: "Notes"
    };
    generatePDFFromHTML(table, company, configPDF);
  }
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
    },
    rangeCalendar: {
      width: "100%"
    }
  };
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Descargar Excel"
      // template: createActionTemplate(
      //   "file-excel",
      //   "Descargar Excel",
      //   "text-green-600"
      // ),
      // command: () => handleDescargarExcel(rowData),
    }, {
      label: "Descargar PDF"
      // template: createActionTemplate(
      //   "file-pdf",
      //   "Descargar PDF",
      //   "text-red-500"
      // ),
      // command: () => handleDescargarPDF(rowData),
    }, {
      label: "Imprimir",
      // template: createActionTemplate("print", "Imprimir", "text-blue-500"),

      // command: () => console.log("Imprimir factura", rowData),
      command: () => generarFormatoContable("NotaDebitoCredito", rowData, "Impresion")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm"
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Nota D\xE9bito/Cr\xE9dito",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "NotasDebitoCredito"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero de nota"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroNota,
    onChange: e => handleFilterChange("numeroNota", e.target.value),
    placeholder: "ND-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Cliente"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.cliente,
    onChange: e => handleFilterChange("cliente", e.target.value),
    placeholder: "Nombre del cliente",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.identificacion,
    onChange: e => handleFilterChange("identificacion", e.target.value),
    placeholder: "RNC/C\xE9dula del cliente",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de nota"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoNota,
    options: tiposNota,
    onChange: e => handleFilterChange("tipoNota", e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 col-lg-6"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.rangoFechas,
    onChange: e => handleFilterChange("rangoFechas", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango de fechas",
    className: "w-100",
    showIcon: true
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
    title: "Notas de D\xE9bito/Cr\xE9dito",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center m-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a Excel",
    tooltipOptions: {
      position: "top"
    },
    className: "p-button-success d-flex justify-content-center",
    onClick: e => {
      e.stopPropagation();
      handleDescargarExcel(notasFiltradas);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel"
  })), /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a PDF",
    tooltipOptions: {
      position: "top"
    },
    className: "p-button-secondary d-flex justify-content-center",
    onClick: e => {
      e.stopPropagation();
      exportToPDF(notasFiltradas);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  })))), /*#__PURE__*/React.createElement(DataTable, {
    value: notasFiltradas,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron notas",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "No. Nota",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Tipo nota",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.tipo,
      severity: getTipoNotaSeverity(rowData.type)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cliente",
    header: "Cliente",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "invoice.invoice_code",
    header: "Factura",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "date",
    header: "Fecha nota",
    sortable: true,
    body: rowData => formatDate(rowData.date),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Valor nota",
    sortable: true,
    body: rowData => formatCurrency(rowData.amount),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "reason",
    header: "Motivo",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      ...styles.tableCell,
      width: "120px"
    }
  }))));
};