import React from 'react';
import { Button } from 'primereact/button';
import { CustomPRTable } from "../components/CustomPRTable.js";
import { natureSeverity } from "./utils/AccountingAccountUtils.js";
export const TreeAccountingAccountDetail = ({
  nodePath,
  onAddSubAccount,
  onEditAccount
}) => {
  const columns = [{
    field: 'level',
    header: 'Nivel',
    body: data => /*#__PURE__*/React.createElement("span", {
      className: `badge bg-secondary opacity-75`
    }, data.level)
  }, {
    field: 'account_code',
    header: 'Código'
  }, {
    field: 'account_name',
    header: 'Nombre'
  }, {
    field: 'nature_code',
    header: ' Naturaleza',
    body: data => /*#__PURE__*/React.createElement("span", {
      className: `badge bg-${natureSeverity(data.nature_code)} opacity-75`
    }, data.nature_label)
  }, {
    field: 'account_type_name',
    header: 'Tipo',
    body: data => /*#__PURE__*/React.createElement("span", {
      className: `badge bg-info opacity-75`
    }, data.account_type_name)
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between gap-2 align-items-center w-100 flex-wrap mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Jerarquia de la cuenta"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva subcuenta",
    onClick: onAddSubAccount,
    className: "p-button-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus",
    style: {
      marginLeft: "10px"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Editar cuenta",
    onClick: onEditAccount,
    className: "p-button-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit",
    style: {
      marginLeft: "10px"
    }
  })))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: nodePath,
    disableReload: true,
    disableSearch: true,
    disablePaginator: true,
    size: "small"
  }));
};