import React, { useEffect, useState } from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../../components/table-actions/DeleteTableAction.js";
export const TicketReasonTable = ({
  ticketReasons,
  onEditItem,
  onDeleteItem
}) => {
  const [tableReasons, setTableReasons] = useState([]);
  useEffect(() => {
    setTableReasons(ticketReasons.map(r => ({
      id: r.id,
      label: r.label
    })));
  }, [ticketReasons]);
  const columns = [{
    data: 'label'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    1: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem(data.id.toString())
    }), /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDeleteItem(data.id.toString())
    })))
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableReasons,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Label"), /*#__PURE__*/React.createElement("th", null))))));
};