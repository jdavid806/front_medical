import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [editTransactions, setEditTransactions] = useState([]);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const {
    deleteAccountingVoucher
  } = useAccountingVoucherDelete();

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

  // Estado para el modal
  const [tipoComprobante, setTipoComprobante] = useState(null);

  // Opciones para el dropdown de nuevo comprobante
  const opcionesNuevoComprobante = [{
    label: "Recibo de Caja",
    value: "recibo_caja",
    icon: "pi-money-bill"
  }, {
    label: "Recibo de Pago",
    value: "recibo_pago",
    icon: "pi-credit-card"
  }];
  const loadData = async (pageNumber = 1, rowsData = 10) => {
    setLoading(true);
    try {
      const response = await accountingVouchersService.getAccountingVouchers({
        page: pageNumber,
        per_page: rowsData
      });
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
  const buildQueryParams = () => {
    const params = {};
    if (filtros.fechaInicio) {
      params.fecha_inicio = formatDateForAPI(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      params.fecha_fin = formatDateForAPI(filtros.fechaFin);
    }
    if (filtros.numeroComprobante) {
      params.numero_comprobante = filtros.numeroComprobante;
    }
    if (filtros.codigoContable) {
      params.codigo_contable = filtros.codigoContable;
    }
    return params;
  };
  const formatDateForAPI = date => {
    return date.toISOString().split("T")[0];
  };
  const onPageChange = event => {
    const newPage = event.first / event.rows + 1;
    setFirst(event.first);
    setRows(event.rows);
    setPage(newPage);
    loadData(newPage, event.rows);
  };
  const handleSearch = () => {
    // Resetear a la primera página al aplicar nuevos filtros
    setPage(1);
    setFirst(0);
    loadData(1);
  };
  useEffect(() => {
    if (dates && Array.isArray(dates)) {
      setFiltros({
        ...filtros,
        fechaInicio: dates[0],
        fechaFin: dates[1]
      });
    }
  }, [dates]);
  useEffect(() => {
    loadData(page);
  }, [filtros.fechaInicio, filtros.fechaFin, filtros.numeroComprobante, filtros.codigoContable]);

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
  async function handleExportPDF(vouchers) {
    const headers = `
        <tr>
            <th>Tercero</th>
            <th>Cuenta contable</th>
            <th>Descripción</th>
            <th>Debito</th>
            <th>Credito</th>
        </tr>
    `;

    // Calculamos los totales de débito y crédito
    let totalDebit = "";
    let totalCredit = "";
    const rows = vouchers.details.reduce((acc, rowData) => {
      // Sumamos al total correspondiente
      if (rowData.type === "debit") {
        totalDebit += formatCurrency(rowData.amount);
      } else if (rowData.type === "credit") {
        totalCredit += formatCurrency(rowData.amount);
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

    // Agregamos la fila de totales
    const totalRow = `
        <tr style="font-weight: bold; background-color: #f5f5f5;">
            <td colspan="3">Total</td>
            <td class="right">$${totalDebit}</td>
            <td class="right">$${totalCredit}</td>
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
        <span>Comprobante contable #: ${vouchers.id}</span>
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
        <span>Observaciones: ${vouchers.description}</span>
        </div>
    `;
    const configPDF = {
      name: "Comprobante contable #" + vouchers.seat_number,
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

  // Template para el encabezado del acordeón
  const voucherTemplate = voucher => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-full"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, voucher.seat_number), " -", /*#__PURE__*/React.createElement("span", {
      className: "mx-2"
    }, formatDate(voucher.seat_date)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, "Total: ", formatCurrency(voucher.total_is))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex text-end justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      tooltip: "Editar comprobante",
      tooltipOptions: {
        position: "top"
      },
      className: "p-button-warning",
      onClick: () => handleEditVoucher(voucher)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-to-square"
    })), /*#__PURE__*/React.createElement(Button, {
      tooltip: "Eliminar comprobante",
      tooltipOptions: {
        position: "top"
      },
      className: "p-button-danger",
      onClick: () => handleDeleteVoucher(voucher.id.toString())
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })), /*#__PURE__*/React.createElement(Button, {
      tooltip: "Exportar a PDF",
      tooltipOptions: {
        position: "top"
      },
      className: "p-button-secondary",
      onClick: () => handleExportPDF(voucher)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))));
  };

  // Handler para selección de tipo de comprobante
  const handleSeleccionTipo = value => {
    setTipoComprobante(value);
  };

  // Template para opciones del dropdown
  const itemTemplate = option => /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: `pi ${option.icon} mr-2`
  }), /*#__PURE__*/React.createElement("span", null, option.label));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Comprobante",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "CrearComprobantesContable"
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dates,
    onChange: e => setDates(e.value),
    appendTo: document.body,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione fecha",
    className: "w-100",
    showIcon: true,
    selectionMode: "range",
    readOnlyInput: true,
    hideOnRangeSelection: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
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
    className: "col-md-4"
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
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Comprobantes Contables"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center p-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-spinner pi-spin",
    style: {
      fontSize: "2rem"
    }
  }), /*#__PURE__*/React.createElement("p", null, "Cargando comprobantes...")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Accordion, {
    multiple: true
  }, vouchers.map(voucher => /*#__PURE__*/React.createElement(AccordionTab, {
    key: voucher.id,
    header: voucherTemplate(voucher)
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: voucher.details,
    className: "p-datatable-gridlines custom-datatable",
    stripedRows: true,
    size: "small"
  }, /*#__PURE__*/React.createElement(Column, {
    field: `full_name`,
    header: "Tercero",
    style: {
      width: "130px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "accounting_account.name",
    header: "Cuenta contable",
    style: {
      width: "130px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n",
    style: {
      width: "130px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "type",
    header: "Tipo",
    body: rowData => formatTypeMovement(rowData.type),
    style: {
      width: "120px"
    },
    bodyClassName: "text-right"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    body: rowData => formatCurrency(rowData.amount),
    style: {
      width: "120px"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
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
      height: "100vh",
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