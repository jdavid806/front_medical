import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { CustomModal } from "../../../components/CustomModal.js";
export default function SpecialityModal({
  visible,
  selectedSpecialty,
  clinicalRecordTypes,
  specializableElements,
  selectedClinicalRecord,
  cie11Code,
  onHide,
  onSave,
  onAddClinicalRecord,
  onAddCie11Code,
  onRemoveElement,
  onClinicalRecordChange,
  onCie11CodeChange
}) {
  const confirmRemove = index => {
    confirmDialog({
      message: '¿Está seguro de que desea eliminar este elemento?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onRemoveElement(index)
    });
  };
  const modalFooter = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-outline-primary",
    onClick: onHide
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary my-0",
    onClick: onSave
  }, "Guardar"));
  return /*#__PURE__*/React.createElement(CustomModal, {
    title: "Vincular Historias Cl\xEDnicas y CIE-11",
    show: visible,
    onHide: onHide,
    footerTemplate: modalFooter
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "mb-3"
  }, "Historias Cl\xEDnicas"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clinical-record",
    className: "form-label"
  }, "Seleccione Historia Cl\xEDnica"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "clinical-record",
    value: selectedClinicalRecord,
    options: clinicalRecordTypes,
    onChange: e => onClinicalRecordChange(e.value),
    optionLabel: "name",
    placeholder: "Seleccione una historia cl\xEDnica",
    className: "w-100",
    filter: true,
    filterBy: "name",
    showClear: true,
    style: {
      zIndex: 100000
    },
    panelStyle: {
      zIndex: 100000
    },
    appendTo: "self"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary my-0 w-100",
    onClick: onAddClinicalRecord,
    disabled: !selectedClinicalRecord
  }, "Agregar Historia Cl\xEDnica")), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "mb-3"
  }, "Listado de CIE-11"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cie11-code",
    className: "form-label"
  }, "Escriba un C\xF3digo CIE-11"), /*#__PURE__*/React.createElement(InputText, {
    id: "cie11-code",
    value: cie11Code,
    onChange: e => onCie11CodeChange(e.target.value),
    placeholder: "C\xF3digo CIE-11",
    className: "w-100",
    onKeyPress: e => e.key === 'Enter' && onAddCie11Code()
  })), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary my-0 w-100",
    onClick: onAddCie11Code,
    disabled: !cie11Code.trim()
  }, "Agregar CIE-11"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "mb-3"
  }, "Elementos Agregados"), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: specializableElements,
    emptyMessage: "No hay elementos agregados",
    className: "p-datatable-striped",
    size: "small"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "specializable_type",
    header: "Tipo"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "display_name",
    header: "Nombre"
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acci\xF3n",
    body: (rowData, options) => /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: () => confirmRemove(options.rowIndex),
      tooltip: "Eliminar elemento"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })),
    style: {
      width: '100px',
      textAlign: 'center'
    }
  })))));
}