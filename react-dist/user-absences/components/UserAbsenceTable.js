import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from "../../components/TableBasicActions.js";
import { formatDateDMY } from "../../../services/utilidades.js";
export const UserAbsenceTable = ({
  items,
  onEditItem,
  onDeleteItem
}) => {
  const [tableItems, setTableItems] = useState([]);
  useEffect(() => {
    const mappedItems = items.map(item => {
      return {
        id: item.id,
        doctorName: `${item.user.first_name} ${item.user.middle_name} ${item.user.last_name} ${item.user.second_last_name}`,
        reason: item.reason,
        startDate: formatDateDMY(item.start_date),
        endDate: formatDateDMY(item.end_date)
      };
    });
    setTableItems(mappedItems);
  }, [items]);
  const columns = [{
    data: 'startDate'
  }, {
    data: 'endDate'
  }, {
    data: 'doctorName'
  }, {
    data: 'reason'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    4: (cell, data) => /*#__PURE__*/React.createElement(TableBasicActions, {
      onEdit: () => onEditItem(data.id),
      onDelete: () => onDeleteItem(data.id)
    })
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableItems,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha inicial"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha final"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Usuario"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Motivo"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};