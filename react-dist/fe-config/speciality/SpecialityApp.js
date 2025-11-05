import React, { useEffect } from 'react'; // Agregar useEffect
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

// Components
import SpecialityTable from "./components/SpecialityTable.js";
import SpecialityModal from "./components/SpecialityModal.js"; // Hook
import { useSpecialty } from "./hooks/useSpecialty.js";
import CurrentSpecialityTable from "./components/CurrentSpecialtyTable.js"; // Definir las props
export default function SpecialityApp({
  onConfigurationComplete,
  isConfigurationContext = false
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
    onDeactiveSpecialty,
    selectedAntecedent,
    setSelectedAntecedent
  } = useSpecialty();

  // Lógica para determinar si está completo
  useEffect(() => {
    const hasActiveSpecialties = currentSpecialties && currentSpecialties.length > 0;
    onConfigurationComplete?.(hasActiveSpecialties);
  }, [currentSpecialties, onConfigurationComplete]);
  const isComplete = currentSpecialties && currentSpecialties.length > 0;
  const showValidations = isConfigurationContext;
  const handleModalClose = () => {
    setShowConfigModal(false);
    resetModalForm();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(ConfirmDialog, null), showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), isComplete ? '¡Especialidades configuradas correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos una especialidad activa para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement("div", {
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
    onCie11CodeChange: setCie11Code,
    selectedAntecedent: selectedAntecedent,
    onAntecedentChange: setSelectedAntecedent
  }));
}