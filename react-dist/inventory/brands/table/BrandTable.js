import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
export const BrandTable = ({
  brands,
  onEditItem
}) => {
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-pencil"
      }),
      rounded: true,
      text: true,
      onClick: () => onEditItem(rowData.id)
    });
  };
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: brands,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    tableStyle: {
      minWidth: "30rem"
    },
    emptyMessage: "No se encontraron marcas",
    showGridlines: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true,
    style: {
      width: "20%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.name",
    header: "Nombre",
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