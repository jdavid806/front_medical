import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuditLogs } from "./hooks/useAuditLogs.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { useUsers } from "../users/hooks/useUsers.js";
import { Calendar } from 'primereact/calendar';
import { auditLogActions } from "../../services/commons.js";
export const AuditLogsApp = () => {
  const [tableItems, setTableItems] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dateRange, setDateRange] = React.useState([new Date(new Date().setDate(new Date().getDate())), new Date()]);
  const getCustomFilters = () => {
    return {
      userId: selectedUser,
      action: selectedAction,
      createdAt: dateRange?.filter(date => !!date).map(date => date.toISOString().split('T')[0]).join(",")
    };
  };
  const {
    auditLogs,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAuditLogs,
    perPage
  } = useAuditLogs(getCustomFilters);
  const {
    users
  } = useUsers();
  useEffect(() => {
    refresh();
  }, [dateRange, selectedUser, selectedAction]);
  const getAuditLogActions = () => {
    return Object.entries(auditLogActions).map(([key, label]) => ({
      value: key,
      label: label
    }));
  };
  const generateUserActionMessage = data => {
    const tableNames = {
      'entities': 'entidad',
      'users': 'usuario',
      'products': 'producto',
      'invoices': 'factura'
    };
    const action = data['action_'];
    const table = data['table_'];
    const tableReadable = tableNames[table.toLowerCase()] ?? table;
    let message;
    switch (action) {
      case 'created':
        message = `El usuario creó una nueva ${tableReadable}.`;
        break;
      case 'updated':
        message = `El usuario actualizó la ${tableReadable}.`;
        break;
      case 'deleted':
        message = `El usuario eliminó la ${tableReadable}.`;
        break;
      default:
        message = `El usuario realizó una acción (${action}) en la ${tableReadable}.`;
    }
    return message;
  };
  useEffect(() => {
    const mappedItems = auditLogs.map(logs => {
      return {
        createdAt: new Intl.DateTimeFormat('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(logs.created_at)),
        userName: `${logs.user.first_name} ${logs.user.middle_name} ${logs.user.last_name} ${logs.user.second_last_name}`,
        description: generateUserActionMessage(logs),
        originalData: logs
      };
    });
    setTableItems(mappedItems);
  }, [auditLogs]);
  const columns = [{
    field: 'createdAt',
    header: 'Realizado el',
    sortable: true
  }, {
    field: 'userName',
    header: 'Realizado por'
  }, {
    field: 'description',
    header: 'Descripción'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "branch_id",
    className: "form-label"
  }, "Usuario"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "branch_id",
    options: users,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Filtrar por usuario",
    className: "w-100",
    value: selectedUser,
    onChange: e => setSelectedUser(e.value),
    showClear: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "branch_id",
    className: "form-label"
  }, "Acciones"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "branch_id",
    options: getAuditLogActions(),
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    placeholder: "Filtrar por estado",
    className: "w-100",
    value: selectedAction,
    onChange: e => setSelectedAction(e.value),
    showClear: true
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingAuditLogs,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  }))));
};