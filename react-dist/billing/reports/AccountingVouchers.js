import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Menu } from "primereact/menu";
import { accountingVouchersService } from "../../../services/api/index.js";
import { generatePDFFromHTMLV2 } from "../../../funciones/funcionesJS/exportPDFV2.js";
import { useCompany } from "../../hooks/useCompany.js";
import { FormAccoutingVouchers } from "./form/FormAccoutingVouchers.js";
import { Dialog } from "primereact/dialog";
import { stringToDate } from "../../../services/utilidades.js";
import { useAccountingVoucherDelete } from "./hooks/useAccountingVoucherDelete.js";
export const AccountingVouchers = () => {
  // Estado para los datos
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [editTransactions, setEditTransactions] = useState([]);
  const {
    company
  } = useCompany();
  const {
    deleteAccountingVoucher
  } = useAccountingVoucherDelete();
  const menuRef = useRef(null);

  // Estado para paginación
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    numeroComprobante: "",
    codigoContable: ""
  });
  const loadData = async (pageNumber = 1, rowsData = 10, filters = filtros) => {
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        per_page: rowsData
      };

      // Agregar filtros a los parámetros
      if (filters.fechaInicio) {
        params.fecha_inicio = formatDateForAPI(filters.fechaInicio);
      }
      if (filters.fechaFin) {
        params.fecha_fin = formatDateForAPI(filters.fechaFin);
      }
      if (filters.numeroComprobante) {
        params.numero_comprobante = filters.numeroComprobante;
      }
      if (filters.codigoContable) {
        params.codigo_contable = filters.codigoContable;
      }
      console.log("Parámetros de búsqueda:", params); // Para debug

      const response = await accountingVouchersService.getAccountingVouchers(params);
      const dataMapped = response.data.map(voucher => ({
        ...voucher,
        details: voucher.details.map(detail => ({
          ...detail,
          full_name: detail.third_party ? `${detail?.third_party?.first_name ?? ""} ${detail?.third_party?.middle_name ?? ""} ${detail?.third_party?.last_name ?? ""} ${detail?.third_party?.second_last_name ?? ""}`.trim() || detail?.third_party?.name : "No tiene terceros"
        }))
      }));
      setVouchers(dataMapped);
      setTotalRecords(response.meta.total);
      setFirst((pageNumber - 1) * rows);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatDateForAPI = date => {
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };
  const onPageChange = event => {
    const newPage = event.first / event.rows + 1;
    setFirst(event.first);
    setRows(event.rows);
    setPage(newPage);
    loadData(newPage, event.rows);
  };

  // Actualizar filtros cuando cambian las fechas - CORREGIDO
  const handleDateChange = e => {
    const selectedDates = e.value;
    setDates(selectedDates);
    if (selectedDates && selectedDates.length === 2) {
      setFiltros(prev => ({
        ...prev,
        fechaInicio: selectedDates[0],
        fechaFin: selectedDates[1]
      }));
    } else {
      setFiltros(prev => ({
        ...prev,
        fechaInicio: null,
        fechaFin: null
      }));
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadData(page);
  }, []);

  // Formatear fecha
  const formatDate = dateString => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formatear moneda
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted;
  };
  const formatTypeMovement = value => {
    switch (value) {
      case "credit":
        return "Crédito";
      case "debit":
        return "Débito";
      default:
        return value;
    }
  };
  async function handleExportPDF(voucher) {
    const headers = `
        <tr>
            <th>Tercero</th>
            <th>Cuenta contable</th>
            <th>Descripción</th>
            <th>Debito</th>
            <th>Credito</th>
        </tr>
    `;
    let totalDebit = 0;
    let totalCredit = 0;
    const rows = voucher.details.reduce((acc, rowData) => {
      if (rowData.type === "debit") {
        totalDebit += rowData.amount;
      } else if (rowData.type === "credit") {
        totalCredit += rowData.amount;
      }
      return acc + `
                <tr>
                    <td>${rowData.full_name}</td>
                    <td>${rowData.accounting_account.name}</td>
                    <td>${rowData.description}</td>
                    <td class="right">${rowData.type === "debit" ? formatCurrency(rowData.amount) : ""}</td>
                    <td class="right">${rowData.type === "credit" ? formatCurrency(rowData.amount) : ""}</td>
                </tr>
                `;
    }, "");
    const totalRow = `
        <tr style="font-weight: bold; background-color: #f5f5f5;">
            <td colspan="3">Total</td>
            <td class="right">${formatCurrency(totalDebit)}</td>
            <td class="right">${formatCurrency(totalCredit)}</td>
        </tr>
    `;
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
            .right { text-align: right; }
        </style>

        <div style="font-weight: bold; background-color: #f5f5f5; margin-bottom: 15px">
        <span>Comprobante contable #: ${voucher.id}</span>
        </div>
        <table>
            <thead>
                ${headers}
            </thead>
            <tbody>
                ${rows}
                ${totalRow}
            </tbody>
        </table>
        <div style="font-weight: bold; background-color: #f5f5f5; margin-top: 25px">
        <span>Observaciones: ${voucher.description}</span>
        </div>
    `;
    const configPDF = {
      name: "Comprobante contable #" + voucher.seat_number,
      isDownload: false
    };
    await generatePDFFromHTMLV2(table, company, configPDF);
  }
  function handleEditVoucher(voucher) {
    setSelectedVoucher(voucher);
    setEditModalVisible(true);
    setInitialData({
      id: voucher.id,
      date: stringToDate(voucher.seat_date),
      observations: voucher.description
    });
    setEditTransactions(voucher.details.map(detail => ({
      id: detail.id,
      account: detail.accounting_account_id,
      description: detail.description,
      amount: +detail.amount,
      type: detail.type,
      thirdParty: detail.third_party.id,
      thirdPartyType: detail.third_party.type
    })));
  }
  const handleDeleteVoucher = async id => {
    const confirmed = await deleteAccountingVoucher(id);
    if (confirmed) loadData(page);
  };
  const handleAplicarFiltros = () => {
    setPage(1);
    setFirst(0);
    loadData(1, rows, filtros);
  };
  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      numeroComprobante: "",
      codigoContable: ""
    });
    setDates(null);
    // Recargar datos sin filtros
    setPage(1);
    setFirst(0);
    loadData(1, rows, {
      fechaInicio: null,
      fechaFin: null,
      numeroComprobante: "",
      codigoContable: ""
    });
  };
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete,
    onExport
  }) => {
    const menu = useRef(null);
    const menuItems = [{
      label: "Editar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit me-2"
      }),
      command: () => onEdit(rowData)
    }, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash me-2"
      }),
      command: () => onDelete(rowData.id.toString())
    }, {
      label: "Exportar PDF",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      command: () => onExport(rowData)
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2 p-button-sm",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionsTemplate = rowData => {
    return /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData,
      onEdit: handleEditVoucher,
      onDelete: handleDeleteVoucher,
      onExport: handleExportPDF
    });
  };
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3",
      style: {
        backgroundColor: '#f8f9fa'
      }
    }, /*#__PURE__*/React.createElement("h5", null, "Detalles del Comprobante #", data.seat_number), /*#__PURE__*/React.createElement(DataTable, {
      value: data.details,
      className: "p-datatable-gridlines",
      stripedRows: true,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "full_name",
      header: "Tercero",
      style: {
        width: "200px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "accounting_account.name",
      header: "Cuenta contable",
      style: {
        width: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n",
      style: {
        width: "200px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "type",
      header: "Tipo",
      body: rowData => formatTypeMovement(rowData.type),
      style: {
        width: "120px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "amount",
      header: "Monto",
      body: rowData => formatCurrency(rowData.amount),
      style: {
        width: "150px"
      },
      bodyClassName: "text-right"
    })));
  };
  const onRowToggle = e => {
    setExpandedRows(e.data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2",
    style: {
      marginTop: "-10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Comprobante",
    className: "p-button-primary",
    onClick: () => window.location.href = "CrearComprobantesContable"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }))), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dates,
    onChange: handleDateChange,
    appendTo: document.body,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango de fechas",
    className: "w-100",
    showIcon: true,
    selectionMode: "range",
    readOnlyInput: true,
    hideOnRangeSelection: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xB0 Comprobante"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroComprobante,
    onChange: e => setFiltros({
      ...filtros,
      numeroComprobante: e.target.value
    }),
    placeholder: "Buscar por n\xFAmero",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "C\xF3digo Contable"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.codigoContable,
    onChange: e => setFiltros({
      ...filtros,
      codigoContable: e.target.value
    }),
    placeholder: "Buscar por c\xF3digo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 d-flex align-items-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-search",
    className: "p-button-primary",
    onClick: handleAplicarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }))))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center p-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-spinner pi-spin",
    style: {
      fontSize: "2rem"
    }
  }), /*#__PURE__*/React.createElement("p", null, "Cargando comprobantes...")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DataTable, {
    value: vouchers,
    expandedRows: expandedRows,
    onRowToggle: onRowToggle,
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "id",
    className: "p-datatable-gridlines",
    stripedRows: true,
    size: "small",
    emptyMessage: "No se encontraron comprobantes"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3rem'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "seat_number",
    header: "N\xB0 Comprobante",
    style: {
      width: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "seat_date",
    header: "Fecha",
    body: rowData => formatDate(rowData.seat_date),
    style: {
      width: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_is",
    header: "Total",
    body: rowData => formatCurrency(rowData.total_is),
    style: {
      width: "130px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n",
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionsTemplate,
    style: {
      width: "150px"
    },
    align: "center"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Paginator, {
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    onPageChange: onPageChange,
    rowsPerPageOptions: [10, 20, 30],
    template: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
  })))), /*#__PURE__*/React.createElement(Dialog, {
    visible: editModalVisible,
    header: "Editar Comprobante",
    onHide: () => setEditModalVisible(false),
    style: {
      width: "90vw",
      height: "85vh",
      maxHeight: "100vh"
    },
    modal: true,
    closable: true
  }, /*#__PURE__*/React.createElement(FormAccoutingVouchers, {
    voucherId: selectedVoucher?.id.toString() || "",
    initialData: initialData,
    editTransactions: editTransactions,
    onUpdate: () => {
      loadData(page);
      setEditModalVisible(false);
    }
  })));
};