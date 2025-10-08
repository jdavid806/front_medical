import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { SpecialtyPatientViewConfigForm } from "./SpecialtyPatientViewConfigForm.js";
import { Divider } from 'primereact/divider';
export default function CurrentSpecialityTable({
  specialties,
  loading,
  globalFilterValue,
  filters,
  onGlobalFilterChange,
  onDeactiveSpecialty
}) {
  const [showPatientViewConfigModal, setShowPatientViewConfigModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const openPatientViewConfigmModal = rowData => {
    setSelectedItem(rowData);
    setShowPatientViewConfigModal(true);
  };
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
    return /*#__PURE__*/React.createElement(CurrentSpecialityTableActions, {
      onDeactiveSpecialty: () => onDeactiveSpecialty(rowData),
      onShowPatientViewConfig: () => openPatientViewConfigmModal(rowData)
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showPatientViewConfigModal,
    header: "Configurar vista de paciente",
    onHide: () => setShowPatientViewConfigModal(false),
    style: {
      width: "70vw"
    }
  }, !selectedItem && /*#__PURE__*/React.createElement(React.Fragment, null, "Selecciona una especialidad"), selectedItem && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SpecialtyPatientViewConfigForm, {
    formId: "specialtyPatientViewConfigForm",
    specialty: selectedItem
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    type: "button",
    onClick: () => setShowPatientViewConfigModal(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times me-2"
  }), "Cancelar"), /*#__PURE__*/React.createElement("button", {
    form: "specialtyPatientViewConfigForm",
    className: "btn btn-primary",
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-save me-2"
  }), "Guardar")))));
}
export const CurrentSpecialityTableActions = props => {
  const {
    onDeactiveSpecialty,
    onShowPatientViewConfig
  } = props;
  const menuActions = useRef(null);
  const actions = [{
    label: 'Configurar vista de paciente',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-upload me-2"
    }),
    command: () => {
      onShowPatientViewConfig();
    }
  }, {
    label: 'Desactivar especialidad',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-xmark-circle me-2"
    }),
    command: () => {
      onDeactiveSpecialty();
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu, {
    model: actions,
    popup: true,
    ref: menuActions,
    id: "popup_menu_actions"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: event => menuActions.current?.toggle(event),
    "aria-controls": "popup_menu_actions",
    "aria-haspopup": true
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog"
  }), " Acciones"));
};