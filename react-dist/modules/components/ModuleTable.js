import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { ticketReasons } from "../../../services/commons.js";
import { TableBasicActions } from "../../components/TableBasicActions.js";
export const ModuleTable = ({
  modules,
  onEditItem,
  onDeleteItem
}) => {
  const [tableModules, setTableModules] = useState([]);
  useEffect(() => {
    const mappedModules = modules.map(module_ => {
      return {
        id: module_.id,
        moduleName: module_.name,
        branchName: module_.branch.address,
        allowedReasons: module_.allowed_reasons.map(reason => ticketReasons[reason]).join(', ')
      };
    });
    setTableModules(mappedModules);
  }, [modules]);
  const columns = [{
    data: 'moduleName'
  },
  // { data: 'branchName' },
  {
    data: 'allowedReasons'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    2: (cell, data) => /*#__PURE__*/React.createElement(TableBasicActions, {
      onEdit: () => onEditItem(data.id),
      onDelete: () => onDeleteItem(data.id)
    })
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableModules,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Motivos de visita a atender"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};