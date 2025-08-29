import React, { useEffect, useState } from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { TableBasicActions } from "../../components/TableBasicActions.js";
import { ticketService } from "../../../services/api/index.js";
export const ModuleTable = ({
  modules,
  onEditItem,
  onDeleteItem
}) => {
  const [tableModules, setTableModules] = useState([]);
  const [reasonMap, setReasonMap] = useState({});
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await ticketService.getAllTicketReasons();
        const map = {};
        response.reasons.forEach(r => {
          map[r.key] = r.label;
        });
        setReasonMap(map);
      } catch (error) {
        console.error("Error cargando razones:", error);
      }
    };
    fetchReasons();
  }, []);
  useEffect(() => {
    if (Object.keys(reasonMap).length === 0) return;
    const mappedModules = modules.map(module_ => {
      return {
        id: module_.id,
        moduleName: module_.name,
        branchName: module_.branch.address,
        allowedReasons: module_.allowed_reasons.map(reason => reasonMap[reason] || reason).join(', ')
      };
    });
    setTableModules(mappedModules);
  }, [modules, reasonMap]);
  const columns = [{
    data: 'moduleName'
  }, {
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
  return /*#__PURE__*/React.createElement("div", {
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
  }))))));
};