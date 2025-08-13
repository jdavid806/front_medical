import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
export const PharmacyInvoices = ({
  invoices,
  lazyState,
  loading,
  totalRecords,
  onPage
}) => {
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Descargar Excel",
      command: () => {
        // Lógica para descargar en Excel
        console.log("Descargar Excel", rowData);
      }
    }, {
      label: "Descargar PDF",
      command: () => {
        // Lógica para descargar en PDF
        console.log("Descargar PDF", rowData);
      }
    }, {
      label: "Imprimir",
      command: () => {
        // Lógica para imprimir
        console.log("Imprimir", rowData);
      }
    }];
    return /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      className: "p-button-sm"
    });
  };
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: invoices,
    lazy: true,
    paginator: true,
    first: lazyState.first,
    rows: lazyState.rows,
    totalRecords: totalRecords,
    onPage: onPage,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    tableStyle: {
      minWidth: "30rem"
    },
    emptyMessage: "No se encontraron facturas",
    showGridlines: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "invoice",
    header: "Factura",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "date",
    header: "Fecha",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "client",
    header: "Cliente",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paid",
    header: "Pagado",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "remaining_amount",
    header: "Restante",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_amount",
    header: "Monto",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    sortable: true,
    style: {
      width: "60%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "20%",
      textAlign: "center"
    }
  })));
};