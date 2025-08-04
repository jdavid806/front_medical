import React from "react";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../../components/table-actions/DeleteTableAction.js";
import CustomDataTable from "../../components/CustomDataTable.js";
import { comissionConfig } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const MassMessageTable = ({
  massMessages,
  onEditItem,
  onDeleteItem
}) => {
  const columns = [{
    data: "title"
  }, {
    data: "message"
  }, {
    data: "specialty"
  }, {
    orderable: false,
    searchable: false
  }];
  const onDelete = async id => {
    const response = await comissionConfig.CommissionConfigDelete(id);
    console.log(response);
    SwalManager.success({
      title: "Registro Eliminado"
    });
  };
  const slots = {
    3: (cell, data) => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem && onEditItem(data.id)
    })), /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDelete(data.id)
    })))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: massMessages,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Titulo"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Mensaje"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Especialidad"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};