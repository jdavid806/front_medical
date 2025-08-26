import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
export default function CurrentSpecialityTable({
  specialties,
  loading,
  globalFilterValue,
  filters,
  onGlobalFilterChange,
  onDeactiveSpecialty
}) {
  const renderHeader = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "m-0"
    }, "Especialidades Activas"), /*#__PURE__*/React.createElement("span", {
      className: "p-input-icon-left"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-search"
    }), /*#__PURE__*/React.createElement(InputText, {
      value: globalFilterValue,
      onChange: onGlobalFilterChange,
      placeholder: "Buscar especialidad..."
    })));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "btn btn-sm btn-text btn-danger",
      onClick: () => onDeactiveSpecialty(rowData),
      tooltip: "Desactivar especialidad"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-xmark-circle"
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: '100%',
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: specialties,
    loading: loading,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron especialidades",
    filters: filters,
    globalFilterFields: ['name'],
    header: renderHeader(),
    responsiveLayout: "scroll"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre",
    sortable: true,
    style: {
      minWidth: '200px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      width: '120px',
      textAlign: 'center'
    }
  })));
}