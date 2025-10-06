import React, { useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

// Components
import SpecialityTable from "./components/SpecialityTable.js";
import SpecialityModal from "./components/SpecialityModal.js"; // Hook
import { useSpecialty } from "./hooks/useSpecialty.js";
import CurrentSpecialityTable from "./components/CurrentSpecialtyTable.js";
export default function SpecialityApp({
  onConfigurationComplete
}) {
  const {
    // State
    specialties,
    currentSpecialties,
    clinicalRecordTypes,
    loading,
    loadingCurrentSpecialties,
    showConfigModal,
    selectedSpecialty,
    specializableElements,
    selectedClinicalRecord,
    cie11Code,
    globalFilterValue,
    filters,
    toast,
    // Setters
    setShowConfigModal,
    setSelectedClinicalRecord,
    setCie11Code,
    // Functions
    openConfigModal,
    addClinicalRecord,
    addCie11Code,
    removeSpecializableElement,
    saveSpecializableElements,
    resetModalForm,
    onGlobalFilterChange,
    onActiveSpecialty,
    onDeactiveSpecialty
  } = useSpecialty();
  useEffect(() => {
    const hasCurrentSpecialties = currentSpecialties && currentSpecialties.length > 0;
    onConfigurationComplete?.(hasCurrentSpecialties);
  }, [currentSpecialties, specialties, onConfigurationComplete]);
  const handleModalClose = () => {
    setShowConfigModal(false);
    resetModalForm();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(ConfirmDialog, null), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info p-2"
  }, /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle me-2"
  }), "Configure al menos una especialidad activa para poder continuar al siguiente subm\xF3dulo."))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-6 col-xl-6 col-12"
  }, /*#__PURE__*/React.createElement(SpecialityTable, {
    specialties: specialties,
    loading: loading,
    globalFilterValue: globalFilterValue,
    filters: filters,
    onGlobalFilterChange: onGlobalFilterChange,
    onConfigModalOpen: openConfigModal,
    onActiveSpecialty: onActiveSpecialty
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-6 col-xl-6 col-12"
  }, /*#__PURE__*/React.createElement(CurrentSpecialityTable, {
    specialties: currentSpecialties,
    loading: loadingCurrentSpecialties,
    globalFilterValue: globalFilterValue,
    filters: filters,
    onGlobalFilterChange: onGlobalFilterChange,
    onDeactiveSpecialty: onDeactiveSpecialty
  }))), /*#__PURE__*/React.createElement(SpecialityModal, {
    visible: showConfigModal,
    selectedSpecialty: selectedSpecialty,
    clinicalRecordTypes: clinicalRecordTypes,
    specializableElements: specializableElements,
    selectedClinicalRecord: selectedClinicalRecord,
    cie11Code: cie11Code,
    onHide: handleModalClose,
    onSave: saveSpecializableElements,
    onAddClinicalRecord: addClinicalRecord,
    onAddCie11Code: addCie11Code,
    onRemoveElement: removeSpecializableElement,
    onClinicalRecordChange: setSelectedClinicalRecord,
    onCie11CodeChange: setCie11Code
  }));
}