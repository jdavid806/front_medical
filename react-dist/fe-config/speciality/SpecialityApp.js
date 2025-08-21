import React from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

// Components
import SpecialityTable from "./components/SpecialityTable.js";
import SpecialityModal from "./components/SpecialityModal.js"; // Hook
import { useSpecialty } from "./hooks/useSpecialty.js";
export default function SpecialityApp() {
  console.log('SpecialityApp');
  const {
    // State
    specialties,
    clinicalRecordTypes,
    loading,
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
    onGlobalFilterChange
  } = useSpecialty();
  const handleModalClose = () => {
    setShowConfigModal(false);
    resetModalForm();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(ConfirmDialog, null), /*#__PURE__*/React.createElement(SpecialityTable, {
    specialties: specialties,
    loading: loading,
    globalFilterValue: globalFilterValue,
    filters: filters,
    onGlobalFilterChange: onGlobalFilterChange,
    onConfigModalOpen: openConfigModal
  }), /*#__PURE__*/React.createElement(SpecialityModal, {
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